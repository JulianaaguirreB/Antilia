import { ActionIcon } from '../../../shared/components/ActionIcon';
import { useState } from 'react';
import { api } from '../../../shared/api/client';
import { Input, Button } from '../../../shared/components/ui';
import { Notice, ReleasePage, ResourceState, useResource } from '../../../shared/components/ReleaseLayout';
import type { Navigate } from '../../../shared/components/ReleaseLayout';
import { DeskPlan } from '../../desk/components/DeskPlan';
import { CameraMeasure } from '../../measurements/components/CameraMeasure';
import { weekActivity } from '../../../shared/lib/dates';
import type { Task } from '../../home/pages/Home';

interface Measurement { id:string; search_minutes:number; misplaced_items:number; clear_width_cm:string|null; created_at:string; notes:string; }
export function MeasureSpace({ navigate }: {navigate:Navigate}) {
  const result=useResource<{measurements:Measurement[]}>('/measurements');
  const [minutes,setMinutes]=useState('');
  const [objects,setObjects]=useState('');
  const [width,setWidth]=useState('');
  const [notes,setNotes]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [saved,setSaved]=useState(false);
  return <ReleasePage title="Medir espacio" subtitle="Comprueba cómo cambia tu orden con datos que tú registras." navigate={navigate} active="#/espacios" back="#/espacios">
    <section className="surface p-5 mb-5"><h2 className="font-bold mb-4">Distribución de tu escritorio</h2><DeskPlan/><p className="text-xs text-text-secondary mt-3">Es una guía visual, no una medición de cámara ni una regla universal.</p></section>
    <CameraMeasure onUse={cm=>{setWidth(String(cm));setSaved(false);setNotes('Ancho registrado desde la herramienta de medidas; comprobar con cinta métrica si procede de una fotografía.');}}/>
    <Notice>Registra tu situación antes de empezar y repite al terminar la jornada. El conteo de objetos y los minutos son manuales.</Notice>
    <form className="surface p-5 grid gap-4 mb-6" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');setSaved(false);try{await api('/measurements',{method:'POST',body:JSON.stringify({search_minutes:Number(minutes),misplaced_items:Number(objects),clear_width_cm:width?Number(width):null,notes})});setSaved(true);result.reload();}catch(err){setError((err as Error).message);}finally{setBusy(false);}}}>
      <h2 className="font-bold">Estado actual de tu espacio</h2><Input label="Minutos buscando documentos hoy" type="number" required min={0} max={1440} step={1} value={minutes} onChange={e=>setMinutes(e.target.value)}/><Input label="Objetos o archivos fuera de lugar" type="number" required min={0} max={10000} step={1} value={objects} onChange={e=>setObjects(e.target.value)}/><Input label="Ancho despejado en cm (opcional)" type="number" min={0.01} max={10000} step={0.01} value={width} onChange={e=>setWidth(e.target.value)}/><Input label="Nota (opcional)" maxLength={500} value={notes} onChange={e=>setNotes(e.target.value)}/>{error&&<Notice error>{error}</Notice>}{saved&&<Notice>Medición guardada en tu cuenta.</Notice>}<Button loading={busy}>Guardar medición</Button>
    </form><ResourceState {...result} retry={result.reload}/><h2 className="font-bold mb-3">Tu historial</h2>{result.data?.measurements.length===0&&<p className="surface p-5 text-sm">Aún no tienes una línea base. Guarda tu primera medición.</p>}{result.data?.measurements.map(m=><article className="surface p-4 mb-3" key={m.id}><p className="eyebrow mb-2">{new Intl.DateTimeFormat('es-CO',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Bogota'}).format(new Date(m.created_at))}</p><p>{m.search_minutes} min buscando · {m.misplaced_items} fuera de lugar</p>{m.clear_width_cm&&<p className="text-sm mt-2">{Number(m.clear_width_cm)} cm despejados</p>}{m.notes&&<p className="text-sm text-text-secondary mt-2">{m.notes}</p>}</article>)}
  </ReleasePage>;
}

export function Insights({navigate,summary=false}:{navigate:Navigate;summary?:boolean}) {
  const result=useResource<{tasks:Task[]}>('/tasks?status=all');
  const tasks=result.data?.tasks||[];
  const completed=tasks.filter(t=>t.status==='completada');
  const pct=tasks.length?Math.round(completed.length/tasks.length*100):0;
  const week=weekActivity(completed);
  const peak=Math.max(1,...week.map(d=>d.count));
  return <ReleasePage title={summary?'Estado general':'Métricas y logros'} subtitle="Tu organización, con tus datos reales." navigate={navigate} active="#/progreso" back="#/progreso"><ResourceState {...result} retry={result.reload}/>{result.data&&<>
    <section className="surface p-6 mb-5 text-center"><p className="font-bold mb-5">Tareas completadas</p><div className="order-ring" style={{background:`conic-gradient(var(--color-primary) ${pct}%, var(--color-primary-soft) 0)`}}><div><strong>{pct}%</strong><span>{completed.length} de {tasks.length}</span></div></div><p className="text-xs text-text-secondary mt-4">Porcentaje de tus tareas activas y completadas. No es una medida automática del desorden.</p></section>
    <div className="grid grid-cols-2 gap-3 mb-5">{(['fisica','digital'] as const).map(type=>{const all=tasks.filter(t=>t.type===type);const done=all.filter(t=>t.status==='completada').length;return <div key={type} className="surface p-4"><p className="font-bold text-sm">{type==='fisica'?'Físico':'Correos y archivos'}</p><p className="text-primary font-bold text-2xl mt-2">{done}<span className="text-sm text-text-secondary font-normal"> / {all.length}</span></p><progress aria-label={`Progreso ${type}`} className="w-full mt-2 accent-primary" value={done} max={all.length||1}/></div>;})}</div>
    <section className="surface p-5 mb-5"><h2 className="font-bold mb-5">Actividad de esta semana</h2><div className="flex items-end gap-2 h-36">{week.map((day,i)=><div key={i} className="flex-1 flex flex-col justify-end items-center h-full gap-2"><span className="text-xs">{day.count}</span><div className="w-full rounded-t-lg bg-primary" style={{height:`${Math.max(3,day.count/peak*80)}px`}}/><span className="text-xs text-text-secondary">{day.label}</span></div>)}</div></section>
    <button className="surface p-5 text-primary text-left w-full font-semibold" onClick={()=>navigate('#/medir-espacio')}><ActionIcon action="Medir si el desorden disminuye"/><span>Medir si el desorden disminuye</span></button><p className="text-xs text-text-secondary mt-4">Tus resultados son personales. Esta versión no incluye ranking ni datos de otras personas.</p>
  </>}</ReleasePage>;
}

export function Privacy({navigate}:{navigate:Navigate}) {
  return <ReleasePage title="Privacidad y datos" subtitle="Qué guarda Antilia y para qué." navigate={navigate} active="#/perfil" back="#/perfil"><section className="surface p-5 space-y-4 text-sm leading-relaxed"><h2 className="font-bold text-lg">Tus datos de organización</h2><p>Tu nombre, correo, tareas, espacios, turnos, recordatorios y mediciones se guardan en PostgreSQL de Neon. La app consulta el servidor HTTPS publicado en Vercel. Tu contraseña se guarda como hash. La foto de perfil que eliges se guarda en tu cuenta; puedes cambiarla o quitarla. También se conserva el conjunto que eliges para Lumi. La landing registra únicamente totales de visitas por sesión de pestaña y clics por día, dispositivo y origen general, sin guardar IP ni identificadores de visitantes.</p><p>La sesión se conserva en este dispositivo. Cerrar sesión retira su acceso local y mantiene tus datos en el servidor para cuando vuelvas.</p><p>Gmail se consulta solo si lo conectas y autorizas su lectura. Guardamos asunto, remitente, fecha y extracto de mensajes seleccionados; el texto completo se consulta al abrirlo y no se guarda. Puedes desconectar y eliminar las copias desde Correos. No enviamos, borramos ni cambiamos mensajes de Gmail. Antilia no explora archivos del celular ni realiza escaneos 3D del escritorio. Los tres modelos del escritorio son representaciones 3D editables; no son escaneos del entorno. La cámara y las fotos se usan solo cuando tú eliges medir; la foto se procesa en el dispositivo y no se sube al servidor. Los archivos y los pendientes manuales son enlaces y tareas que tú agregas.</p><p>Los minutos y conteos son manuales; el ancho y el fondo pueden estimarse desde una fotografía con referencia rectangular. Las medidas de la app Medidas de Apple se introducen manualmente. No se comparten en un ranking. No subas documentos confidenciales ni datos de otras personas en los títulos o enlaces.</p><button className="text-primary font-semibold min-h-11" onClick={()=>navigate('#/perfil')}><ActionIcon action="Volver a mi cuenta"/><span>Volver a mi cuenta</span></button></section></ReleasePage>;
}
