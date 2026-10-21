import { useState } from 'react';
import { api } from '../../../shared/api/client';
import { Input, Button } from '../../../shared/components/ui';
import { Modal, Notice, ReleasePage, ResourceState, useResource, FieldSelect } from '../../../shared/components/ReleaseLayout';
import type { Navigate } from '../../../shared/components/ReleaseLayout';
import { TaskEditor, TaskRows } from '../../tasks/pages/TaskWorkspace';
import type { WorkspaceTask } from '../../tasks/pages/TaskWorkspace';

export interface Space { id: string; name: string; type: 'fisica' | 'digital'; description: string; archived_at: string | null; }
export function Spaces({ navigate }: { navigate: Navigate }) {
  const [archived, setArchived] = useState(false);
  const result = useResource<{ spaces: Space[] }>(`/spaces?archived=${archived}`);
  const [editing, setEditing] = useState<Space | null | undefined>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('fisica');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const open = (space: Space | null) => { setEditing(space); setName(space?.name || ''); setDescription(space?.description || ''); setType(space?.type || 'fisica'); setError(''); };
  return <ReleasePage title="Organización física" subtitle="Un lugar para cada cosa. Organiza tu escritorio y tus espacios digitales." navigate={navigate} active="#/espacios">
    <div className="flex gap-3 mb-4"><button className="surface p-4 flex-1 text-primary font-semibold text-sm" onClick={()=>navigate('#/escritorio')}>Orden del escritorio →</button><button className="surface p-4 flex-1 text-primary font-semibold text-sm" onClick={()=>navigate('#/medir-espacio')}>Medir espacio →</button></div>
    <button className="surface p-4 w-full text-left text-primary font-semibold mb-4" onClick={()=>navigate('#/mi-escritorio')}>Mi escritorio guardado →</button>
    <Button className="w-full mb-4" onClick={() => open(null)}>Agregar espacio</Button><button className="text-sm text-primary mb-5 min-h-11" onClick={() => setArchived(!archived)}>{archived ? 'Ver espacios activos' : 'Ver espacios archivados'}</button>
    <ResourceState {...result} retry={result.reload}/>
    {!result.loading && !result.error && result.data?.spaces.length === 0 && <div className="surface p-8 text-center"><p className="text-xl font-semibold mb-2">Tu orden empieza aquí</p><p className="text-sm text-text-secondary">Crea un espacio físico o digital para agrupar tus tareas.</p></div>}
    <div className="grid gap-4">{result.data?.spaces.map(space => <article className="surface p-5" key={space.id}><p className="eyebrow mb-2">{space.type === 'fisica' ? 'Espacio físico' : 'Espacio digital'}{space.archived_at ? ' · Archivado' : ''}</p><h2 className="text-xl font-bold break-words">{space.name}</h2><p className="text-sm text-text-secondary my-3">{space.description || 'Todo lo que necesitas ordenar en un solo lugar.'}</p><div className="flex gap-4"><button className="text-primary min-h-11 font-semibold" onClick={() => navigate(`#/espacio/${space.id}`)}>Ver tareas →</button>{!space.archived_at && <button className="text-text-secondary min-h-11" onClick={() => open(space)}>Editar</button>}</div></article>)}</div>
    {editing !== undefined && <Modal title={editing ? 'Editar espacio' : 'Agregar espacio'} busy={busy} onClose={() => setEditing(undefined)}><form className="grid gap-4" onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); try { await api(editing ? `/spaces/${editing.id}` : '/spaces', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(editing ? { name, description } : { name, description, type }) }); setEditing(undefined); result.reload(); } catch (err) { setError((err as Error).message); } finally { setBusy(false); } }}><Input id="space-name" label="Nombre del espacio" value={name} onChange={e => setName(e.target.value)} maxLength={100} required/>{!editing && <FieldSelect label="Tipo de espacio" value={type} onChange={setType}><option value="fisica">Físico</option><option value="digital">Digital</option></FieldSelect>}<Input id="space-description" label="Descripción (opcional)" value={description} maxLength={1000} onChange={e => setDescription(e.target.value)}/>{error && <Notice error>{error}</Notice>}<Button loading={busy}>Guardar espacio</Button></form></Modal>}
  </ReleasePage>;
}

export function SpaceDetail({ id, navigate }: { id: string; navigate: Navigate }) {
  const result = useResource<{ space: Space }>(`/spaces/${id}`);
  const tasks = useResource<{ tasks: WorkspaceTask[] }>(`/tasks?status=all&space_id=${id}`);
  const [create, setCreate] = useState(false);
  const [archive, setArchive] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return <ReleasePage title={result.data?.space.name || 'Espacio'} subtitle={result.data?.space.description} navigate={navigate} active="#/espacios" back="#/espacios"><ResourceState {...result} retry={result.reload}/>{error && <Notice error>{error}</Notice>}{result.data && <><p className="eyebrow mb-5">{result.data.space.type === 'fisica' ? 'Organización física' : 'Organización digital'}</p>{!result.data.space.archived_at && <Button className="w-full mb-5" onClick={() => setCreate(true)}>Agregar tarea al espacio</Button>}<ResourceState {...tasks} retry={tasks.reload}/><TaskRows tasks={tasks.data?.tasks || []} reload={tasks.reload} navigate={navigate}/>{!tasks.loading && tasks.data?.tasks.length === 0 && <p className="surface p-6 text-sm text-text-secondary">Este espacio todavía no tiene tareas. Agrega un paso concreto para empezar.</p>}{!result.data.space.archived_at && <button className="text-red-700 mt-6 min-h-11" onClick={() => setArchive(true)}>Archivar espacio</button>}</>}
    {create && result.data && <TaskEditor initialType={result.data.space.type} spaceId={id} onClose={() => setCreate(false)} onSaved={() => { setCreate(false); tasks.reload(); }}/>} {archive && <Modal title="¿Archivar este espacio?" busy={busy} onClose={() => setArchive(false)}><p className="text-sm text-text-secondary mb-5">Las tareas y el historial se conservan. Primero completa, archiva o mueve las tareas pendientes.</p><Button loading={busy} onClick={async () => { setBusy(true); try { await api(`/spaces/${id}/archive`, { method: 'POST' }); navigate('#/espacios'); } catch (err) { setError((err as Error).message); setArchive(false); } finally { setBusy(false); } }}>Confirmar archivo</Button></Modal>}
  </ReleasePage>;
}
