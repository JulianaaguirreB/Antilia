const { transaction, problem } = require('../../shared/http');
const { sendEmail, emailConfigured } = require('./email');

async function welcomeEmail(userId, retry = false) {
  return transaction(async client => {
    const { rows: [user] } = await client.query('SELECT id, name, email, welcome_email_sent_at, welcome_email_attempted_at FROM users WHERE id=$1 FOR UPDATE', [userId]);
    if (!user) throw problem(404, 'No encontramos tu cuenta.');
    if (user.welcome_email_sent_at) return 'sent';
    if (retry && user.welcome_email_attempted_at && Date.now() - new Date(user.welcome_email_attempted_at).getTime() < 60000) throw problem(429, 'Espera un minuto antes de volver a intentar.');
    await client.query('UPDATE users SET welcome_email_attempted_at=now() WHERE id=$1', [userId]);
    if (!emailConfigured()) return 'unavailable';
    const appUrl = (process.env.APP_URL || 'https://antilia-delta.vercel.app').replace(/\/$/, '');
    try {
      await sendEmail({to:user.email, subject:'Bienvenido a Antilia · the space is yours', text:`Hola, ${user.name}.\n\nTu cuenta de Antilia ya está creada. Organiza tus espacios, guarda tus pendientes y enciende tu constelación con Lumi.\n\nEntra a tu cuenta: ${appUrl}/#/acceso\n\nPuedes confirmar tu correo desde Perfil para activar tus recordatorios. Nunca te pediremos tu contraseña por correo.\n\nSi no creaste esta cuenta, puedes ignorar este mensaje.\nEl equipo de Antilia`, idempotencyKey:`welcome-${user.id}`});
      await client.query('UPDATE users SET welcome_email_sent_at=now() WHERE id=$1', [userId]);
      return 'sent';
    } catch { return 'failed'; }
  });
}
module.exports = { welcomeEmail };
