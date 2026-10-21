const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { Pool } = require('pg');

const adminUrl = new URL(process.env.TEST_DATABASE_URL || 'postgresql://logtech:logtech@127.0.0.1:5432/logtech');
if (!['localhost', '127.0.0.1', '[::1]'].includes(adminUrl.hostname)) throw new Error('Las pruebas de Release 2 solo usan PostgreSQL local.');
const databaseName = `antilia_r2_test_${process.pid}_${crypto.randomBytes(4).toString('hex')}`;
const admin = new Pool({ connectionString: adminUrl.toString(), connectionTimeoutMillis: 5000 });
const realFetch = global.fetch;
const emails = [];
let created = false;
let server;
let pool;
let base;
let users;

async function request(path, { method = 'GET', token, body } = {}) {
  const result = await realFetch(base + path, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: result.status, data: await result.json() };
}

async function register(name) {
  const result = await request('/auth/register', { method: 'POST', body: { name, email: `${name}-${crypto.randomBytes(5).toString('hex')}@example.com`, password: 'PruebaR22026' } });
  assert.equal(result.status, 201);
  return { ...result.data, password: 'PruebaR22026' };
}

async function verify(user) {
  const sent = await request('/email-verification/request', { method: 'POST', token: user.token });
  assert.equal(sent.status, 202);
  assert.equal(sent.data.token, undefined);
  const token = emails.at(-1).text.match(/[a-f0-9]{64}/)[0];
  const result = await request('/email-verification/confirm', { method: 'POST', token: user.token, body: { token } });
  assert.equal(result.status, 200);
  return token;
}

