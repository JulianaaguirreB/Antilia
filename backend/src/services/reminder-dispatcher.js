const { pool } = require('../db');
const { transaction } = require('../http');
const { sendEmail, emailConfigured } = require('./email');
const { nextDaily } = require('./reminder-schedule');

async function dispatchReminders({ limit = 10, send = sendEmail } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error('El lote debe tener entre 1 y 50 recordatorios.');
  if (send === sendEmail && !emailConfigured()) throw new Error('El servicio de correo no está configurado.');
  const counts = { sent: 0, failed: 0, missed: 0, disabled: 0 };
  for (let i = 0; i < limit; i++) {
    const candidates = await pool.query(`SELECT r.id, r.user_id FROM reminders r LEFT JOIN reminder_deliveries d ON d.reminder_id = r.id AND d.scheduled_for = r.next_run_at
      WHERE r.enabled AND r.next_run_at <= now() AND (d.id IS NULL OR d.next_attempt_at <= now()) ORDER BY r.next_run_at, r.id LIMIT 1`);
    if (!candidates.rows.length) break;
    const candidate = candidates.rows[0];
    const outcome = await transaction(async client => {
      const users = await client.query('SELECT email, email_verified_at FROM users WHERE id = $1 FOR UPDATE', [candidate.user_id]);
      if (!users.rows.length) return null;
      const claimed = await client.query('SELECT *, next_run_at::text AS occurrence FROM reminders WHERE id = $1 AND enabled AND next_run_at <= now() FOR UPDATE SKIP LOCKED', [candidate.id]);
      if (!claimed.rows.length) return null;
      const reminder = claimed.rows[0];
      const user = users.rows[0];
      if (!user.email_verified_at) {
        await client.query('UPDATE reminders SET enabled = false, updated_at = now() WHERE id = $1', [reminder.id]);
        return 'disabled';
      }
      await client.query("INSERT INTO reminder_deliveries (reminder_id, scheduled_for, status) VALUES ($1, $2, 'pending') ON CONFLICT (reminder_id, scheduled_for) DO NOTHING", [reminder.id, reminder.occurrence]);
      const deliveryResult = await client.query('SELECT *, next_attempt_at <= now() AS ready FROM reminder_deliveries WHERE reminder_id = $1 AND scheduled_for = $2 FOR UPDATE', [reminder.id, reminder.occurrence]);
      const delivery = deliveryResult.rows[0];
      if (!delivery.ready) return null;
      const advance = async () => {
        if (reminder.schedule_type === 'daily') await client.query('UPDATE reminders SET next_run_at = $1, updated_at = now() WHERE id = $2', [nextDaily(reminder.local_time), reminder.id]);
        else await client.query('UPDATE reminders SET enabled = false, updated_at = now() WHERE id = $1', [reminder.id]);
      };
      if (delivery.status === 'sent' || delivery.status === 'missed') {
        await advance();
        return null;
      }
      if (Date.now() - reminder.next_run_at.getTime() > 5 * 60 * 1000) {
        await client.query("UPDATE reminder_deliveries SET status = 'missed', error_code = 'WINDOW_EXPIRED' WHERE id = $1", [delivery.id]);
        await advance();
        return 'missed';
      }
      try {
        const providerId = await send({ to: user.email, subject: `Antilia: ${reminder.title}`, text: `${reminder.title}\n\n${reminder.message}\n\nPuedes desactivar este recordatorio desde tu cuenta de Antilia.`, idempotencyKey: `antilia-reminder-${delivery.id}` });
        await client.query("UPDATE reminder_deliveries SET status = 'sent', attempts = attempts + 1, provider_id = $1, error_code = NULL, sent_at = now() WHERE id = $2", [providerId, delivery.id]);
        await advance();
        return 'sent';
      } catch (error) {
        const code = typeof error.code === 'string' && /^[A-Z0-9_]{1,60}$/.test(error.code) ? error.code : 'EMAIL_PROVIDER_ERROR';
        const delay = Math.min(120, 30 * 2 ** Math.min(delivery.attempts, 3));
        await client.query("UPDATE reminder_deliveries SET status = 'failed', attempts = attempts + 1, error_code = $1, next_attempt_at = now() + $2 * interval '1 second' WHERE id = $3", [code, delay, delivery.id]);
        return 'failed';
      }
    });
    if (outcome) counts[outcome]++;
  }
  return counts;
}

module.exports = { dispatchReminders };
