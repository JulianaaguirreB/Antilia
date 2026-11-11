const { problem } = require('./http');
const { validateString } = require('./validate');

function body(value, allowed) {
  if (!value || Array.isArray(value) || typeof value !== 'object') throw problem(400, 'Envía un objeto JSON.');
  const unknown = Object.keys(value).filter(key => !allowed.includes(key));
  if (unknown.length) throw problem(400, `Campos no permitidos: ${unknown.join(', ')}.`);
  if (!Object.keys(value).length) throw problem(400, 'Incluye al menos un campo.');
  return value;
}

function uuid(value, label = 'Recurso') {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw problem(404, `${label} no encontrado.`);
  return value;
}

function instant(value, label) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) {
    throw problem(400, `${label} debe ser una fecha ISO con zona horaria.`);
  }
  const date = value.slice(0, 10);
  const time = value.slice(11, 19).match(/^(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (Number(time[1]) > 23 || Number(time[2]) > 59 || Number(time[3] || 0) > 59) throw problem(400, `${label} contiene una hora inexistente.`);
  const calendar = new Date(`${date}T12:00:00Z`);
  if (calendar.toISOString().slice(0, 10) !== date) throw problem(400, `${label} contiene una fecha inexistente.`);
  return new Date(value).toISOString();
}

function boolean(value, label) {
  if (typeof value !== 'boolean') throw problem(400, `${label} debe ser true o false.`);
  return value;
}

function queryBoolean(value, label, fallback = false) {
  if (value === undefined) return fallback;
  if (value !== 'true' && value !== 'false') throw problem(400, `${label} debe ser true o false.`);
  return value === 'true';
}

function queryText(value, label, max = 120) {
  if (value === undefined) return null;
  return validateString(value, label, 1, max);
}

function digitalKind(value) {
  if (!['general', 'correo', 'archivo'].includes(value)) throw problem(400, 'digital_kind debe ser general, correo o archivo.');
  return value;
}

function referenceUrl(value) {
  if (value === null || value === '') return null;
  if (typeof value !== 'string' || value.length > 2000) throw problem(400, 'La referencia debe ser un enlace HTTPS de máximo 2000 caracteres.');
  let url;
  try { url = new URL(value); } catch { throw problem(400, 'La referencia debe ser un enlace HTTPS válido.'); }
  if (url.protocol !== 'https:' || url.username || url.password) throw problem(400, 'Solo se permiten enlaces HTTPS sin credenciales.');
  return url.toString();
}

module.exports = { body, uuid, instant, boolean, queryBoolean, queryText, digitalKind, referenceUrl };