before(async () => {
  await admin.query(`CREATE DATABASE "${databaseName}"`);
  created = true;
  const testUrl = new URL(adminUrl);
  testUrl.pathname = `/${databaseName}`;
  process.env.DATABASE_URL = testUrl.toString();
  process.env.DATABASE_SSL = 'false';
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.RESEND_API_KEY = 'test-only-key';
  process.env.REMINDER_FROM = 'Antilia <test@example.com>';
  process.env.CRON_SECRET = crypto.randomBytes(32).toString('hex');
  for (let i = 0; i < 2; i++) {
    const result = spawnSync(process.execPath, ['src/migrate.js'], { env: process.env, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  }
  global.fetch = async (url, options) => {
    if (url !== 'https://api.resend.com/emails') throw new Error('Proveedor inesperado en la prueba.');
    emails.push(JSON.parse(options.body));
    return new Response(JSON.stringify({ id: crypto.randomUUID() }), { status: 200 });
  };
  pool = require('../src/infrastructure/database/pool').pool;
  const app = require('../src/app');
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
  users = [await register('usuarioa'), await register('usuariob')];
});

after(async () => {
  global.fetch = realFetch;
  if (server) await new Promise(resolve => { server.closeAllConnections(); server.close(resolve); });
  if (pool) await pool.end();
  if (created) await admin.query(`DROP DATABASE "${databaseName}" WITH (FORCE)`);
  await admin.end();
});

test('migraciones repetibles y esquema con datos aislados', async () => {
  const result = await pool.query('SELECT name FROM schema_migrations ORDER BY name');
  assert.deepEqual(result.rows.map(row => row.name), ['001_init.sql', '002_release2.sql', '003_measurements.sql', '004_desks.sql']);
  assert.equal((await request('/spaces')).status, 401);
  assert.equal((await request('/shifts')).status, 401);
  assert.equal((await request('/reminders')).status, 401);
  assert.equal((await request('/stats')).status, 401);
});

test('perfil editable, contraseña requerida para correo y conflictos', async () => {
  const [a, b] = users;
  const updated = await request('/auth/me', { method: 'PATCH', token: a.token, body: { name: 'Nombre actualizado' } });
  assert.equal(updated.status, 200);
  assert.equal(updated.data.user.name, 'Nombre actualizado');
  assert.equal(updated.data.user.password_hash, undefined);
  assert.equal((await request('/auth/me', { method: 'PATCH', token: a.token, body: { email: b.user.email } })).status, 401);
  assert.equal((await request('/auth/me', { method: 'PATCH', token: a.token, body: { email: b.user.email, current_password: a.password } })).status, 409);
  assert.equal((await request('/auth/me', { method: 'PATCH', token: a.token, body: { user_id: b.user.id } })).status, 400);
});

test('espacios, edición y acceso por propietario', async () => {
  const [a, b] = users;
  const created = await request('/spaces', { method: 'POST', token: a.token, body: { name: 'Escritorio', type: 'fisica' } });
  assert.equal(created.status, 201);
  const id = created.data.space.id;
  assert.equal((await request(`/spaces/${id}`, { token: b.token })).status, 404);
  assert.equal((await request(`/spaces/${id}`, { method: 'PATCH', token: b.token, body: { name: 'Ajeno' } })).status, 404);
  const edited = await request(`/spaces/${id}`, { method: 'PATCH', token: a.token, body: { name: 'Archivo', description: 'Documentos' } });
  assert.equal(edited.data.space.name, 'Archivo');
  assert.equal((await request('/spaces', { token: b.token })).data.spaces.length, 0);
  a.spaceId = id;
});

test('tareas con espacio, fechas y edición, sin romper aislamiento', async () => {
  const [a, b] = users;
  assert.equal((await request('/tasks', { method: 'POST', token: b.token, body: { title: 'Inválida', type: 'fisica', space_id: a.spaceId } })).status, 404);
  assert.equal((await request('/tasks', { method: 'POST', token: a.token, body: { title: 'Inválida', type: 'digital', space_id: a.spaceId } })).status, 400);
  assert.equal((await request('/tasks', { method: 'POST', token: a.token, body: { title: 'Inválida', type: 'fisica', due_at: '2026-02-30T10:00:00Z' } })).status, 400);
  const created = await request('/tasks', { method: 'POST', token: a.token, body: { title: 'Archivar carpetas', type: 'fisica', space_id: a.spaceId, due_at: '2026-11-01T09:00:00-05:00' } });
  assert.equal(created.status, 201);
  a.taskId = created.data.task.id;
  assert.equal((await request(`/tasks/${a.taskId}`, { method: 'PATCH', token: b.token, body: { title: 'Ajena' } })).status, 404);
  const edited = await request(`/tasks/${a.taskId}`, { method: 'PATCH', token: a.token, body: { title: 'Ordenar carpetas' } });
  assert.equal(edited.data.task.title, 'Ordenar carpetas');
  assert.equal(edited.data.task.space_id, a.spaceId);
  const list = await request(`/tasks?search=Ordenar&space_id=${a.spaceId}`, { token: a.token });
  assert.equal(list.data.tasks.length, 1);
  assert.equal((await request('/tasks?status=invalido', { token: a.token })).status, 400);
  assert.equal((await request(`/spaces/${a.spaceId}/archive`, { method: 'POST', token: a.token })).status, 409);
});

test('archivar conserva datos y no cambia la racha', async () => {
  const [a] = users;
  const archived = await request(`/tasks/${a.taskId}/archive`, { method: 'POST', token: a.token });
  assert.equal(archived.data.task.status, 'archivada');
  assert.equal((await request('/tasks?status=all', { token: a.token })).data.tasks.length, 0);
  assert.equal((await request('/tasks?status=archivada', { token: a.token })).data.tasks.length, 1);
  assert.equal((await request(`/tasks/${a.taskId}/complete`, { method: 'PATCH', token: a.token })).status, 404);
  assert.equal((await request('/streak', { token: a.token })).data.streak.current_streak, 0);
  assert.equal((await request(`/spaces/${a.spaceId}/archive`, { method: 'POST', token: a.token })).status, 200);
  assert.equal((await request('/tasks', { method: 'POST', token: a.token, body: { title: 'Inválida', type: 'fisica', space_id: a.spaceId } })).status, 404);
});

test('turnos validan fechas y evitan solapamientos concurrentes', async () => {
  const [a, b] = users;
  const input = { title: 'Turno mañana', starts_at: '2026-11-01T08:00:00-05:00', ends_at: '2026-11-01T12:00:00-05:00' };
  assert.equal((await request('/shifts', { method: 'POST', token: a.token, body: { ...input, ends_at: input.starts_at } })).status, 400);
  const results = await Promise.all([request('/shifts', { method: 'POST', token: a.token, body: input }), request('/shifts', { method: 'POST', token: a.token, body: input })]);
  assert.deepEqual(results.map(r => r.status).sort(), [201, 409]);
  const id = results.find(r => r.status === 201).data.shift.id;
  assert.equal((await request(`/shifts/${id}`, { method: 'PATCH', token: b.token, body: { title: 'Otro' } })).status, 404);
  assert.equal((await request('/shifts?from=2026-11-01T07:00:00-05:00&to=2026-11-01T09:00:00-05:00', { token: a.token })).data.shifts.length, 1);
  assert.equal((await request(`/shifts/${id}/archive`, { method: 'POST', token: a.token })).status, 200);
  assert.equal((await request('/shifts', { token: a.token })).data.shifts.length, 0);
});

test('estadísticas incluyen días vacíos, propietario y completado real', async () => {
  const a = users[0];
  const task = await request('/tasks', { method: 'POST', token: a.token, body: { title: 'Completar hoy', type: 'digital' } });
  assert.equal((await request(`/tasks/${task.data.task.id}/complete`, { method: 'PATCH', token: a.token })).status, 200);
  const stats = await request('/stats?days=7', { token: a.token });
  assert.equal(stats.status, 200);
  assert.equal(stats.data.daily.length, 7);
  assert.equal(stats.data.totals.completed, 1);
  assert.equal(stats.data.daily.at(-1).completed, 1);
  assert.equal((await request('/stats?days=91', { token: a.token })).status, 400);
  assert.equal((await request('/stats', { token: users[1].token })).data.totals.completed, 0);
});

test('verificación de correo usa código privado, expiración y un solo uso', async () => {
  const a = users[0];
  const date = new Date(Date.now() + 3600000).toISOString();
  assert.equal((await request('/reminders', { method: 'POST', token: a.token, body: { title: 'No verificado', schedule_type: 'once', scheduled_at: date } })).status, 409);
  const token = await verify(a);
  assert.equal((await request('/email-verification/confirm', { method: 'POST', token: a.token, body: { token } })).status, 400);
  const requested = await request('/email-verification/request', { method: 'POST', token: users[1].token });
  assert.equal(requested.status, 202);
  const bToken = emails.at(-1).text.match(/[a-f0-9]{64}/)[0];
  assert.equal((await request('/email-verification/request', { method: 'POST', token: users[1].token })).status, 429);
  await pool.query("UPDATE email_verifications SET expires_at = now() - interval '1 minute' WHERE user_id = $1", [users[1].user.id]);
  assert.equal((await request('/email-verification/confirm', { method: 'POST', token: users[1].token, body: { token: bToken } })).status, 400);
});

test('recordatorios configuran hora, propietario y desactivación', async () => {
  const [a, b] = users;
  const result = await request('/reminders', { method: 'POST', token: a.token, body: { title: 'Ordenar', schedule_type: 'daily', local_time: '09:30' } });
  assert.equal(result.status, 201);
  a.reminderId = result.data.reminder.id;
  assert.equal(result.data.reminder.local_time, '09:30:00');
  assert.equal((await request(`/reminders/${a.reminderId}`, { method: 'PATCH', token: b.token, body: { enabled: false } })).status, 404);
  assert.equal((await request(`/reminders/${a.reminderId}`, { method: 'PATCH', token: a.token, body: { enabled: false } })).data.reminder.enabled, false);
  assert.equal((await request('/reminders', { method: 'POST', token: a.token, body: { title: 'Inválido', schedule_type: 'daily', local_time: '25:00' } })).status, 400);
  assert.equal((await request('/reminders', { method: 'POST', token: a.token, body: { title: 'Inválido', schedule_type: 'once', scheduled_at: '2020-01-01T00:00:00Z' } })).status, 400);
  assert.equal((await request(`/reminders/${a.reminderId}/deliveries`, { token: b.token })).status, 404);
});

test('hora diaria cruza medianoche de Bogotá sin usar la fecha UTC', () => {
  const { nextDaily } = require('../src/modules/reminders/reminder-schedule');
  assert.equal(nextDaily('23:00', new Date('2026-10-17T03:00:00Z')), '2026-10-17T04:00:00.000Z');
  assert.equal(nextDaily('09:00', new Date('2026-10-17T14:00:00Z')), '2026-10-18T14:00:00.000Z');
});

test('dos workers concurrentes no duplican correos y los reintentos conservan identidad', async () => {
  const { dispatchReminders } = require('../src/modules/reminders/reminder-dispatcher');
  const a = users[0];
  await pool.query('UPDATE reminders SET enabled = false');
  const inserted = await pool.query("INSERT INTO reminders(user_id,title,schedule_type,next_run_at) VALUES($1, 'Prueba worker', 'once', date_trunc('milliseconds', now() - interval '10 seconds')) RETURNING id", [a.user.id]);
  let calls = 0;
  const send = async () => { calls++; await new Promise(resolve => setTimeout(resolve, 20)); return 'sent-test'; };
  await Promise.all([dispatchReminders({ send }), dispatchReminders({ send })]);
  assert.equal(calls, 1);
  const delivery = await pool.query('SELECT status FROM reminder_deliveries WHERE reminder_id = $1', [inserted.rows[0].id]);
  assert.equal(delivery.rows[0].status, 'sent');
  const retry = await pool.query("INSERT INTO reminders(user_id,title,schedule_type,next_run_at) VALUES($1, 'Retry', 'once', date_trunc('milliseconds', now() - interval '10 seconds')) RETURNING id", [a.user.id]);
  const keys = [];
  const failed = await dispatchReminders({ send: async input => { keys.push(input.idempotencyKey); throw Object.assign(new Error('provider'), { code: 'EMAIL_HTTP_503' }); } });
  assert.equal(failed.failed, 1);
  await pool.query('UPDATE reminder_deliveries SET next_attempt_at = now() WHERE reminder_id = $1', [retry.rows[0].id]);
  const retried = await dispatchReminders({ send: async input => { keys.push(input.idempotencyKey); return 'retry-sent'; } });
  assert.equal(retried.sent, 1);
  assert.equal(keys[0], keys[1]);
});

test('vencidos y desactivados no se envían; cambio de correo pausa recordatorios', async () => {
  const { dispatchReminders } = require('../src/modules/reminders/reminder-dispatcher');
  const a = users[0];
  await pool.query("INSERT INTO reminders(user_id,title,schedule_type,next_run_at) VALUES($1, 'Vencido', 'once', now() - interval '10 minutes')", [a.user.id]);
  const result = await dispatchReminders({ send: async () => { throw new Error('No se debe enviar'); } });
  assert.equal(result.missed, 1);
  const changed = await request('/auth/me', { method: 'PATCH', token: a.token, body: { email: 'changed@example.com', current_password: a.password } });
  assert.equal(changed.status, 200);
  assert.equal(changed.data.user.email_verified_at, null);
  const active = await pool.query('SELECT 1 FROM reminders WHERE user_id = $1 AND enabled', [a.user.id]);
  assert.equal(active.rows.length, 0);
  const before = emails.length;
  await dispatchReminders({ send: async () => { throw new Error('No se debe enviar'); } });
  assert.equal(emails.length, before);
});

test('job interno requiere secreto separado de las sesiones', async () => {
  assert.equal((await request('/internal/reminders/dispatch', { method: 'POST' })).status, 401);
  assert.equal((await request('/internal/reminders/dispatch', { method: 'POST', token: users[0].token })).status, 401);
  assert.equal((await request('/internal/reminders/dispatch', { method: 'POST', token: process.env.CRON_SECRET })).status, 200);
});

test('tablero digital mueve tareas y rechaza enlaces inseguros', async () => {
  const b = users[1];
  const task = await request('/tasks', { method: 'POST', token: b.token, body: { title: 'Revisar correo', type: 'digital', digital_kind: 'correo', reference_url: 'https://mail.google.com/' } });
  assert.equal(task.status, 201);
  const moved = await request(`/tasks/${task.data.task.id}`, { method: 'PATCH', token: b.token, body: { status: 'en_progreso' } });
  assert.equal(moved.data.task.status, 'en_progreso');
  assert.equal((await request(`/tasks/${task.data.task.id}/complete`, { method: 'PATCH', token: b.token })).status, 200);
  assert.equal((await request('/tasks', { method: 'POST', token: b.token, body: { title: 'Inseguro', type: 'digital', reference_url: 'javascript:alert(1)' } })).status, 400);
  assert.equal((await request('/tasks', { method: 'POST', token: b.token, body: { title: 'Tipo incorrecto', type: 'fisica', digital_kind: 'correo' } })).status, 400);
});

test('recuperar acceso no revela cuentas y revoca sesiones previas', async () => {
  const user = await register('recuperar');
  const unknown = await request('/password-reset/request', { method: 'POST', body: { email: 'no-existe@example.com' } });
  const known = await request('/password-reset/request', { method: 'POST', body: { email: user.user.email } });
  assert.equal(known.status, 202);
  assert.deepEqual(unknown, known);
  const token = emails.at(-1).text.match(/[a-f0-9]{64}/)[0];
  assert.equal((await request('/password-reset/confirm', { method: 'POST', body: { email: user.user.email, token, password: 'NuevaClave2026' } })).status, 200);
  assert.equal((await request('/auth/me', { token: user.token })).status, 401);
  assert.equal((await request('/auth/login', { method: 'POST', body: { email: user.user.email, password: user.password } })).status, 401);
  const login = await request('/auth/login', { method: 'POST', body: { email: user.user.email, password: 'NuevaClave2026' } });
  assert.equal(login.status, 200);
  assert.equal((await request('/auth/me', { token: login.data.token })).status, 200);
  assert.equal((await request('/password-reset/confirm', { method: 'POST', body: { email: user.user.email, token, password: 'OtraClave2026' } })).status, 400);
});

test('mediciones manuales se guardan sin exponer datos ajenos', async () => {
  const a=await register('mediciona');
  const b=await register('medicionb');
  assert.equal((await request('/measurements')).status,401);
  assert.equal((await request('/measurements',{method:'POST',token:a.token,body:{search_minutes:-1,misplaced_items:2}})).status,400);
  assert.equal((await request('/measurements',{method:'POST',token:a.token,body:{search_minutes:5,misplaced_items:2,clear_width_cm:0}})).status,400);
  const saved=await request('/measurements',{method:'POST',token:a.token,body:{search_minutes:12,misplaced_items:3,clear_width_cm:54,notes:'Línea base'}});
  assert.equal(saved.status,201);
  const own=await request('/measurements',{token:a.token});
  assert.equal(own.data.measurements.length,1);
  assert.equal(own.data.measurements[0].search_minutes,12);
  assert.equal((await request('/measurements',{token:b.token})).data.measurements.length,0);
});

test('escritorio conserva distribución y dimensiones por usuario', async()=>{
 const a=await register('desk-a');const b=await register('desk-b');
 assert.equal((await request('/desk')).status,401);
 const body={name:'Escritorio de trabajo',width_cm:120,depth_cm:60,layout:[{id:'monitor',kind:'monitor',x:50,y:20}]};
 assert.equal((await request('/desk',{method:'PUT',token:a.token,body})).status,200);
 assert.deepEqual((await request('/desk',{token:a.token})).data.desk.layout,body.layout);
 assert.equal((await request('/desk',{token:b.token})).data.desk,null);
 assert.equal((await request('/desk',{method:'PUT',token:a.token,body:{...body,width_cm:0}})).status,400);
 assert.equal((await request('/desk',{method:'PUT',token:a.token,body:{...body,layout:[{id:'monitor',kind:'monitor',x:120,y:20}]}})).status,400);
 assert.equal((await request('/desk',{method:'PUT',token:a.token,body:{...body,layout:[...body.layout,...body.layout]}})).status,400);
 assert.equal((await request('/desk',{method:'PUT',token:a.token,body:{...body,name:'Nuevo nombre',layout:[]}})).status,200);
 assert.equal((await request('/desk',{token:a.token})).data.desk.name,'Nuevo nombre');
});

test('proveedor sin configurar no simula envíos', async () => {
  const previous = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  try {
    const caps = await request('/capabilities');
    assert.equal(caps.data.email_configured, false);
    assert.equal((await request('/password-reset/request', { method: 'POST', body: { email: 'algo@example.com' } })).status, 503);
    assert.equal((await request('/email-verification/request', { method: 'POST', token: users[1].token })).status, 503);
    const { sendEmail } = require('../src/infrastructure/mail/email');
    await assert.rejects(sendEmail({ to: 'nobody@example.com', subject: 'Test', text: 'Test', idempotencyKey: 'test' }), /no está configurado/);
  } finally {
    process.env.RESEND_API_KEY = previous;
  }
});
