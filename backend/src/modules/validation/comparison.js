const {problem}=require('../../shared/http');
const {validateString}=require('../../shared/validate');
function date(value,label) {
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value+'T12:00:00Z'))||new Date(value+'T12:00:00Z').toISOString().slice(0,10)!==value)throw problem(400,label+' no es una fecha válida.');
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 if(value>today)throw problem(400,label+' no puede estar en el futuro.');return value;
}
function evidence(value) {
 if(typeof value!=='string'||!/^E[A-Za-z0-9_-]{1,79}$/.test(value))throw problem(400,'Usa una referencia de evidencia como E-R2-P01, sin nombres, enlaces privados ni correos.');return value;
}
function score(answers) {
 if(!Array.isArray(answers)||answers.length!==10||answers.some(n=>!Number.isInteger(n)||n<1||n>5))throw problem(400,'SUS requiere las diez respuestas originales, cada una entre 1 y 5.');
 return answers.reduce((sum,n,i)=>sum+(i%2===0?n-1:5-n),0)*2.5;
}
function protocol(input) {
 if(!Array.isArray(input.tasks)||input.tasks.length<3||input.tasks.length>5)throw problem(400,'El protocolo debe tener de tres a cinco tareas.');
 const tasks=input.tasks.map((task,i)=>{
  if(!task||typeof task!=='object'||Object.keys(task).some(k=>!['label','criterion'].includes(k)))throw problem(400,'Cada tarea necesita su descripción y criterio de éxito.');
  return{id:'T'+(i+1),label:validateString(task.label,'Tarea',1,250),criterion:validateString(task.criterion,'Criterio de éxito',1,500)};
 });
 if(new Set(tasks.map(t=>t.label.toLowerCase())).size!==tasks.length)throw problem(400,'Las tareas no pueden estar repetidas.');
 return{title:validateString(input.title,'Nombre del protocolo',1,120),prepared_on:date(input.prepared_on,'La fecha del protocolo'),evidence_ref:evidence(input.evidence_ref),tasks};
}
function session(input,protocol) {
 if(!['R1','R2'].includes(input.release))throw problem(400,'Selecciona R1 o R2.');
 if(typeof input.participant_code!=='string'||!/^P[0-9]{2,4}$/.test(input.participant_code))throw problem(400,'Identifica al participante con un código como P01, sin nombres ni correos.');
 const sessionOn=date(input.session_on,'La fecha de la sesión');
 if(sessionOn<protocol.prepared_on)throw problem(400,'La sesión no puede ser anterior al protocolo. Usa el protocolo original y su fecha real.');
 for(const key of ['segment_confirmed','independent','unassisted','consent'])if(typeof input[key]!=='boolean')throw problem(400,'Completa las condiciones de participación.');
 if(!input.consent)throw problem(400,'Necesitas el permiso del participante antes de guardar sus resultados.');
 if(!Array.isArray(input.results)||input.results.length!==protocol.tasks.length)throw problem(400,'Registra el resultado de cada tarea del protocolo.');
 const seen=new Set();
 const results=input.results.map(result=>{
  if(!result||Object.keys(result).some(k=>!['task_id','success','seconds'].includes(k))||!protocol.tasks.some(t=>t.id===result.task_id)||seen.has(result.task_id))throw problem(400,'Los resultados deben corresponder a las mismas tareas, sin duplicados.');
  seen.add(result.task_id);
  if(typeof result.success!=='boolean'||typeof result.seconds!=='number'||!Number.isFinite(result.seconds)||result.seconds<=0||result.seconds>7200)throw problem(400,'Cada tarea necesita éxito o fallo y un tiempo medido entre 0 y 7200 segundos, mayor que cero.');
  return{task_id:result.task_id,success:result.success,seconds:Math.round(result.seconds*100)/100};
 });
 return{release:input.release,participant_code:input.participant_code,session_on:sessionOn,evidence_ref:evidence(input.evidence_ref),segment_confirmed:input.segment_confirmed,independent:input.independent,unassisted:input.unassisted,consent:input.consent,results,sus:input.sus,sus_score:score(input.sus)};
}
function eligible(s){return !s.excluded_at&&s.segment_confirmed&&s.independent&&s.unassisted&&s.consent;}
const mean=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
function compare(protocol,sessions) {
 const groups={R1:sessions.filter(s=>s.release==='R1'&&eligible(s)),R2:sessions.filter(s=>s.release==='R2'&&eligible(s))};
 const stats=release=>{const sample=groups[release];return{participants:sample.length,excluded:sessions.filter(s=>s.release===release&&!eligible(s)).length,sus_mean:mean(sample.map(s=>Number(s.sus_score))),tasks:protocol.tasks.map(task=>{const results=sample.map(s=>s.results.find(r=>r.task_id===task.id));const successes=results.filter(r=>r.success);return{...task,attempts:results.length,successes:successes.length,success_rate:results.length?successes.length/results.length:null,mean_seconds:mean(results.map(r=>r.seconds)),success_mean_seconds:mean(successes.map(r=>r.seconds))};})};};
 const R1=stats('R1'),R2=stats('R2');
 const returning=groups.R2.filter(s=>groups.R1.some(previous=>previous.participant_code===s.participant_code)).map(s=>s.participant_code);
 return{R1,R2,returning_participants:returning.length,returning_codes:returning,ready:R1.participants>=5&&R2.participants>=5&&returning.length>=2,sus_delta:R1.sus_mean===null||R2.sus_mean===null?null:R2.sus_mean-R1.sus_mean,tasks:protocol.tasks.map((task,i)=>({...task,success_delta:R1.tasks[i].success_rate===null||R2.tasks[i].success_rate===null?null:R2.tasks[i].success_rate-R1.tasks[i].success_rate,time_delta:R1.tasks[i].mean_seconds===null||R2.tasks[i].mean_seconds===null?null:R2.tasks[i].mean_seconds-R1.tasks[i].mean_seconds}))};
}
module.exports={protocol,session,score,compare,eligible};
