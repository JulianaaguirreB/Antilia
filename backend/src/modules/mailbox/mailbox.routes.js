const express = require('express');
const crypto = require('crypto');
const { pool } = require('../../infrastructure/database/pool');
const { route, transaction, problem } = require('../../shared/http');
const { requireAuth } = require('../../shared/middleware/auth');
const { body, uuid } = require('../../shared/release2-validation');
const { classifyMessage, categories } = require('./classifier');
const google = require('./google');
const router = express.Router();
const hash = value => crypto.createHash('sha256').update(value).digest('hex');

router.get('/callback', route(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Referrer-Policy', 'no-referrer');
  if (!google.configured()) throw problem(503, 'La conexión con Gmail todavía no está configurada.');
  const done = status => res.redirect(303, new URL(`/#/correos?gmail=${status}`, process.env.APP_URL).toString());
  if (typeof req.query.state !== 'string' || !/^[a-f0-9]{64}$/.test(req.query.state)) return done('error');
  const found = await pool.query('DELETE FROM gmail_oauth_states WHERE state_hash=$1 AND expires_at>now() RETURNING *', [hash(req.query.state)]);
  if (!found.rows.length) return done('error');
  const state = found.rows[0];
  if (req.query.error || typeof req.query.code !== 'string') return done('cancelado');
  try {
    const oauth = google.client();
    const { tokens } = await oauth.getToken({ code: req.query.code, codeVerifier: state.verifier });
    if (!tokens.scope?.split(' ').includes('https://www.googleapis.com/auth/gmail.readonly')) return done('permisos');
    oauth.setCredentials(tokens);
    const profile = await google.googleRequest(oauth, 'profile');
    if (!tokens.refresh_token) return done('reconectar');
    await transaction(async db => {
      const user = await db.query('SELECT email,token_version FROM users WHERE id=$1 FOR UPDATE', [state.user_id]);
      if (!user.rows.length || user.rows[0].token_version !== state.token_version) throw problem(401, 'La sesión cambió.');
      if (user.rows[0].email.toLowerCase() !== profile.emailAddress?.toLowerCase()) throw problem(400, 'Usa el Gmail asociado a tu cuenta de Antilia.');
      await db.query('INSERT INTO gmail_connections(user_id,email,refresh_token) VALUES($1,$2,$3) ON CONFLICT(user_id) DO UPDATE SET email=EXCLUDED.email,refresh_token=EXCLUDED.refresh_token,next_page=NULL', [state.user_id, profile.emailAddress, google.seal(tokens.refresh_token)]);
    });
    return done('conectado');
  } catch { return done('error'); }
}));

