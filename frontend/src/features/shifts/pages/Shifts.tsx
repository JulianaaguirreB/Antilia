import { useState } from 'react';
import { api } from '../../../shared/api/client';
import { Button, Input } from '../../../shared/components/ui';
import { Modal, Notice, ReleasePage, ResourceState, useResource } from '../../../shared/components/ReleaseLayout';
import type { Navigate } from '../../../shared/components/ReleaseLayout';

interface Shift { id: string; title: string; starts_at: string; ends_at: string; notes: string; }
const local = (value: string) => new Date(Date.parse(value) - 5 * 3600000).toISOString().slice(0,16);
export function Shifts({ navigate }: { navigate: Navigate }) {
  const result = useResource<{ shifts: Shift[] }>('/shifts');
  const [editing, setEditing] = useState<Shift | null | undefined>();
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [archive, setArchive] = useState<Shift>();
  const open = (shift: Shift | null) => { setEditing(shift); setTitle(shift?.title || ''); setStart(shift ? local(shift.starts_at) : ''); setEnd(shift ? local(shift.ends_at) : ''); setNotes(shift?.notes || ''); setError(''); };
  return <ReleasePage title="Tu agenda" subtitle="Turnos y bloques de organización, sin cruces de horario. Hora de Bogotá." navigate={navigate} back="#/inicio"><Button className="w-full mb-5" onClick={() => open(null)}>Agregar turno</Button><ResourceState {...result} retry={result.reload}/>{error && editing === undefined && <Notice error>{error}</Notice>}{!result.loading && !result.error && !result.data?.shifts.length && <p className="surface p-6 text-sm text-text-secondary">Agenda un turno para reservar tiempo en tu día.</p>}<div className="grid gap-3">{result.data?.shifts.map(shift => <article className="surface p-5" key={shift.id}><p className="eyebrow mb-2">{new Date(shift.starts_at).toLocaleDateString('es-CO', { timeZone: 'America/Bogota', weekday: 'long', month: 'short', day: 'numeric' })}</p><h2 className="text-xl font-semibold">{shift.title}</h2><p className="text-sm text-primary my-2">{new Date(shift.starts_at).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' })} - {new Date(shift.ends_at).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' })}</p><p className="text-sm text-text-secondary">{shift.notes}</p><div className="flex gap-5 mt-3"><button className="min-h-11 text-primary" onClick={() => open(shift)}>Editar</button><button className="min-h-11 text-red-700" onClick={() => setArchive(shift)}>Archivar</button></div></article>)}</div>
    {editing !== undefined && <Modal title={editing ? 'Editar turno' : 'Agregar turno'} busy={busy} onClose={() => setEditing(undefined)}><form className="grid gap-4" onSubmit={async e => { e.preventDefault(); setError(''); if (end <= start) { setError('El final debe ser posterior al inicio.'); return; } setBusy(true); try { await api(editing ? `/shifts/${editing.id}` : '/shifts', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify({ title, starts_at: new Date(`${start}:00-05:00`).toISOString(), ends_at: new Date(`${end}:00-05:00`).toISOString(), notes }) }); setEditing(undefined); result.reload(); } catch (err) { setError((err as Error).message); } finally { setBusy(false); } }}><Input label="Nombre del turno" required maxLength={120} value={title} onChange={e => setTitle(e.target.value)}/><Input label="Inicio en Bogotá" type="datetime-local" required value={start} onChange={e => setStart(e.target.value)}/><Input label="Final en Bogotá" type="datetime-local" required value={end} onChange={e => setEnd(e.target.value)}/><Input label="Notas (opcional)" maxLength={1000} value={notes} onChange={e => setNotes(e.target.value)}/>{error && <Notice error>{error}</Notice>}<Button loading={busy}>Guardar turno</Button></form></Modal>}
    {archive && <Modal title="¿Archivar este turno?" busy={busy} onClose={() => setArchive(undefined)}><p className="text-sm mb-5">Se quitará de tu agenda activa y quedará guardado como archivado.</p><Button loading={busy} onClick={async () => { setBusy(true); try { await api(`/shifts/${archive.id}/archive`, { method: 'POST' }); setArchive(undefined); result.reload(); } catch (err) { setError((err as Error).message); setArchive(undefined); } finally { setBusy(false); } }}>Confirmar archivo</Button></Modal>}
  </ReleasePage>;
}
