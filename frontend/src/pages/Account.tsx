import { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { api, ApiError } from '../api';
import { formatMemberSince } from '../dates';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui';

interface AccountProps {
  navigate: (path: string) => void;
}

export function Account({ navigate }: AccountProps) {
  const { user, logout } = useAuth();
  const [completedTasks, setCompletedTasks] = useState<number | null>(null);

  useEffect(() => {
    api<{ tasks: any[] }>('/tasks?status=completada')
      .then(res => setCompletedTasks(res.tasks.length))
      .catch(err => {
        if (err instanceof ApiError) console.error(err);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('#/acceso');
  };

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-dvh bg-bg-main pb-24">
      <div className="max-w-[480px] mx-auto px-4 pt-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-text-main">Mi Cuenta</h1>
        </header>

        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-border-main flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-primary-soft text-primary rounded-full flex items-center justify-center text-2xl font-bold mb-4">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-text-main mb-1">{user.name}</h2>
          <p className="text-text-secondary text-sm mb-4">{user.email}</p>
          <p className="text-xs text-text-secondary capitalize">
            Miembro desde {formatMemberSince(user.created_at)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-border-main flex justify-between items-center mb-8">
          <span className="font-medium text-text-main">Tareas hechas</span>
          <span className="text-xl font-bold text-primary">
            {completedTasks !== null ? completedTasks : '…'}
          </span>
        </div>

        <Button 
          variant="secondary" 
          onClick={handleLogout} 
          className="w-full text-error bg-error/10 hover:bg-error/20 active:bg-error/30"
        >
          Cerrar Sesión
        </Button>
      </div>

      <Navigation currentPath="#/perfil" navigate={navigate} />
    </div>
  );
}
