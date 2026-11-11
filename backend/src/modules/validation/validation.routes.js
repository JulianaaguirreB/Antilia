const router=require('express').Router();
const {pool}=require('../../infrastructure/database/pool');
const {route,problem,transaction}=require('../../shared/http');
const {requireAuth}=require('../../shared/middleware/auth');
const {body,uuid}=require('../../shared/release2-validation');
const {validateString}=require('../../shared/validate');
const {canRead}=require('../analytics/tracking');
const model=require('./comparison');
router.use(requireAuth);
router.use(async(req,res,next)=>{try{if(!await canRead(req.userId))throw problem(403,'Esta sección requiere una cuenta autorizada del equipo con correo verificado.');next();}catch(e){next(e);}});
const fields=['release','participant_code','session_on','evidence_ref','segment_confirmed','independent','unassisted','consent','results','sus'];
router.get('/protocols',route(async(req,res)=>{const result=await pool.query('SELECT id,title,prepared_on,evidence_ref,tasks,created_at FROM validation_protocols ORDER BY created_at DESC');res.json({protocols:result.rows,local:process.env.NODE_ENV==='test'});}));
router.post('/protocols',route(async(req,res)=>{
 const data=model.protocol(body(req.body,['title','prepared_on','evidence_ref','tasks']));
 const result=await pool.query('INSERT INTO validation_protocols(title,prepared_on,evidence_ref,tasks,created_by) VALUES($1,$2,$3,$4,$5) RETURNING id,title,prepared_on,evidence_ref,tasks,created_at',[data.title,data.prepared_on,data.evidence_ref,JSON.stringify(data.tasks),req.userId]);res.status(201).json({protocol:result.rows[0]});
}));
router.get('/protocols/:id',route(async(req,res)=>{
 const id=uuid(req.params.id,'Protocolo');const found=await pool.query('SELECT id,title,prepared_on,evidence_ref,tasks,created_at FROM validation_protocols WHERE id=$1',[id]);
 if(!found.rows.length)throw problem(404,'Protocolo no encontrado.');
 const protocol=found.rows[0];const sessions=await pool.query('SELECT id,release,participant_code,session_on,evidence_ref,segment_confirmed,independent,unassisted,consent,results,sus,sus_score,excluded_at,exclusion_reason,updated_at FROM validation_sessions WHERE protocol_id=$1 ORDER BY release,participant_code',[id]);
 res.json({protocol,sessions:sessions.rows.map(s=>({...s,eligible:model.eligible(s)})),comparison:model.compare(protocol,sessions.rows),local:process.env.NODE_ENV==='test',generated_at:new Date().toISOString()});
}));
router.post('/protocols/:id/sessions',route(async(req,res)=>{
 const id=uuid(req.params.id,'Protocolo');const input=body(req.body,fields);
 try{const session=await transaction(async client=>{
  const found=await client.query('SELECT * FROM validation_protocols WHERE id=$1 FOR UPDATE',[id]);if(!found.rows.length)throw problem(404,'Protocolo no encontrado.');
  const data=model.session(input,found.rows[0]);
  const result=await client.query('INSERT INTO validation_sessions(protocol_id,release,participant_code,session_on,evidence_ref,segment_confirmed,independent,unassisted,consent,results,sus,sus_score,created_by,updated_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$13) RETURNING id',[id,data.release,data.participant_code,data.session_on,data.evidence_ref,data.segment_confirmed,data.independent,data.unassisted,data.consent,JSON.stringify(data.results),JSON.stringify(data.sus),data.sus_score,req.userId]);return result.rows[0];
 });res.status(201).json({session});}catch(e){if(e.code==='23505')throw problem(409,'Este participante ya tiene una sesión en ese release. Usa Editar para corregirla.');throw e;}
}));
router.patch('/sessions/:id',route(async(req,res)=>{
 const id=uuid(req.params.id,'Sesión');const input=body(req.body,fields);
 await transaction(async client=>{
  const found=await client.query('SELECT s.*,p.tasks,p.prepared_on FROM validation_sessions s JOIN validation_protocols p ON p.id=s.protocol_id WHERE s.id=$1 FOR UPDATE OF s',[id]);if(!found.rows.length)throw problem(404,'Sesión no encontrada.');
  const previous=found.rows[0];if(input.release!==previous.release||input.participant_code!==previous.participant_code)throw problem(400,'La corrección conserva el release y código originales.');
  const data=model.session(input,previous);
  const {tasks,prepared_on,...snapshot}=previous;
  await client.query('INSERT INTO validation_session_revisions(session_id,previous_data,changed_by) VALUES($1,$2,$3)',[id,JSON.stringify(snapshot),req.userId]);
  await client.query('UPDATE validation_sessions SET session_on=$1,evidence_ref=$2,segment_confirmed=$3,independent=$4,unassisted=$5,consent=$6,results=$7,sus=$8,sus_score=$9,updated_by=$10,updated_at=now() WHERE id=$11',[data.session_on,data.evidence_ref,data.segment_confirmed,data.independent,data.unassisted,data.consent,JSON.stringify(data.results),JSON.stringify(data.sus),data.sus_score,req.userId,id]);
 });res.json({updated:true});
}));
router.post('/sessions/:id/exclusion',route(async(req,res)=>{
 const id=uuid(req.params.id,'Sesión');const input=body(req.body,['exclude','reason']);if(typeof input.exclude!=='boolean')throw problem(400,'Selecciona excluir o restaurar.');const reason=validateString(input.reason,'Motivo',3,300);
 await transaction(async client=>{const found=await client.query('SELECT * FROM validation_sessions WHERE id=$1 FOR UPDATE',[id]);if(!found.rows.length)throw problem(404,'Sesión no encontrada.');await client.query('INSERT INTO validation_session_revisions(session_id,previous_data,changed_by) VALUES($1,$2,$3)',[id,JSON.stringify(found.rows[0]),req.userId]);await client.query('UPDATE validation_sessions SET excluded_at=CASE WHEN $1 THEN now() ELSE NULL END,exclusion_reason=$2,updated_by=$3,updated_at=now() WHERE id=$4',[input.exclude,reason,req.userId,id]);});res.json({updated:true});
}));
module.exports=router;