router.use(requireAuth);
router.get('/status', route(async (req, res) => {
 const result = await pool.query('SELECT email,last_synced_at,next_page IS NOT NULL AS has_more FROM gmail_connections WHERE user_id=$1', [req.userId]);
 res.json({ configured: google.configured(), connected: Boolean(result.rows.length), connection: result.rows[0] || null });
}));
router.post('/connect', route(async (req, res) => {
 const oauth = google.client();
 const state = crypto.randomBytes(32).toString('hex');
 const verifier = crypto.randomBytes(32).toString('base64url');
 await transaction(async db => {
  const result = await db.query('SELECT token_version FROM users WHERE id=$1 FOR UPDATE', [req.userId]);
  await db.query('DELETE FROM gmail_oauth_states WHERE user_id=$1 OR expires_at<now()', [req.userId]);
  await db.query("INSERT INTO gmail_oauth_states(state_hash,user_id,token_version,verifier,expires_at) VALUES($1,$2,$3,$4,now()+interval '10 minutes')", [hash(state), req.userId, result.rows[0].token_version, verifier]);
 });
 const url = oauth.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: ['https://www.googleapis.com/auth/gmail.readonly'], state, code_challenge: crypto.createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256' });
 res.json({ url });
}));
router.get('/messages', route(async (req, res) => {
 const category = req.query.category;
 if (category && !categories.includes(category)) throw problem(400, 'Categoría inválida.');
 const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 120) : '';
 const offset = Number(req.query.offset || 0);
 if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000) throw problem(400, 'Página inválida.');
 const result = await pool.query(`SELECT id,gmail_id,subject,sender,snippet,received_at,category,reason,manual_category FROM gmail_messages WHERE user_id=$1 AND ($2::text IS NULL OR category=$2) AND ($3='' OR strpos(lower(subject || ' ' || sender),lower($3))>0) ORDER BY received_at DESC,id LIMIT 31 OFFSET $4`, [req.userId, category || null, search, offset]);
 const counts = await pool.query('SELECT category,count(*)::int AS total FROM gmail_messages WHERE user_id=$1 GROUP BY category', [req.userId]);
 res.json({ messages: result.rows.slice(0,30), has_more: result.rows.length>30, counts: counts.rows });
}));
router.get('/messages/:id/content', route(async (req, res) => {
 const result = await pool.query('SELECT m.gmail_id,c.refresh_token FROM gmail_messages m JOIN gmail_connections c USING(user_id) WHERE m.user_id=$1 AND m.id=$2', [req.userId,uuid(req.params.id,'Correo')]);
 if (!result.rows.length) throw problem(404, 'Correo no encontrado.');
 const oauth = google.client();
 oauth.setCredentials({ refresh_token:google.unseal(result.rows[0].refresh_token) });
 const message = await google.googleRequest(oauth, `messages/${encodeURIComponent(result.rows[0].gmail_id)}`, { format:'full' });
 if ((message.labelIds||[]).some(label=>['SPAM','TRASH','CATEGORY_PROMOTIONS','CATEGORY_SOCIAL'].includes(label))) throw problem(404,'Este mensaje ya no está disponible en la selección.');
 function plain(part) {
  if (!part || part.filename) return '';
  if (part.mimeType==='text/plain' && part.body?.data) return Buffer.from(part.body.data,'base64url').toString('utf8').slice(0,50000);
  const values=(part.parts||[]).map(plain).filter(Boolean);
  return [...new Set(values)].join('\n').slice(0,50000);
 }
 const text=plain(message.payload);
 res.json({ text:text || 'Este mensaje no tiene una versión de texto. Puedes abrirlo en Gmail.', truncated:text.length>=50000 });
}));
router.post('/sync', route(async (req, res) => {
 const input = body(req.body && !Array.isArray(req.body) && typeof req.body === 'object' && !Object.keys(req.body).length ? { older:false } : req.body, ['older']);
 if (input.older !== undefined && typeof input.older !== 'boolean') throw problem(400, 'La opción de historial no es válida.');
 const lock = await pool.connect();
 let acquired = false;
 try {
  const check = await lock.query('SELECT pg_try_advisory_lock(hashtextextended($1,42)) AS locked', [req.userId]);
  acquired = check.rows[0].locked;
  if (!acquired) throw problem(409, 'Ya hay una sincronización en curso.');
  const result = await pool.query('SELECT * FROM gmail_connections WHERE user_id=$1', [req.userId]);
  if (!result.rows.length) throw problem(409, 'Conecta tu Gmail primero.');
  const connection = result.rows[0];
  if (input.older && !connection.next_page) return res.json({ reviewed:0, imported:0, has_more:false });
  const oauth = google.client();
  oauth.setCredentials({ refresh_token: google.unseal(connection.refresh_token) });
  const list = await google.googleRequest(oauth, 'messages', { maxResults: 20, q: '-in:spam -in:trash -category:promotions -category:social', ...(input.older ? { pageToken: connection.next_page } : {}) });
  let imported = 0;
  const details = await Promise.all((list.messages || []).map(async item => ({ item, message: await google.googleRequest(oauth, `messages/${encodeURIComponent(item.id)}`, { format:'metadata', metadataHeaders:['Subject','From'] }) })));
  for (const {item,message} of details) {
   const headers = message.payload?.headers || [];
   const get = key => headers.find(header => header.name.toLowerCase() === key)?.value || '';
   const subject = get('subject').slice(0,1000), sender = get('from').slice(0,500);
   const classification = classifyMessage({ subject, sender, labels: message.labelIds });
   if (!classification) {
    await pool.query('DELETE FROM gmail_messages WHERE user_id=$1 AND gmail_id=$2', [req.userId,item.id]);
    continue;
   }
   const received = new Date(Number(message.internalDate));
   if (!Number.isFinite(received.getTime())) continue;
   const saved = await pool.query(`INSERT INTO gmail_messages(user_id,gmail_id,thread_id,subject,sender,snippet,received_at,category,reason) SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9 WHERE EXISTS(SELECT 1 FROM gmail_connections WHERE user_id=$1) ON CONFLICT(user_id,gmail_id) DO UPDATE SET subject=EXCLUDED.subject,sender=EXCLUDED.sender,snippet=EXCLUDED.snippet,category=CASE WHEN gmail_messages.manual_category THEN gmail_messages.category ELSE EXCLUDED.category END,reason=CASE WHEN gmail_messages.manual_category THEN gmail_messages.reason ELSE EXCLUDED.reason END RETURNING id`, [req.userId,item.id,message.threadId,subject,sender,String(message.snippet||'').slice(0,1000),received,classification.category,classification.reason]);
   imported += saved.rowCount;
  }
  await pool.query('UPDATE gmail_connections SET last_synced_at=now(),next_page=CASE WHEN $3 THEN $2 ELSE COALESCE(next_page,$2) END WHERE user_id=$1', [req.userId,list.nextPageToken||null,Boolean(input.older)]);
  res.json({ reviewed:(list.messages||[]).length, imported, has_more:Boolean(list.nextPageToken) });
 } finally {
  if (acquired) await lock.query('SELECT pg_advisory_unlock(hashtextextended($1,42))', [req.userId]);
  lock.release();
 }
}));
router.patch('/messages/:id', route(async (req, res) => {
 const input = body(req.body, ['category']);
 if (!categories.includes(input.category)) throw problem(400, 'Categoría inválida.');
 const result = await pool.query("UPDATE gmail_messages SET category=$3,reason='Clasificación elegida por ti.',manual_category=true WHERE user_id=$1 AND id=$2 RETURNING id", [req.userId,uuid(req.params.id,'Correo'),input.category]);
 if (!result.rowCount) throw problem(404, 'Correo no encontrado.');
 res.json({ updated:true });
}));
router.delete('/connection', route(async (req, res) => {
 await transaction(async db => {
  await db.query('DELETE FROM gmail_oauth_states WHERE user_id=$1',[req.userId]);
  await db.query('DELETE FROM gmail_connections WHERE user_id=$1',[req.userId]);
  await db.query('DELETE FROM gmail_messages WHERE user_id=$1',[req.userId]);
 });
 res.json({ disconnected:true, message:'Conexión y copias eliminadas de Antilia. Puedes retirar también el permiso desde tu cuenta de Google.' });
}));
module.exports = router;
