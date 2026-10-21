const express = require('express');
const crypto = require('crypto');
const { requireAuth } = require('../../shared/middleware/auth');
const { transaction, problem, route } = require('../../shared/http');
const { body } = require('../../shared/release2-validation');
const { sendEmail, emailConfigured } = require('../../infrastructure/mail/email');

const router = express.Router();
router.use(requireAuth);

router.post('/request', route(async (req, res) => {
  if (!emailConfigured()) throw problem(503, 'El servicio de correo no está configurado.');
  const result = await transaction(async client => {
    const found = await client.query('SELECT email, email_verified_at FROM users WHERE id = $1 FOR UPDATE', [req.userId]);
    if (!found.rows.length) throw problem(404, 'Usuario no encontrado.');
    const user = found.rows[0];
    if (user.email_verified_at) return { verified: true };
    const previous = await client.query("SELECT 1 FROM email_verifications WHERE user_id = $1 AND requested_at > now() - interval '60 seconds'", [req.userId]);
    if (previous.rows.length) throw problem(429, 'Espera un minuto antes de pedir otro código.');
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    await client.query("INSERT INTO email_verifications (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '30 minutes') ON CONFLICT (user_id) DO UPDATE SET token_hash = EXCLUDED.token_hash, expires_at = EXCLUDED.expires_at, requested_at = now()", [req.userId, hash]);
    await sendEmail({ to: user.email, subject: 'Confirma tu correo en Antilia', text: `Tu código de verificación de Antilia es:\n${token}\n\nVence en 30 minutos. Si no lo pediste, ignora este mensaje.`, idempotencyKey: `verify-${req.userId}-${hash}` });
    return { verified: false, status: 'pending', expires_in_seconds: 1800 };
  });
  res.status(result.verified ? 200 : 202).json(result);
}));

router.post('/confirm', route(async (req, res) => {
  const input = body(req.body, ['token']);
  if (typeof input.token !== 'string' || !/^[0-9a-f]{64}$/.test(input.token)) throw problem(400, 'Código de verificación inválido o vencido.');
  const hash = crypto.createHash('sha256').update(input.token).digest('hex');
  await transaction(async client => {
    await client.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [req.userId]);
    const valid = await client.query('DELETE FROM email_verifications WHERE user_id = $1 AND token_hash = $2 AND expires_at > now() RETURNING user_id', [req.userId, hash]);
    if (!valid.rows.length) throw problem(400, 'Código de verificación inválido o vencido.');
    await client.query('UPDATE users SET email_verified_at = now(), updated_at = now() WHERE id = $1', [req.userId]);
  });
  res.json({ verified: true });
}));

module.exports = router;
