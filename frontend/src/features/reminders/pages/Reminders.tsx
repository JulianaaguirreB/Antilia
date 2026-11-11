import { useState } from 'react';
import { api } from '../../../shared/api/client';
import { Input, Button } from '../../../shared/components/ui';
import { FieldSelect, Modal, Notice, ReleasePage, ResourceState, useResource } from '../../../shared/components/ReleaseLayout';
import type { Navigate } from '../../../shared/components/ReleaseLayout';

interface Reminder { id: string; title: string; message: string; schedule_type: 'once' | 'daily'; local_time: string | null; next_run_at: string; enabled: boolean; }
interface Delivery { scheduled_for: string; status: string; attempts: number; sent_at: string | null; error_code: string | null; }
export function Reminders({ navigate }: { navigate: Navigate }) {
  const result = useResource<{ reminders: Reminder[]; email_configured: boolean }>('/reminders');
  const capabilities = useResource<{ email_configured: boolean; scheduler_configured: boolean }>('/capabilities');
  const profile = useResource<{ user: { email_verified_at: string | null } }>('/auth/me');
  const [editing, setEditing] = useState<Reminder | null | undefined>();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('09:00');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<string>();
  const historyResult = useResource<{ deliveries: Delivery[] }>(history ? `/reminders/${history}/deliveries` : '/reminders');
  const canEnable = !!profile.data?.user.email_verified_at && !!capabilities.data?.email_configured && !!capabilities.data?.scheduler_configured;
  const [enabled, setEnabled] = useState(false);
  const open = (item: Reminder | null) => { setEditing(item); setTitle(item?.title || ''); setMessage(item?.message || ''); setFrequency(item?.schedule_type || 'daily'); setTime(item?.local_time?.slice(0,5) || '09:00'); setDate(item ? new Date(Date.parse(item.next_run_at) - 5 * 3600000).toISOString().slice(0,16) : ''); setEnabled(item?.enabled || false); setError(''); };
  return <ReleasePage title="Recordatorios" subtitle="Elige cuándo dedicarle un momento a tu espacio. Horarios de Bogotá." navigate={navigate} back="#/inicio">
    {!canEnable && <Notice>Los envíos necesitan un correo verificado, un proveedor de correo y el programador configurados. Puedes guardar borradores. <button onClick={() => navigate('#/verificar-correo')} className="underline font-semibold">Verificar mi correo</button></Notice>}
    {error && editing === undefined && <Notice error>{error}</Notice>}<Button className="w-full mb-5" onClick={() => open(null)}>Nuevo recordatorio</Button><ResourceState {...result} retry={result.reload}/>
    {!result.loading && !result.error && !result.data?.reminders.length && <p className="surface p-6 text-sm text-text-secondary">Todavía no tienes recordatorios. Empieza con un momento que encaje en tu jornada.</p>}
    <div className="grid gap-4">{result.data?.reminders.map(item => <article className="surface p-5" key={item.id}><p className="eyebrow mb-2">{item.enabled ? 'Activo' : 'Desactivado'} · {item.schedule_type === 'daily' ? 'Diario' : 'Una vez'}</p><h2 className="text-xl font-semibold break-words">{item.title}</h2><p className="text-sm text-text-secondary mt-2">{item.schedule_type === 'daily' ? `${item.local_time?.slice(0,5)} · Bogotá` : new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.next_run_at))}</p><p className="text-sm my-3">{item.message}</p><div className="flex gap-4 flex-wrap text-primary text-sm"><button className="min-h-11" onClick={() => open(item)}>Editar</button><button className="min-h-11" onClick={() => setHistory(item.id)}>Ver envíos</button><button className="min-h-11" disabled={busy || (!item.enabled && !canEnable)} onClick={async () => { setBusy(true); setError(''); try { await api(`/reminders/${item.id}`, { method: 'PATCH', body: JSON.stringify({ enabled: !item.enabled }) }); result.reload(); } catch (err) { setError((err as Error).message); } finally { setBusy(false); } }}>{item.enabled ? 'Desactivar' : 'Activar'}</button></div></article>)}</div>
    {editing !== undefined && <Modal title={editing ? 'Editar recordatorio' : 'Nuevo recordatorio'} onClose={() => setEditing(undefined)} busy={busy}><form className="grid gap-4" onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); try { const body = { title, message, enabled, schedule_type: frequency, ...(frequency === 'daily' ? { local_time: time } : { scheduled_at: new Date(`${date}:00-05:00`).toISOString() }) }; await api(editing ? `/reminders/${editing.id}` : '/reminders', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(body) }); setEditing(undefined); result.reload(); } catch (err) { setError((err as Error).message); } finally { setBusy(false); } }}><Input label="Título" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required/><Input label="Mensaje (opcional)" value={message} onChange={e => setMessage(e.target.value)} maxLength={1000}/><FieldSelect label="Frecuencia" value={frequency} onChange={setFrequency}><option value="daily">Cada día</option><option value="once">Una sola vez</option></FieldSelect>{frequency === 'daily' ? <Input label="Hora en Bogotá" type="time" required value={time} onChange={e => setTime(e.target.value)}/> : <Input label="Fecha y hora en Bogotá" type="datetime-local" required value={date} onChange={e => setDate(e.target.value)}/>}<label className="flex gap-3 items-center text-sm min-h-11"><input type="checkbox" checked={enabled} disabled={!canEnable && !editing?.enabled} onChange={e => setEnabled(e.target.checked)}/>Activar envío por correo</label>{!canEnable && <p className="text-xs text-text-secondary">Guárdalo desactivado hasta configurar los envíos.</p>}{error && <Notice error>{error}</Notice>}<Button loading={busy}>Guardar recordatorio</Button></form></Modal>}
    {history && <Modal title="Historial de envíos" onClose={() => setHistory(undefined)}><ResourceState {...historyResult} retry={historyResult.reload}/>{!historyResult.loading && !historyResult.data?.deliveries?.length && <p className="text-sm">Todavía no hay intentos de envío.</p>}{historyResult.data?.deliveries?.map(item => <div className="border-b border-border-main py-3 text-sm" key={item.scheduled_for}><p>{new Date(item.scheduled_for).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</p><p>{{ sent: 'Aceptado por el proveedor', failed: 'Error de envío', missed: 'Ventana de envío vencida', pending: 'Pendiente' }[item.status as 'sent']} · {item.attempts} intento(s)</p></div>)}</Modal>}
  </ReleasePage>;
}
