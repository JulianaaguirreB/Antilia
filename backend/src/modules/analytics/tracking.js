const { pool } = require('../../infrastructure/database/pool');
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function context(req) {
  const headers = req.headers || {};
  return {
    disabled: headers['x-antilia-analytics'] === 'off' || headers.dnt === '1' || headers['sec-gpc'] === '1',
    session: uuid.test(headers['x-antilia-session'] || '') ? headers['x-antilia-session'] : null,
    source: ['whatsapp','instagram','qr','otro'].includes(headers['x-antilia-source']) ? headers['x-antilia-source'] : 'directo',
    device: ['android','iphone','desktop'].includes(headers['x-antilia-device']) ? headers['x-antilia-device'] : /Android/i.test(headers['user-agent']||'') ? 'android' : /iPhone|iPad|iPod/i.test(headers['user-agent']||'') ? 'iphone' : 'desktop',
    audience: headers['x-antilia-audience'] === 'test' ? 'test' : 'public',
  };
}
function adminEmails() {
  return (process.env.LANDING_ANALYTICS_ADMINS || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
}
async function canRead(userId) {
  const {rows} = await pool.query('SELECT email,email_verified_at FROM users WHERE id=$1',[userId]);
  return Boolean(rows[0]?.email_verified_at) && adminEmails().includes(rows[0]?.email.toLowerCase());
}
async function event(client, type, userId, ctx) {
  await client.query(`INSERT INTO analytics_events(event,user_id,session_id,source,device,audience)
    VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,[type,userId,ctx.session,ctx.source,ctx.device,ctx.audience]);
}
// Called in the same transaction as the action, so failed writes never become conversions.
async function recordAction(client, userId, action, ctx) {
  if (ctx.disabled) return;
  if(action==='registration' && ctx.session) {
    const {rows:[visit]}=await client.query("SELECT source,device,audience FROM analytics_events WHERE event='landing_visit' AND session_id=$1",[ctx.session]);
    if(visit)ctx={...ctx,source:visit.source,device:visit.device,audience:ctx.audience==='test'||visit.audience==='test'?'test':'public'};
  }
  const {rows:[state]} = await client.query(`INSERT INTO analytics_user_state(user_id,audience) VALUES($1,$2)
    ON CONFLICT(user_id) DO UPDATE SET audience=CASE WHEN EXCLUDED.audience='test' THEN 'test' ELSE analytics_user_state.audience END
    RETURNING *, (now() AT TIME ZONE 'America/Bogota')::date::text AS today`,[userId,ctx.audience]);
  ctx = {...ctx,audience:state.audience};
  if (action==='registration') {
    await client.query('UPDATE analytics_user_state SET registered_at=COALESCE(registered_at,now()) WHERE user_id=$1',[userId]);
    await event(client,'registration',userId,ctx);
    return;
  }
  if (action==='activity') {
    // last_seen_day is server time, not a date supplied by the browser.
    if (String(state.last_seen_day).slice(0,10) < state.today) await event(client,'return',userId,ctx);
    await client.query("UPDATE analytics_user_state SET last_seen_day=GREATEST(last_seen_day,(now() AT TIME ZONE 'America/Bogota')::date) WHERE user_id=$1",[userId]);
    return;
  }
  if (action==='space') await client.query('UPDATE analytics_user_state SET first_space_at=COALESCE(first_space_at,now()) WHERE user_id=$1',[userId]);
  if (action==='complete') await client.query('UPDATE analytics_user_state SET first_completed_at=COALESCE(first_completed_at,now()) WHERE user_id=$1',[userId]);
  const ready = await client.query('SELECT 1 FROM analytics_user_state WHERE user_id=$1 AND registered_at IS NOT NULL AND first_space_at IS NOT NULL AND first_completed_at IS NOT NULL',[userId]);
  if (ready.rows.length) {
    const {rows:[registration]}=await client.query("SELECT session_id,source,device FROM analytics_events WHERE user_id=$1 AND event='registration'",[userId]);
    if (registration) await event(client,'activation',userId,{...ctx,session:registration.session_id,source:registration.source,device:registration.device});
  }
}
module.exports={context,canRead,adminEmails,recordAction};
