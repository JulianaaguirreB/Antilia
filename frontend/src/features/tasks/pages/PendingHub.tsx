import {useState} from 'react';
import {Button,Input} from '../../../shared/components/ui';
import {FieldSelect,ReleasePage,ResourceState,useResource} from '../../../shared/components/ReleaseLayout';
import type {Navigate} from '../../../shared/components/ReleaseLayout';
import type {Space} from '../../spaces/pages/Spaces';
import {TaskEditor,TaskRows} from './TaskWorkspace';
import type {WorkspaceTask} from './TaskWorkspace';

const fold=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
const day=(date:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
export function PendingHub({navigate}:{navigate:Navigate}) {
 const result=useResource<{tasks:WorkspaceTask[]}>('/tasks?status=all');
 const spaces=useResource<{spaces:Space[]}>('/spaces');
 const [search,setSearch]=useState(''),[type,setType]=useState('all'),[status,setStatus]=useState('open'),[deadline,setDeadline]=useState('all'),[space,setSpace]=useState('all'),[create,setCreate]=useState(false);
 const now=new Date();const today=day(now);
 const matchesDeadline=(t:WorkspaceTask)=>deadline==='all'?true:deadline==='none'?!t.due_at:!t.due_at?false:deadline==='today'?day(new Date(t.due_at))===today:new Date(t.due_at).getTime()<now.getTime()&&t.status!=='completada';
 const tasks=(result.data?.tasks||[]).filter(t=>{
  const s=spaces.data?.spaces.find(s=>s.id===t.space_id);
  return (!search||fold(t.title+' '+(s?.name||'')).includes(fold(search)))&&(type==='all'||t.type===type)&&(status==='all'||status==='open'&&['pendiente','en_progreso'].includes(t.status)||t.status===status)&&(space==='all'||(space==='none'?!t.space_id:t.space_id===space))&&matchesDeadline(t);
 }).sort((a,b)=>Number(a.status==='completada')-Number(b.status==='completada')||(a.due_at?Date.parse(a.due_at):Infinity)-(b.due_at?Date.parse(b.due_at):Infinity)||a.title.localeCompare(b.title,'es'));
 const reset=()=>{setSearch('');setType('all');setStatus('open');setDeadline('all');setSpace('all');};
 return <ReleasePage title="Lo que tengo pendiente" subtitle="Tu escritorio, tus correos y tus archivos en una sola lista. Primero, lo que vence antes." navigate={navigate} back="#/inicio">
  <section className="surface p-5 mb-5"><h2 className="text-lg font-bold mb-3">Encuentra tu próximo paso</h2><div className="grid gap-4"><Input label="Buscar pendiente o espacio" value={search} type="search" maxLength={120} onChange={e=>setSearch(e.target.value)} placeholder="Correo, libreta, oficina…"/><div className="grid grid-cols-2 gap-3"><FieldSelect label="Dónde" value={type} onChange={setType}><option value="all">Todos</option><option value="fisica">En mi espacio</option><option value="digital">Correos y archivos</option></FieldSelect><FieldSelect label="Estado" value={status} onChange={setStatus}><option value="open">Sin terminar</option><option value="pendiente">Por empezar</option><option value="en_progreso">En curso</option><option value="completada">Completadas</option><option value="all">Todos</option></FieldSelect></div><FieldSelect label="Fecha límite" value={deadline} onChange={setDeadline}><option value="all">Cualquier fecha</option><option value="today">Vence hoy (Bogotá)</option><option value="overdue">Vencidos sin terminar</option><option value="none">Sin fecha límite</option></FieldSelect><FieldSelect label="Espacio" value={space} onChange={setSpace}><option value="all">Todos mis espacios</option><option value="none">Sin espacio asignado</option>{spaces.data?.spaces.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</FieldSelect><button className="min-h-11 text-primary font-bold" onClick={reset}>Limpiar filtros</button></div></section>
  <Button className="w-full mb-5" onClick={()=>setCreate(true)}>Agregar pendiente</Button><ResourceState {...result} retry={result.reload}/><ResourceState {...spaces} retry={spaces.reload}/>
  {!result.loading&&!result.error&&<><p className="text-sm mb-4" role="status">{tasks.length} {tasks.length===1?'resultado':'resultados'}. Los pendientes sin fecha aparecen al final.</p>{tasks.length?<TaskRows tasks={tasks} reload={result.reload} spaceNames={Object.fromEntries((spaces.data?.spaces||[]).map(s=>[s.id,s.name]))}/>:<section className="surface p-6 text-center"><h2 className="font-bold mb-2">Un poco de aire en tu lista</h2><p className="text-sm mb-3">No hay pendientes con estos filtros. Puedes cambiarlos o agregar uno nuevo.</p><button className="min-h-11 font-bold text-primary" onClick={reset}>Ver todos los pendientes</button></section>}</>}
  {create&&<TaskEditor initialType={spaces.data?.spaces.find(s=>s.id===space)?.type||(type==='digital'?'digital':'fisica')} spaceId={space!=='all'&&space!=='none'?space:undefined} onClose={()=>setCreate(false)} onSaved={()=>{setCreate(false);reset();result.reload();}}/>}
 </ReleasePage>;
}
