import { useState, useEffect } from 'react';
import { api, ApiError } from '../api';
import { Navigation } from '../components/Navigation';
import { Task, Streak } from './Home';

interface ProgressProps {
  navigate: (path: string) => void;
}

export function Progress({ navigate }: ProgressProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api<{ tasks: Task[] }>('/tasks?status=completada'),
      api<{ streak: Streak }>('/streak')
    ])
      .then(([tasksData, streakData]) => {
        setTasks(tasksData.tasks);
        setStreak(streakData.streak);
      })
      .catch(err => {
        if (err instanceof ApiError) setError(err.message);
        else setError('Error al cargar datos');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg-main text-text-secondary">
        Cargando…
      </div>
    );
  }

  const current = streak?.current_streak || 0;
  const best = streak?.best_streak || 0;
  
  const physicalCount = tasks.filter(t => t.type === 'fisica').length;
  const digitalCount = tasks.filter(t => t.type === 'digital').length;

  return (
    <div className="min-h-dvh bg-bg-main pb-24">
      <div className="max-w-[480px] mx-auto px-4 pt-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-text-main">Mi Racha</h1>
          <p className="text-text-secondary text-sm mt-1">Tu constancia rinde frutos</p>
        </header>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-border-main text-center mb-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-[8px] border-primary-soft flex items-center justify-center mb-6">
            <div className="text-center">
              <span className="block text-4xl font-bold text-primary leading-none mb-1">
                {current}
              </span>
              <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                {current === 1 ? 'Día' : 'Días'}
              </span>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold text-text-main mb-2">
            Racha más alta: {best} {best === 1 ? 'día' : 'días'}
          </h2>
          
          <p className="text-sm text-text-secondary max-w-[240px] mx-auto">
            {current === 0 
              ? 'Completa una tarea hoy para empezar tu racha.'
              : current === best && best > 0
                ? '¡Racha más alta! Sigue manteniendo tu entorno despejado.'
                : 'Mantén el buen ritmo completando tareas.'}
          </p>
        </div>

        <h3 className="font-semibold text-text-main mb-4">Total Completadas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-[16px] border border-border-main flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-[#0284c7] mb-1">{physicalCount}</span>
            <span className="text-sm text-text-secondary">Tareas Físicas</span>
          </div>
          <div className="bg-white p-4 rounded-[16px] border border-border-main flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-[#c026d3] mb-1">{digitalCount}</span>
            <span className="text-sm text-text-secondary">Tareas Digitales</span>
          </div>
        </div>
      </div>

      <Navigation currentPath="#/progreso" navigate={navigate} />
    </div>
  );
}
