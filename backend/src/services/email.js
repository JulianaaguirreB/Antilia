const { problem } = require('../http');

function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.REMINDER_FROM);
}

async function sendEmail({ to, subject, text, idempotencyKey }) {
  if (!emailConfigured()) throw problem(503, 'El servicio de correo no está configurado.');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({ from: process.env.REMINDER_FROM, to: [to], subject, text }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw Object.assign(new Error('No se pudo entregar el correo al proveedor.'), { code: `EMAIL_HTTP_${response.status}` });
  const data = await response.json();
  if (typeof data.id !== 'string') throw Object.assign(new Error('Respuesta de correo inválida.'), { code: 'EMAIL_INVALID_RESPONSE' });
  return data.id;
}

module.exports = { sendEmail, emailConfigured };
