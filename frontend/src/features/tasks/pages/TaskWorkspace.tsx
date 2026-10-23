import { ActionIcon } from '../../../shared/components/ActionIcon';
import { Icons } from '../../../shared/components/Icons';
import { MailboxPanel } from '../../mailbox/components/MailboxPanel';
import { useState } from 'react';
import { api } from '../../../shared/api/client';
import { Input, Button } from '../../../shared/components/ui';
import { FieldSelect, Modal, Notice, ReleasePage, ResourceState, useResource } from '../../../shared/components/ReleaseLayout';
import type { Navigate } from '../../../shared/components/ReleaseLayout';
import type { Space } from '../../spaces/pages/Spaces';
import { DeskEntry } from '../../desk/components/DeskEntry';
import { weekActivity } from '../../../shared/lib/dates';

export interface WorkspaceTask { id: string; title: string; type: 'fisica' | 'digital'; status: string; digital_kind: string; reference_url: string | null; space_id: string | null; due_at: string | null; completed_at: string | null; }

export function TaskEditor({ task, initialType = 'fisica', kind = 'general', spaceId, onClose, onSaved }: { task?: WorkspaceTask; initialType?: string; kind?: string; spaceId?: string; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(task?.title || '');
  const [type, setType] = useState(task?.type || initialType);
  const [space, setSpace] = useState(task?.space_id || spaceId || '');
  const [reference, setReference] = useState(task?.reference_url || '');
  const [digitalKind, setDigitalKind] = useState(task?.digital_kind || kind);
  const [due, setDue] = useState(task?.due_at ? new Date(Date.parse(task.due_at) - 5 * 3600000).toISOString().slice(0,16) : '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const spaces = useResource<{ spaces: Space[] }>('/spaces');
  return <Modal title={task ? 'Editar tarea' : 'Nueva tarea'} busy={busy} onClose={onClose}><form className="grid gap-4" onSubmit={async e => { e.preventDefault(); setError(''); setBusy(true); try { await api(task ? `/tasks/${task.id}` : '/tasks', { method: task ? 'PATCH' : 'POST', body: JSON.stringify({ title, type, space_id: space || null, digital_kind: type === 'digital' ? digitalKind : 'general', reference_url: reference || null, due_at: due ? new Date(`${due}:00-05:00`).toISOString() : null }) }); onSaved(); } catch (err) { setError((err as Error).message); } finally { setBusy(false); } }}>
    <Input label="Título de la tarea" id="workspace-title" value={title} required maxLength={120} onChange={e => setTitle(e.target.value)}/><FieldSelect label="Tipo de tarea" value={type} onChange={v => { setType(v); setSpace(''); }}><option value="fisica">Física</option><option value="digital">Correos y archivos</option></FieldSelect>
    {type === 'digital' && <FieldSelect label="Qué vas a organizar" value={digitalKind} onChange={setDigitalKind}><option value="general">Organización general</option><option value="correo">Correo pendiente</option><option value="archivo">Archivo o carpeta</option></FieldSelect>}
    <FieldSelect label="Espacio (opcional)" value={space} onChange={setSpace}><option value="">Sin espacio</option>{spaces.data?.spaces.filter(s => s.type === type).map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</FieldSelect>
    {spaces.error && <Notice error>No se pudieron cargar los espacios. Puedes guardar la tarea sin espacio.</Notice>}
    <Input label="Fecha y hora límite en Bogotá (opcional)" type="datetime-local" value={due} onChange={e => setDue(e.target.value)}/>{type === 'digital' && <Input label="Enlace HTTPS de referencia (opcional)" type="url" placeholder="https://…" maxLength={2000} value={reference} onChange={e => setReference(e.target.value)}/>}
    {error && <Notice error>{error}</Notice>}<Button loading={busy}>Guardar tarea</Button>
  </form></Modal>;
}

export function TaskRows({ tasks, reload }: { tasks: WorkspaceTask[]; reload: () => void; navigate?: Navigate }) {
  const [editing, setEditing] = useState<WorkspaceTask>();
  const [archiving, setArchiving] = useState<WorkspaceTask>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const mutate = async (task: WorkspaceTask, action: 'start' | 'complete' | 'archive') => {
    setBusy(task.id); setError('');
    try { await api(`/tasks/${task.id}${action === 'start' ? '' : `/${action}`}`, { method: action === 'archive' ? 'POST' : 'PATCH', ...(action === 'start' ? { body: JSON.stringify({ status: 'en_progreso' }) } : {}) }); setArchiving(undefined); reload(); } catch (err) { setError((err as Error).message); } finally { setBusy(''); }
  };
  return <>{error && <Notice error>{error}</Notice>}<div className="grid gap-3">{tasks.map(task => <article className="surface p-4" key={task.id}><div className="flex gap-2 items-center mb-2"><span className="eyebrow">{task.type === 'fisica' ? 'Física' : task.digital_kind === 'correo' ? 'Correo' : task.digital_kind === 'archivo' ? 'Archivo' : 'Correos y archivos'}</span><span className="ml-auto text-xs text-text-secondary">{{ pendiente: 'Pendiente', en_progreso: 'En progreso', completada: 'Completada', archivada: 'Archivada' }[task.status] || task.status}</span></div><h3 className="font-semibold break-words">{task.title}</h3>{task.due_at && <p className="text-xs text-text-secondary mt-2">Límite: {new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'short' }).format(new Date(task.due_at))}</p>}{task.reference_url && <a href={task.reference_url} target="_blank" rel="noopener noreferrer" className="block text-primary text-sm py-3 break-all"><ActionIcon action="Abrir referencia"/><span>Abrir referencia</span></a>}{['pendiente','en_progreso'].includes(task.status) && <div className="flex flex-wrap gap-x-4 mt-3 text-sm"><button disabled={!!busy} className="text-primary min-h-11 font-semibold" onClick={() => mutate(task, 'complete')}>{busy === task.id ? 'Guardando…' : 'Completar'}</button>{task.status === 'pendiente' && <button disabled={!!busy} className="min-h-11" onClick={() => mutate(task, 'start')}>Empezar</button>}<button disabled={!!busy} className="min-h-11" onClick={() => setEditing(task)}>Editar</button><button disabled={!!busy} className="min-h-11 text-red-700" onClick={() => setArchiving(task)}>Archivar</button></div>}</article>)}</div>
    {editing && <TaskEditor task={editing} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); reload(); }}/>} {archiving && <Modal title="¿Archivar tarea?" busy={!!busy} onClose={() => setArchiving(undefined)}><p className="text-sm mb-5">Se conserva como archivada y deja de aparecer entre tus pendientes. No suma a la racha.</p><Button loading={!!busy} onClick={() => mutate(archiving, 'archive')}>Confirmar archivo</Button></Modal>}
  </>;
}

