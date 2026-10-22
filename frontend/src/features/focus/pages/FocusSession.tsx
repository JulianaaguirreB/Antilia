import {useEffect,useState} from 'react';
import {useAuth} from '../../auth/context/AuthContext';
import {api} from '../../../shared/api/client';
import {Button} from '../../../shared/components/ui';
import {FieldSelect,Notice,ReleasePage,ResourceState,useResource} from '../../../shared/components/ReleaseLayout';
import type {Navigate} from '../../../shared/components/ReleaseLayout';
import type {WorkspaceTask} from '../../tasks/pages/TaskWorkspace';
type Session={taskId:string;endsAt:number|null;remaining:number};
export function FocusSession({navigate}:{navigate:Navigate}){
 const {user}=useAuth();
 const key=`antilia-focus-${user?.id}`;
 const result=useResource<{tasks:WorkspaceTask[]}>('/tasks?status=all');
 const tasks=result.data?.tasks.filter(t=>['pendiente','en_progreso'].includes(t.status))||[];
 const [session,setSession]=useState<Session|null>(()=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v.taskId==='string'&&Number.isFinite(v.remaining)&&v.remaining>=0&&v.remaining<=300&&(v.endsAt===null||Number.isFinite(v.endsAt))?v:null;}catch{return null;}});
 const [taskId,setTaskId]=useState('');
 const [now,setNow]=useState(Date.now());
 const [error,setError]=useState('');
 const [storageError,setStorageError]=useState(false);
 const [busy,setBusy]=useState(false);
 const [done,setDone]=useState(false);
 useEffect(()=>{try{if(session)localStorage.setItem(key,JSON.stringify(session));else localStorage.removeItem(key);}catch{setStorageError(true);}},[key,session]);
 useEffect(()=>{const update=()=>setNow(Date.now());const timer=setInterval(update,1000);window.addEventListener('focus',update);document.addEventListener('visibilitychange',update);return()=>{clearInterval(timer);window.removeEventListener('focus',update);document.removeEventListener('visibilitychange',update);};},[]);
 const seconds=session?session.endsAt===null?session.remaining:Math.max(0,Math.ceil((session.endsAt-now)/1000)):300;
 const task=tasks.find(t=>t.id===session?.taskId);
 return <ReleasePage title="Cinco minutos de orden" subtitle="Una tarea. Un pequeño espacio para enfocarte." navigate={navigate} active="#/inicio" back="#/inicio"><ResourceState {...result} retry={result.reload}/>{storageError&&<Notice>No pudimos conservar el temporizador en este dispositivo. Si cierras la app, tendrás que iniciarlo de nuevo.</Notice>}{error&&<Notice error>{error}</Notice>}{done&&<Notice>Tarea completada. Tu progreso y tu racha están actualizados en tu cuenta.</Notice>}{result.data&&!session&&<section className="surface p-5 grid gap-4"><h2 className="font-bold">Elige algo pequeño</h2><p className="text-sm text-text-secondary">Por ejemplo, despejar el centro del escritorio o clasificar un documento. Elige una tarea de tu lista y dedícale cinco minutos.</p>{tasks.length?<><FieldSelect label="Tarea para esta sesión" value={taskId} onChange={setTaskId}><option value="">Selecciona una tarea</option>{tasks.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</FieldSelect><Button disabled={!tasks.some(t=>t.id===taskId)} onClick={()=>{setDone(false);const end=Date.now()+300000;setNow(Date.now());setSession({taskId,endsAt:end,remaining:300});}}>Empezar cinco minutos</Button></>:<><p className="text-sm">No tienes tareas pendientes. Crea una para empezar.</p><Button onClick={()=>navigate('#/inicio')}>Ir a mis tareas</Button></>}</section>}
 {session&&result.data&&<section className="surface p-6 text-center"><p className="eyebrow mb-3">Tu tarea de esta sesión</p><h2 className="font-bold text-xl mb-6">{task?.title||'Esta tarea ya no está pendiente'}</h2><div className="text-6xl font-bold text-primary tabular-nums mb-3" role="timer" aria-label="Tiempo restante">{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</div><p className="text-sm text-text-secondary mb-6" role="status">{seconds===0?'Terminó el tiempo. ¿Lograste completar tu tarea?':session.endsAt===null?'Sesión en pausa':'Un paso a la vez. No necesitas ordenar todo hoy.'}</p>{task&&<div className="grid gap-3">{seconds>0&&<Button variant="secondary" onClick={()=>{setNow(Date.now());setSession({...session,endsAt:session.endsAt===null?Date.now()+seconds*1000:null,remaining:seconds});}}>{session.endsAt===null?'Continuar sesión':'Pausar sesión'}</Button>}<Button loading={busy} onClick={async()=>{setBusy(true);setError('');try{await api(`/tasks/${task.id}/complete`,{method:'PATCH'});setSession(null);setDone(true);result.reload();}catch(err){setError((err as Error).message);result.reload();}finally{setBusy(false);}}}>Ya completé mi tarea</Button></div>}<button disabled={busy} type="button" className="min-h-11 mt-4 text-text-secondary text-sm" onClick={()=>setSession(null)}>Terminar sesión sin completar tarea</button><p className="text-xs text-text-secondary mt-5">El tiempo continúa si cierras la app. Este temporizador se conserva solo en este dispositivo y no envía una alarma en segundo plano. El tiempo por sí solo no suma a tu racha.</p></section>}
 <button className="text-primary font-semibold min-h-11 mt-4" onClick={()=>navigate('#/progreso')}>Ver mi racha y a Lumi →</button></ReleasePage>;
}
