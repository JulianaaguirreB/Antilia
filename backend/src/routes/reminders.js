const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validateString } = require('../validate');
const { body, uuid, boolean } = require('../release2-validation');
const { transaction, route, problem } = require('../http');
const { schedule, nextDaily } = require('../services/reminder-schedule');
const { emailConfigured } = require('../services/email');

const router = express.Router();
router.use(requireAuth);

async function checkRecipient(client, userId) {
  const result = await client.query('SELECT email_verified_at FROM users WHERE id = $1 FOR UPDATE', [userId]);
  if (!result.rows.length) throw problem(404, 'Usuario no encontrado.');
  if (!result.rows[0].email_verified_at) throw problem(409, 'Confirma tu correo antes de activar recordatorios.');
  if (!emailConfigured()) throw problem(503, 'El servicio de correo no está configurado.');
}

router.get('/', route(async (req, res) => {
  const result = await pool.query('SELECT * FROM reminders WHERE user_id = $1 ORDER BY created_at, id', [req.userId]);
  res.json({ reminders: result.rows, email_configured: emailConfigured(), timezone: 'America/Bogota' });
}));

router.post('/', route(async (req, res) => {
  const input = body(req.body, ['title', 'message', 'schedule_type', 'scheduled_at', 'local_time', 'timezone', 'enabled']);
  const title = validateString(input.title, 'title', 1, 120);
  const message = validateString(input.message ?? '', 'message', 0, 1000);
  const enabled = input.enabled === undefined ? true : boolean(input.enabled, 'enabled');
  const timing = schedule(input);
  const reminder = await transaction(async client => {
    if (enabled) await checkRecipient(client, req.userId);
    const result = await client.query('INSERT INTO reminders (user_id, title, message, schedule_type, local_time, next_run_at, enabled) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.userId, title, message, timing.schedule_type, timing.local_time, timing.next_run_at, enabled]);
    return result.rows[0];
  });
  res.status(201).json({ reminder });
}));

router.patch('/:id', route(async (req, res) => {
  const id = uuid(req.params.id, 'Recordatorio');
  const input = body(req.body, ['title', 'message', 'schedule_type', 'scheduled_at', 'local_time', 'timezone', 'enabled']);
  const reminder = await transaction(async client => {
    await client.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [req.userId]);
    const found = await client.query('SELECT * FROM reminders WHERE id = $1 AND user_id = $2 FOR UPDATE', [id, req.userId]);
    if (!found.rows.length) throw problem(404, 'Recordatorio no encontrado.');
    const previous = found.rows[0];
    const title = input.title === undefined ? previous.title : validateString(input.title, 'title', 1, 120);
    const message = input.message === undefined ? previous.message : validateString(input.message, 'message', 0, 1000);
    const enabled = input.enabled === undefined ? previous.enabled : boolean(input.enabled, 'enabled');
    const reschedule = ['schedule_type', 'scheduled_at', 'local_time', 'timezone'].some(key => input[key] !== undefined);
    let timing = previous;
    if (reschedule) timing = schedule({ ...input, schedule_type: input.schedule_type ?? previous.schedule_type, local_time: input.local_time ?? (previous.schedule_type === 'daily' && input.schedule_type !== 'once' ? previous.local_time.slice(0, 5) : undefined) });
    if (enabled) {
      await checkRecipient(client, req.userId);
      if (!previous.enabled && !reschedule) {
        if (previous.schedule_type === 'daily') timing = { ...previous, next_run_at: nextDaily(previous.local_time) };
        else if (previous.next_run_at <= new Date()) throw problem(400, 'Elige una nueva fecha para reactivar este recordatorio.');
      }
    }
    const result = await client.query('UPDATE reminders SET title = $1, message = $2, schedule_type = $3, local_time = $4, next_run_at = $5, enabled = $6, updated_at = now() WHERE id = $7 AND user_id = $8 RETURNING *', [title, message, timing.schedule_type, timing.local_time, timing.next_run_at, enabled, id, req.userId]);
    return result.rows[0];
  });
  res.json({ reminder });
}));

router.get('/:id/deliveries', route(async (req, res) => {
  const result = await pool.query('SELECT d.scheduled_for, d.status, d.attempts, d.sent_at, d.error_code FROM reminder_deliveries d JOIN reminders r ON r.id = d.reminder_id WHERE r.id = $1 AND r.user_id = $2 ORDER BY d.scheduled_for DESC LIMIT 100', [uuid(req.params.id, 'Recordatorio'), req.userId]);
  const owner = await pool.query('SELECT 1 FROM reminders WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
  if (!owner.rows.length) throw problem(404, 'Recordatorio no encontrado.');
  res.json({ deliveries: result.rows });
}));

module.exports = router;