export function TaskWorkspace({ navigate, mode }: { navigate: Navigate; mode: 'fisica' | 'digital' | 'correo' | 'archivo' | 'kanban' | 'archivada' }) {
  const result = useResource<{ tasks: WorkspaceTask[] }>(`/tasks?status=${mode === 'archivada' ? 'archivada' : 'all'}${mode === 'fisica' ? '&type=fisica' : mode === 'archivada' ? '' : '&type=digital'}`);
  const [search, setSearch] = useState('');
  const [create, setCreate] = useState(false);
  const [status, setStatus] = useState('pendiente');
  const titles = { fisica: 'Orden del escritorio', digital: 'Correos y archivos', correo: 'Correos pendientes', archivo: 'Archivos y carpetas', kanban: 'Tu tablero', archivada: 'Tareas archivadas' };
  const tasks = result.data?.tasks.filter(task => (!['correo','archivo'].includes(mode) || task.digital_kind === mode) && (mode !== 'kanban' || task.status === status) && task.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())) || [];
  return <ReleasePage title={titles[mode]} subtitle={mode === 'correo' ? 'Tu selección de Gmail y tus pendientes manuales, en un solo lugar.' : mode === 'archivo' ? 'Organiza pendientes y enlaces a tus archivos. Antilia no lee ni borra archivos de tu dispositivo.' : 'Haz visible lo pendiente y avanza paso a paso.'} navigate={navigate} active={mode === 'fisica' ? '#/espacios' : '#/digital'} back={mode === 'fisica' ? '#/espacios' : '#/digital'}>
    {mode === 'correo' && <><MailboxPanel/><h2 className="font-bold text-xl mb-3">Pendientes agregados por ti</h2><p className="text-sm text-text-secondary mb-5">Estas tareas son independientes de los mensajes importados de Gmail.</p></>}
    {mode === 'fisica' && <section className="surface p-5 mb-5"><h2 className="font-bold mb-4">Tu mesa y tus tareas</h2><DeskEntry navigate={navigate}/><button className="text-primary font-semibold mt-3 min-h-11" onClick={()=>navigate('#/medir-espacio')}><ActionIcon action="Medir mi espacio"/><span>Medir mi espacio</span></button></section>}
    {mode==='digital'&&<><section className="workspace-intro"><p className="eyebrow">Tu bandeja, con un poco de calma</p><h2>Lo importante,<br/>siempre a mano.</h2><p>Reúne los correos que requieren tu atención y los archivos que quieres ordenar. Tú decides por dónde empezar.</p></section><div className="inbox-doors"><button className="inbox-door" onClick={()=>navigate('#/correos')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></svg><strong>Correos</strong><span>Conecta Gmail y atiende lo que importa.</span></button><button className="inbox-door" onClick={()=>navigate('#/archivos')}><Icons.Folder/><strong>Archivos</strong><span>Dale un lugar a tus enlaces y documentos.</span></button></div></>}
    {mode === 'digital' && <section className="surface p-5 mb-5"><h2 className="font-bold">Calendario semanal</h2><p className="text-xs text-text-secondary mt-1 mb-4">Días con correos y archivos organizados</p><div className="flex justify-between gap-2">{weekActivity(result.data?.tasks||[]).map(day=><div className="text-center" key={day.key}><span className="text-xs block mb-2">{day.label}</span><span className={`week-dot ${day.count?'is-active':''}`} aria-label={`${day.date}: ${day.count} completadas`}>{day.count?'✓':'·'}</span></div>)}</div></section>}
    {mode === 'digital' && <div className="workspace-shortcuts grid grid-cols-2 gap-3 mb-5">{[['#/kanban','Mis pendientes'],['#/archivadas','Lo que ya guardé']].map(([path,label]) => <button key={path} className="surface text-left p-4 font-semibold text-primary min-h-16" onClick={() => navigate(path)}><ActionIcon action={label}/>{label}</button>)}</div>}
    {mode !== 'archivada' && <Button className="w-full mb-4" onClick={() => setCreate(true)}>{mode === 'correo' ? 'Agregar correo pendiente' : mode === 'archivo' ? 'Agregar archivo pendiente' : 'Nueva tarea'}</Button>}
    <div className="mb-5"><Input label="Buscar en esta lista" type="search" value={search} onChange={e => setSearch(e.target.value)}/></div>
    {mode === 'kanban' && <div className="flex gap-2 mb-5">{[['pendiente','Pendiente'],['en_progreso','En curso'],['completada','Hecho']].map(([value,label]) => <button key={value} aria-pressed={status === value} className={`flex-1 rounded-xl text-sm py-3 ${status === value ? 'bg-primary text-white' : 'bg-white'}`} onClick={() => setStatus(value)}><ActionIcon action={label}/>{label}</button>)}</div>}
    <ResourceState {...result} retry={result.reload}/>{!result.loading && !result.error && !tasks.length && <p className="surface p-6 text-text-secondary text-sm">No hay tareas en esta vista. Agrega una o cambia la búsqueda.</p>}<TaskRows tasks={tasks} reload={result.reload}/>{create && <TaskEditor initialType={mode === 'fisica' ? 'fisica' : 'digital'} kind={mode === 'correo' || mode === 'archivo' ? mode : 'general'} onClose={() => setCreate(false)} onSaved={() => { setCreate(false); result.reload(); }}/>} 
  </ReleasePage>;
}
