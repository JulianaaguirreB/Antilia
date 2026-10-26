const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validateEmail, validatePassword } = require('../../shared/validate');
const { route, transaction, problem } = require('../../shared/http');
const { body } = require('../../shared/release2-validation');
const { sendEmail, emailConfigured } = require('../../infrastructure/mail/email');

const router = express.Router();
router.post('/request', route(async (req, res) => {
  const input = body(req.body, ['email']);
  const email = validateEmail(input.email);
  if (!emailConfigured()) throw problem(503, 'La recuperación por correo todavía no está configurada.');
  await transaction(async client => {
    const found = await client.query('SELECT id FROM users WHERE email = $1 FOR UPDATE', [email]);
    if (!found.rows.length) return;
    const userId = found.rows[0].id;
    const recent = await client.query("SELECT 1 FROM password_resets WHERE user_id = $1 AND requested_at > now() - interval '5 minutes'", [userId]);
    if (recent.rows.length) return;
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    await client.query("INSERT INTO password_resets(user_id,token_hash,expires_at) VALUES($1,$2,now()+interval '30 minutes') ON CONFLICT(user_id) DO UPDATE SET token_hash=EXCLUDED.token_hash,expires_at=EXCLUDED.expires_at,requested_at=now()", [userId, hash]);
    let link = '';
    if (process.env.APP_URL) {
      const address = new URL(process.env.APP_URL);
      address.hash = '/recuperar?email=' + encodeURIComponent(email) + '&code=' + token;
      link = '\n\nTambién puedes abrir este enlace:\n' + address.toString();
    }
    await sendEmail({ to: email, subject: 'Recupera tu acceso a Antilia', text: `Tu código para recuperar el acceso es:\n${token}\n\nVence en 30 minutos. Si no lo pediste, ignora este mensaje.${link}`, idempotencyKey: `reset-${userId}-${hash}` });
  });
  res.status(202).json({ message: 'Si existe una cuenta con ese correo, recibirás las instrucciones.' });
}));

router.post('/confirm', route(async (req, res) => {
  const input = body(req.body, ['email', 'token', 'password']);
  const email = validateEmail(input.email);
  if (typeof input.token !== 'string' || !/^[a-f0-9]{64}$/.test(input.token)) throw problem(400, 'Código inválido o vencido.');
  const password = validatePassword(input.password);
  const hash = crypto.createHash('sha256').update(input.token).digest('hex');
  const passwordHash = await bcrypt.hash(password, 10);
  await transaction(async client => {
    const found = await client.query('SELECT id FROM users WHERE email = $1 FOR UPDATE', [email]);
    if (!found.rows.length) throw problem(400, 'Código inválido o vencido.');
    const userId = found.rows[0].id;
    const result = await client.query('DELETE FROM password_resets WHERE user_id=$1 AND token_hash=$2 AND expires_at>now() RETURNING user_id', [userId, hash]);
    if (!result.rows.length) throw problem(400, 'Código inválido o vencido.');
    await client.query('UPDATE users SET password_hash=$1, token_version=token_version+1, updated_at=now() WHERE id=$2', [passwordHash, userId]);
  });
  res.json({ message: 'Contraseña actualizada. Inicia sesión de nuevo.' });
}));
module.exports = router;
