const router=require('express').Router();
const {pool}=require('../../infrastructure/database/pool');
const {route,problem,transaction}=require('../../shared/http');
const {requireAuth}=require('../../shared/middleware/auth');
const {validateEmail}=require('../../shared/validate');
const {context,canRead,adminEmails,recordAction}=require('./tracking');
function emptyBody(req) {
 if(!req.body||Array.isArray(req.body)||typeof req.body!=='object'||Object.keys(req.body).length) throw problem(400,'Esta acción no recibe campos.');
}
router.post('/visit',(req,res,next)=>req.headers.authorization?requireAuth(req,res,next):next(),route(async(req,res)=>{
 emptyBody(req);const ctx=context(req);
 if(ctx.disabled)return res.status(204).end();
 if(!ctx.session)throw problem(400,'Falta una sesión de visita válida.');
 if(req.userId) {
  const {rows:[actor]}=await pool.query("SELECT lower(u.email)=ANY($2::text[]) OR s.audience='test' OR x.user_id IS NOT NULL AS is_test FROM users u LEFT JOIN analytics_user_state s ON s.user_id=u.id LEFT JOIN analytics_exclusions x ON x.user_id=u.id WHERE u.id=$1",[req.userId,adminEmails()]);
  if(actor?.is_test)ctx.audience='test';
 }
 await pool.query(`INSERT INTO analytics_events(event,session_id,source,device,audience) VALUES('landing_visit',$1,$2,$3,$4) ON CONFLICT(session_id) WHERE event='landing_visit' DO UPDATE SET audience=CASE WHEN EXCLUDED.audience='test' THEN 'test' ELSE analytics_events.audience END`,[ctx.session,ctx.source,ctx.device,ctx.audience]);
 res.status(204).end();
}));
router.post('/activity',requireAuth,route(async(req,res)=>{
 emptyBody(req);await transaction(client=>recordAction(client,req.userId,'activity',context(req)));res.status(204).end();
}));
router.use(requireAuth);
router.use(async(req,res,next)=>{try{if(!await canRead(req.userId))throw problem(403,'Este panel requiere una cuenta autorizada del equipo con el correo verificado.');next();}catch(error){next(error);}});
function range(query) {
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const from=query.from===undefined?new Date(Date.parse(today+'T12:00:00Z')-29*86400000).toISOString().slice(0,10):query.from;
 const to=query.to===undefined?today:query.to;
 const valid=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
 if(!valid(from)||!valid(to)||from>to||Date.parse(to)-Date.parse(from)>89*86400000)throw problem(400,'Elige un rango válido de hasta 90 días.');
 const audience=query.audience===undefined?'public':query.audience;
 if(!['public','test'].includes(audience))throw problem(400,'Grupo no válido.');
 return{from,to,audience};
}
router.get('/funnel',route(async(req,res)=>{
 const {from,to,audience}=range(req.query);
 // Classify visitors retrospectively when an account is later marked as team/test.
 const params=[from,to,adminEmails()];
 const sql=`WITH tagged AS (
 SELECT e.*,CASE WHEN e.audience='test' OR s.audience='test' OR x.user_id IS NOT NULL OR lower(u.email)=ANY($3::text[]) OR EXISTS(
  SELECT 1 FROM analytics_events r LEFT JOIN analytics_user_state rs ON rs.user_id=r.user_id LEFT JOIN users ru ON ru.id=r.user_id LEFT JOIN analytics_exclusions rx ON rx.user_id=r.user_id
  WHERE r.session_id=e.session_id AND r.event='registration' AND (r.audience='test' OR rs.audience='test' OR rx.user_id IS NOT NULL OR lower(ru.email)=ANY($3::text[]))) THEN 'test' ELSE 'public' END AS segment
 FROM analytics_events e LEFT JOIN users u ON u.id=e.user_id LEFT JOIN analytics_user_state s ON s.user_id=e.user_id LEFT JOIN analytics_exclusions x ON x.user_id=e.user_id)
 SELECT event,occurred_at,day::text,user_id,session_id,source,device,segment FROM tagged WHERE day BETWEEN $1::date AND $2::date ORDER BY occurred_at,id`;
 // The query only returns the selected period. Account IDs never leave the server.
 const {rows}=await pool.query(sql,params);
 const selected=rows.filter(e=>e.segment===audience);
 const registrations=selected.filter(e=>e.event==='registration');
 const visits=selected.filter(e=>e.event==='landing_visit');
 const visitIds=new Set(visits.map(e=>e.session_id));
 const regUsers=new Set(registrations.map(e=>e.user_id));
 const activatedUsers=new Set(selected.filter(e=>e.event==='activation'&&regUsers.has(e.user_id)).map(e=>e.user_id));
 const registeredSessions=new Set(registrations.filter(e=>visitIds.has(e.session_id)).map(e=>e.session_id));
 const activatedSessions=new Set(registrations.filter(e=>visitIds.has(e.session_id)&&activatedUsers.has(e.user_id)).map(e=>e.session_id));
 const returnedUsers=new Set(selected.filter(e=>e.event==='return').map(e=>e.user_id));
 const registered=registeredSessions.size,activated=activatedSessions.size;
 const steps=[{id:'visit',label:'Sesiones de landing',total:visits.length},{id:'registration',label:'Sesiones con registro',total:registered},{id:'activation',label:'Sesiones con activación',total:activated}];
 const losses=[{stage:'visit_registration',label:'De la visita al registro',count:visits.length-registered,base:visits.length},{stage:'registration_activation',label:'Del registro a la activación',count:registered-activated,base:registered}].map(e=>({...e,rate:e.base?e.count/e.base:null}));
 const meaningful=losses.filter(e=>e.base>0);const largest=meaningful.length?meaningful.reduce((a,b)=>a.count>=b.count?a:b):null;
 const dailyMap=new Map();for(const e of selected){if(!dailyMap.has(e.day))dailyMap.set(e.day,{day:e.day,landing_visit:0,registration:0,activation:0,return:0});dailyMap.get(e.day)[e.event]++;}
 const config=await pool.query('SELECT started_at FROM analytics_config WHERE singleton=true');
 const cohortReturns=new Set(selected.filter(e=>e.event==='return'&&regUsers.has(e.user_id)).map(e=>e.user_id));
 res.json({from,to,audience,timezone:'America/Bogota',started_at:config.rows[0]?.started_at,generated_at:new Date().toISOString(),local:process.env.NODE_ENV==='test',steps,losses,largest_loss:largest,
  accounts:{registered:regUsers.size,activated:activatedUsers.size,returned:returnedUsers.size,cohort_returned:cohortReturns.size,without_landing:registrations.filter(e=>!visitIds.has(e.session_id)).length},
  excluded_events:rows.filter(e=>e.segment==='test').length,
  daily:[...dailyMap.values()],recent:selected.slice(-20).reverse().map(e=>({event:e.event,occurred_at:e.occurred_at,source:e.source,device:e.device})),
  definitions:{activation:'Crear un espacio y completar una tarea, en cualquier orden, después de registrarse durante la medición.',return:'Abrir la app con sesión iniciada en un día de Bogotá posterior al último acceso medido. Una vez por cuenta y día.',funnel:'Sesiones de landing con visita y registro dentro del rango. La activación también debe ocurrir dentro del rango. Varias cuentas en una sesión cuentan una conversión.'}});
}));
router.post('/exclusions',route(async(req,res)=>{
 const input=req.body;if(!input||Array.isArray(input)||Object.keys(input).some(k=>!['email','reason'].includes(k)))throw problem(400,'Campos no permitidos.');
 const email=validateEmail(input.email);if(!['team','test','remove'].includes(input.reason))throw problem(400,'Selecciona equipo, prueba o retirar exclusión.');
 const result=await pool.query('SELECT id FROM users WHERE email=$1',[email]);
 if(!result.rows.length)throw problem(404,'No encontramos una cuenta con ese correo.');
 if(input.reason==='remove')await pool.query('DELETE FROM analytics_exclusions WHERE user_id=$1',[result.rows[0].id]);
 else await pool.query('INSERT INTO analytics_exclusions(user_id,reason) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET reason=EXCLUDED.reason,updated_at=now()',[result.rows[0].id,input.reason]);
 res.json({updated:true});
}));
module.exports=router;

