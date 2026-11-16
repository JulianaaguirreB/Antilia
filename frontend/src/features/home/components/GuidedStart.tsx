import {useState} from 'react';
import {api} from '../../../shared/api/client';
import {Button,Input} from '../../../shared/components/ui';
import {FieldSelect,Modal,Notice,ReleasePage,ResourceState,useResource} from '../../../shared/components/ReleaseLayout';
import type {Navigate} from '../../../shared/components/ReleaseLayout';
import type {Space} from '../../spaces/pages/Spaces';
import {TaskEditor,TaskRows} from '../../tasks/pages/TaskWorkspace';
import type {WorkspaceTask} from '../../tasks/pages/TaskWorkspace';

export function GuidedStart({navigate}:{navigate:Navigate}) {
 const spaces=useResource<{spaces:Space[]}>('/spaces');
 const tasks=useResource<{tasks:WorkspaceTask[]}>('/tasks?status=all');
 const [selected,setSelected]=useState(''),[createSpace,setCreateSpace]=useState(false),[createTask,setCreateTask]=useState(false);
 const [name,setName]=useState(''),[type,setType]=useState('fisica'),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const space=spaces.data?.spaces.find(s=>s.id===selected)||spaces.data?.spaces[0];
 const attached=tasks.data?.tasks.filter(t=>t.space_id===space?.id)||[];
 const done=attached.some(t=>t.status==='completada');
 const steps=[!!space,attached.length>0,done];
 const ready=!spaces.loading&&!tasks.loading&&!spaces.error&&!tasks.error;
 const reload=()=>{spaces.reload();tasks.reload();};
 return <ReleasePage title="Empecemos juntos" subtitle="Un lugar, un pendiente y un pequeño logro. Sin hacerlo todo de una vez." navigate={navigate} back="#/inicio">
  <ResourceState {...spaces} retry={spaces.reload}/><ResourceState {...tasks} retry={tasks.reload}/>
  {ready&&<>
   <section className="hero-card mb-5"><p className="eyebrow">Tu primer recorrido</p><h2 className="text-xl font-bold mt-2">{done?'Ya hiciste espacio para ti':'Un paso pequeño sí cuenta'}</h2><p className="text-sm mt-3">{steps.filter(Boolean).length} de 3 pasos listos en este espacio. Tu avance sale de lo que guardas en tu cuenta.</p></section>
   <ol className="grid gap-4 mb-5">
    <li className="surface p-5"><p className="eyebrow">{steps[0]?'✓ Listo':'Paso 1'}</p><h2 className="text-xl font-bold my-2">Dale un lugar</h2><p className="text-sm mb-4">Crea un espacio como «Mi escritorio» o «Correos del trabajo». Si ya tienes uno, úsalo.</p>{space&&<div className="mb-4"><FieldSelect label="Espacio para este recorrido" value={space.id} onChange={setSelected}>{spaces.data?.spaces.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</FieldSelect></div>}<Button variant={space?'secondary':'primary'} onClick={()=>{setName('');setError('');setCreateSpace(true);}}>{space?'Crear otro espacio':'Crear mi espacio'}</Button></li>
    <li className="surface p-5"><p className="eyebrow">{steps[1]?'✓ Listo':'Paso 2'}</p><h2 className="text-xl font-bold my-2">Elige algo concreto</h2><p className="text-sm mb-4">{space?'Agrega a «'+space.name+'» un pendiente pequeño: guardar una libreta o responder un correo.':'Primero crea o selecciona tu espacio.'}</p><Button disabled={!space} onClick={()=>setCreateTask(true)}>Agregar mi pendiente</Button></li>
    <li className="surface p-5"><p className="eyebrow">{done?'✓ Listo':'Paso 3'}</p><h2 className="text-xl font-bold my-2">Hazlo y celebra</h2><p className="text-sm mb-4">Cuando lo termines, pulsa Completar. Una tarea completada hoy enciende a Lumi; aquí puedes hacerlo sin buscar otra pantalla.</p>{attached.length?<TaskRows tasks={attached} reload={reload}/>:<p className="text-sm text-text-secondary">Tu pendiente aparecerá aquí al guardarlo.</p>}{done&&<Button className="mt-4" onClick={()=>navigate('#/progreso')}>Ver a Lumi y mi racha</Button>}</li>
   </ol><button className="surface p-4 w-full font-bold text-primary" onClick={()=>navigate('#/pendientes')}>Ver todos mis pendientes</button>
  </>}
  {createSpace&&<Modal title="Crear mi espacio" busy={busy} onClose={()=>setCreateSpace(false)}><form className="grid gap-4" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{const result=await api<{space:Space}>('/spaces',{method:'POST',body:JSON.stringify({name,type})});setSelected(result.space.id);setCreateSpace(false);spaces.reload();}catch(err){setError((err as Error).message);}finally{setBusy(false);}}}><Input label="Nombre del espacio" value={name} maxLength={100} required onChange={e=>setName(e.target.value)} placeholder="Mi escritorio"/><FieldSelect label="Tipo de espacio" value={type} onChange={setType}><option value="fisica">Físico: mesa, oficina o archivo en papel</option><option value="digital">Correos y archivos del computador</option></FieldSelect>{error&&<Notice error>{error}</Notice>}<Button loading={busy}>Guardar mi espacio</Button></form></Modal>}
  {createTask&&space&&<TaskEditor key={space.id} initialType={space.type} spaceId={space.id} onClose={()=>setCreateTask(false)} onSaved={()=>{setCreateTask(false);reload();}}/>}
 </ReleasePage>;
}
