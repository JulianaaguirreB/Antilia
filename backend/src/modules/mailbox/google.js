const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { problem } = require('../../shared/http');
function configured() {
  try { return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && new URL(process.env.GOOGLE_REDIRECT_URI).pathname === '/api/mailbox/callback' && Buffer.from(process.env.GMAIL_TOKEN_KEY || '', 'base64').length === 32 && new URL(process.env.APP_URL)); } catch { return false; }
}
function client() {
  if (!configured()) throw problem(503, 'La conexión con Gmail todavía no está configurada.');
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
}
function seal(text) {
 const iv = crypto.randomBytes(12);
 const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(process.env.GMAIL_TOKEN_KEY, 'base64'), iv);
 const data = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
 return [iv, cipher.getAuthTag(), data].map(value => value.toString('base64url')).join('.');
}
function unseal(text) {
 const [iv, tag, data] = text.split('.').map(value => Buffer.from(value, 'base64url'));
 const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(process.env.GMAIL_TOKEN_KEY, 'base64'), iv);
 decipher.setAuthTag(tag);
 return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}
async function googleRequest(oauth, path, params = {}) {
 try {
  const response = await oauth.request({ url: `https://gmail.googleapis.com/gmail/v1/users/me/${path}`, params, timeout: 12000 });
  return response.data;
 } catch (error) {
  const status = error.response?.status;
  if (status === 401 || error.response?.data?.error === 'invalid_grant') throw problem(409, 'Google requiere que vuelvas a conectar tu cuenta.');
  if (status === 403) throw problem(503, 'Google no autorizó la lectura. Revisa los permisos y que Gmail API esté habilitada.');
  if (status === 429) throw problem(503, 'Gmail recibió demasiadas solicitudes. Intenta más tarde.');
  throw problem(503, 'No se pudo consultar Gmail. Intenta de nuevo.');
 }
}
module.exports = { configured, client, seal, unseal, googleRequest };
