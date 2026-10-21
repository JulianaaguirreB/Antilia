import { useState, useEffect } from 'react';
import { api, ApiError } from '../api';
import { StreakMascot } from '../components/StreakMascot';
import { Navigation } from '../components/Navigation';
import { Task, Streak } from './Home';
import { weekActivity } from '../dates';

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

  if (error) return <div className="page-content"><h1 className="text-2xl font-bold mb-4">Mi Racha</h1><p role="alert" className="surface p-5 text-error">{error}</p><button className="mt-4 text-primary" onClick={() => window.location.reload()}>Reintentar</button><Navigation currentPath="#/progreso" navigate={navigate} /></div>;
  const week = weekActivity(tasks);
  const current = streak?.current_streak || 0;
  const best = streak?.best_streak || 0;
  
  const physicalCount = tasks.filter(t => t.type === 'fisica').length;
  const digitalCount = tasks.filter(t => t.type === 'digital').length;

  return (
    <div className="min-h-dvh bg-bg-main pb-24">
      <div className="max-w-[480px] mx-auto px-4 pt-6">
        <div className="grid grid-cols-2 gap-3 mb-5"><button className="surface p-4 text-primary font-semibold text-sm" onClick={()=>navigate('#/metricas')}>Métricas y logros →</button><button className="surface p-4 text-primary font-semibold text-sm" onClick={()=>navigate('#/estado')}>Estado general →</button></div>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-text-main">Mi Racha</h1>
          <p className="text-text-secondary text-sm mt-1">Tu constancia, vista con claridad</p>
        </header>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="surface p-8 text-center mb-6 flex flex-col items-center">
          <StreakMascot streak={streak}/>
          
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

        <section className="surface p-5 mb-6" aria-label="Actividad de los últimos siete días"><p className="eyebrow mb-2">Tu semana</p><h2 className="font-semibold mb-5">Últimos 7 días</h2><div className="grid grid-cols-7 gap-2">{week.map(day => <div key={day.key} className="text-center"><div className="h-24 flex items-end justify-center pb-2"><div className={`w-full max-w-8 rounded-lg ${day.count ? 'bg-primary' : 'bg-primary-soft'}`} style={{ height: `${day.count ? Math.max(12, day.count / Math.max(1,...week.map(d => d.count)) * 80) : 6}px` }} aria-label={`${day.date}: ${day.count} tareas`} /></div><span className="block text-xs text-text-secondary">{day.label}</span><strong className="text-xs">{day.count}</strong></div>)}</div><p className="text-xs text-text-secondary mt-4">Tareas completadas por día, hora de Bogotá.</p></section>
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
