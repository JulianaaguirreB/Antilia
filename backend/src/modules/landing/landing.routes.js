const router = require('express').Router();
const { pool } = require('../../infrastructure/database/pool');
const { requireAuth } = require('../../shared/middleware/auth');
const { route, problem } = require('../../shared/http');
const { body } = require('../../shared/release2-validation');
const events = ['visit','try_app','download_options','download_android','iphone_web','download_ipa'];
async function canRead(userId) {
 const allowed = (process.env.LANDING_ANALYTICS_ADMINS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
 if (!allowed.length) return false;
 const result = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
 return allowed.includes(result.rows[0]?.email.toLowerCase());
}
router.post('/events', route(async (req,res) => {
 const input = body(req.body, ['event','device','source']);
 if (!events.includes(input.event) || !['desktop','android','iphone'].includes(input.device) || !['directo','whatsapp','instagram','qr','otro'].includes(input.source)) throw problem(400, 'Evento inválido.');
 // Only aggregate counters are retained: no visitor identifier, IP, email or browsing history.
 await pool.query(`INSERT INTO landing_metrics (event,device,source,total) VALUES ($1,$2,$3,1)
 ON CONFLICT (day,event,device,source) DO UPDATE SET total = landing_metrics.total + 1`, [input.event,input.device,input.source]);
 res.status(204).end();
}));
router.get('/access', requireAuth, route(async (req,res) => res.json({allowed:await canRead(req.userId)})));
router.get('/metrics', requireAuth, route(async (req,res) => {
 if (!await canRead(req.userId)) throw problem(403,'Estas métricas están reservadas al equipo.');
 const result=await pool.query(`SELECT day::text,event,device,source,total FROM landing_metrics
 WHERE day >= (now() AT TIME ZONE 'America/Bogota')::date - 29 ORDER BY day DESC,event,device,source`);
 res.json({timezone:'America/Bogota',days:30,rows:result.rows});
}));
module.exports=router;
