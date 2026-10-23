import { ProfilePhoto } from '../components/ProfilePhoto';
import { ActionIcon } from '../../../shared/components/ActionIcon';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { api, ApiError } from '../../../shared/api/client';
import { formatMemberSince } from '../../../shared/lib/dates';
import { Navigation } from '../../../shared/components/Navigation';
import { Button, Input } from '../../../shared/components/ui';
import { Modal, Notice } from '../../../shared/components/ReleaseLayout';
import { validateEmail, validateName } from '../../../shared/lib/validation';

interface AccountProps {
  navigate: (path: string) => void;
}

export function Account({ navigate }: AccountProps) {
  const { user, logout, login } = useAuth();
  const [analyticsAllowed,setAnalyticsAllowed]=useState(false);
  useEffect(()=>{api<{allowed:boolean}>('/landing/access').then(r=>setAnalyticsAllowed(r.allowed)).catch(()=>{});},[]);
  const [completedTasks, setCompletedTasks] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api<{ tasks: any[] }>('/tasks?status=completada')
      .then(res => setCompletedTasks(res.tasks.length))
      .catch(err => {
        if (err instanceof ApiError) setLoadError(true);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('#/acceso');
  };

  if (!user) return null;

  return (
    <div className="min-h-dvh bg-bg-main pb-24">
      <div className="max-w-[480px] mx-auto px-4 pt-6">
        <header className="cosmic-heading profile-heading mb-6">
          <p className="eyebrow mb-2">Tu espacio personal</p><h1 className="text-2xl font-bold text-text-main">Este es tu espacio</h1><p className="text-text-secondary text-sm mt-2">Lo que has cuidado, lo que has logrado y lo que viene.</p>
        </header>

        <div className="profile-passport bg-white p-6 rounded-[24px] shadow-sm border border-border-main flex flex-col items-center text-center mb-6">
          <ProfilePhoto/>
          <h2 className="text-xl font-bold text-text-main mb-1">{user.name}</h2>
          <p className="text-text-secondary text-sm mb-4">{user.email}</p>
          <p className="text-xs text-text-secondary">
            Miembro desde {formatMemberSince(user.created_at)}
          </p>
        </div>

        <Button variant="secondary" className="w-full mb-4" onClick={() => { setName(user.name); setEmail(user.email); setPassword(''); setError(''); setEditing(true); }}>Editar mis datos</Button>
        <button className="surface p-4 text-left w-full mb-6 text-sm text-primary" onClick={() => navigate('#/verificar-correo')}><ActionIcon action="Correo"/>{user.email_verified_at ? 'Correo verificado ✓' : 'Verificar correo para recordatorios'}</button>
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-border-main flex justify-between items-center mb-8">
          <span className="font-medium text-text-main">Tareas hechas</span>
          <span className="text-xl font-bold text-primary">
            {loadError ? 'No disponible' : completedTasks !== null ? completedTasks : '…'}
          </span>
        </div>

        <div className="surface p-4 grid gap-2 mb-5"><h2 className="font-bold">Configuración</h2><button className="text-primary min-h-11 text-left" onClick={()=>navigate('#/recordatorios')}><ActionIcon action="Recordatorios y alertas"/><span>Recordatorios y alertas</span></button><button className="text-primary min-h-11 text-left" onClick={()=>navigate('#/privacidad')}><ActionIcon action="Privacidad y datos"/><span>Privacidad y datos</span></button></div>
        {analyticsAllowed&&<button className="surface p-4 text-left w-full mb-5 text-sm text-primary" onClick={()=>navigate('#/visitas')}><ActionIcon action="Estadísticas"/>Visitas a la landing</button>}
        <section className="surface p-5 mb-6"><p className="eyebrow mb-3">Cómo funciona tu racha</p><p className="text-sm text-text-secondary leading-relaxed">Completa una tarea cada día para mantenerla. Varias tareas en el mismo día cuentan como un solo día. Tu récord se conserva.</p><p className="mt-4 text-xs text-text-secondary">Tus tareas se guardan en tu cuenta y solo tú puedes consultarlas.</p></section>
        <Button 
          variant="secondary" 
          onClick={() => setConfirmLogout(true)} 
          className="w-full text-error bg-error/10 hover:bg-error/20 active:bg-error/30"
        >
          Cerrar Sesión
        </Button>
      </div>

      {confirmLogout && <div className="fixed inset-0 z-50 bg-[#17132c]/40 backdrop-blur-sm grid place-items-center p-5"><div role="alertdialog" aria-modal="true" aria-labelledby="logout-title" className="surface p-6 max-w-sm w-full"><h2 id="logout-title" className="text-xl font-bold mb-2">¿Cerrar tu sesión?</h2><p className="text-sm text-text-secondary mb-5">Tus tareas seguirán guardadas. Puedes volver cuando quieras.</p><div className="flex gap-3"><Button autoFocus variant="secondary" onClick={() => setConfirmLogout(false)}>Cancelar</Button><Button onClick={handleLogout}>Salir</Button></div></div></div>}
      {editing && <Modal title="Editar mis datos" busy={saving} onClose={() => setEditing(false)}><form className="grid gap-4" onSubmit={async e => { e.preventDefault(); const validation = validateName(name) || validateEmail(email); setError(validation || ''); if (validation) return; setSaving(true); try { const result = await api<{ user: typeof user }>('/auth/me', { method: 'PATCH', body: JSON.stringify({ name, email, ...(email.trim().toLowerCase() !== user.email ? { current_password: password } : {}) }) }); login(localStorage.getItem('antilia_token') || '', result.user); setEditing(false); } catch (err) { setError((err as Error).message); } finally { setSaving(false); } }}><Input label="Nombre completo" value={name} maxLength={80} required onChange={e => setName(e.target.value)}/><Input label="Correo Electrónico" value={email} type="email" required onChange={e => setEmail(e.target.value)}/>{email.trim().toLowerCase() !== user.email && <><Input label="Contraseña actual" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}/><Notice>Al cambiar el correo, los recordatorios se pausarán hasta que verifiques el nuevo.</Notice></>}{error && <Notice error>{error}</Notice>}<Button loading={saving}>Guardar datos</Button></form></Modal>}
      <Navigation currentPath="#/perfil" navigate={navigate} />
    </div>
  );
}
