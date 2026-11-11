const { problem } = require('../../shared/http');

function emailConfigured() {
  return Boolean((process.env.RESEND_API_KEY && process.env.REMINDER_FROM) || (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM));
}

async function sendEmail({ to, subject, text, idempotencyKey }) {
  if (!emailConfigured()) throw problem(503, 'El servicio de correo no está configurado.');
  if (!(process.env.RESEND_API_KEY && process.env.REMINDER_FROM)) {
    const nodemailer = require('nodemailer');
    const transport = nodemailer.createTransport({ host:process.env.SMTP_HOST, port:Number(process.env.SMTP_PORT || 465), secure:process.env.SMTP_SECURE !== 'false', auth:{ user:process.env.SMTP_USER, pass:process.env.SMTP_PASS }, connectionTimeout:10000, greetingTimeout:10000, socketTimeout:10000 });
    try {
      const sent = await transport.sendMail({ from:process.env.SMTP_FROM, to, subject, text });
      if (!sent.accepted?.length) throw new Error('Destinatario rechazado.');
      return sent.messageId;
    } catch { throw problem(503, 'No se pudo enviar el correo. Revisa la configuración del remitente o intenta más tarde.'); }
    finally { transport.close(); }
  }
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
