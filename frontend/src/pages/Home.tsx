import { useState, useEffect, useMemo, useRef } from 'react';
import { api, ApiError } from '../api';
import { useAuth } from '../auth';
import { isCompletedToday } from '../dates';
import { Navigation } from '../components/Navigation';
import { Icons } from '../components/Icons';
import { Button, Input } from '../components/ui';
import { validateTitle } from '../validation';

export interface Task {
  id: string;
  title: string;
  type: 'fisica' | 'digital';
  status: 'pendiente' | 'completada';
  created_at: string;
  completed_at: string | null;
}

export interface Streak {
  current_streak: number;
  best_streak: number;
  last_active_date: string | null;
}

interface HomeProps {
  navigate: (path: string) => void;
}

export function Home({ navigate }: HomeProps) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());

  const [tab, setTab] = useState<'todas' | 'fisica' | 'digital'>('todas');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<'fisica' | 'digital'>('fisica');
  const [newTaskError, setNewTaskError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const fetchData = () => {
    return Promise.all([
      api<{ tasks: Task[] }>('/tasks?status=all'),
      api<{ streak: Streak }>('/streak')
    ])
      .then(([tasksData, streakData]) => {
        setTasks(tasksData.tasks);
        setStreak(streakData.streak);
      })
      .catch(err => {
        if (err instanceof ApiError) setError(err.message);
        else setError('Error al cargar datos');
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), 4000);
    fetchData().finally(() => {
      clearTimeout(timer);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSheetOpen) {
        setIsSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSheetOpen]);

  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.status === 'pendiente' || isCompletedToday(t.completed_at));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = todayTasks;
    if (tab !== 'todas') {
      filtered = filtered.filter(t => t.type === tab);
    }
    // Pendientes primero, completadas al final (se ordena una copia para no modificar todayTasks)
    return [...filtered].sort((a, b) => {
      if (a.status === 'pendiente' && b.status === 'completada') return -1;
      if (a.status === 'completada' && b.status === 'pendiente') return 1;
      return 0;
    });
  }, [todayTasks, tab]);

  const completedTodayCount = todayTasks.filter(t => t.status === 'completada').length;
  const totalTodayCount = todayTasks.length;
  const pct = totalTodayCount === 0 ? 0 : Math.round((completedTodayCount / totalTodayCount) * 100);

  const firstName = user?.name.split(' ')[0] || '';

  const handleComplete = async (taskId: string) => {
    if (completingIds.has(taskId)) return;
    setCompletingIds(prev => new Set(prev).add(taskId));
    setError(null);
    try {
      const prevStreak = streak?.current_streak || 0;
      const res = await api<{ task: Task; streak: Streak }>(`/tasks/${taskId}/complete`, { method: 'PATCH' });
      
      setTasks(prev => prev.map(t => t.id === taskId ? res.task : t));
      setStreak(res.streak);

      if (res.streak.current_streak > prevStreak) {
        setToast(`¡Racha de ${res.streak.current_streak} día${res.streak.current_streak === 1 ? '' : 's'}!`);
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          fetchData();
        } else {
          setError(err.message);
        }
      }
    } finally {
      setCompletingIds(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewTaskError(null);
    const err = validateTitle(newTaskTitle);
    if (err) {
      setNewTaskError(err);
      titleRef.current?.focus();
      return;
    }
    setCreating(true);
    try {
      const res = await api<{ task: Task }>('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: newTaskTitle.trim(), type: newTaskType }),
      });
      setTasks(prev => [...prev, res.task]);
      setIsSheetOpen(false);
      setNewTaskTitle('');
      setNewTaskType('fisica');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 500) {
          setNewTaskError('No se pudo guardar la tarea. Inténtalo de nuevo.');
        } else {
          setNewTaskError(err.message);
        }
      } else {
        setNewTaskError('Error desconocido al crear la tarea');
      }
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg-main text-text-secondary px-4 text-center">
        {isSlow ? 'Conectando con el servidor… la primera vez puede tardar unos segundos.' : 'Cargando…'}
      </div>
    );
  }

  if (error && !streak) {
    return (
      <div className="flex flex-col min-h-dvh items-center justify-center bg-bg-main px-4">
        <div className="bg-error/10 text-error p-4 rounded-[16px] mb-4 text-center">
          {error}
        </div>
        <Button onClick={() => {
          setLoading(true);
          setError(null);
          setIsSlow(false);
          const timer = setTimeout(() => setIsSlow(true), 4000);
          fetchData().finally(() => {
            clearTimeout(timer);
            setLoading(false);
          });
        }}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg-main pb-[calc(140px+env(safe-area-inset-bottom))]">
      <div className="max-w-[480px] mx-auto px-4 pt-6">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Hola, {firstName}</h1>
            <p className="text-text-secondary text-sm mt-1">Tu mente se ordena con tu entorno</p>
          </div>
          <button 
            onClick={() => navigate('#/progreso')}
            className="flex items-center gap-1.5 bg-primary-soft text-primary px-3 min-h-[44px] rounded-full text-sm font-medium"
          >
            <Icons.TrendingUp className="w-4 h-4" />
            Racha: {streak?.current_streak || 0}
          </button>
        </header>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-border-main mb-6">
          <div className="flex justify-between items-end mb-3">
            <h2 className="font-semibold text-text-main">Progreso del Día</h2>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{pct}%</span>
              <span className="text-text-secondary text-sm ml-1">Completado</span>
            </div>
          </div>
          <div className="h-2 bg-bg-main rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm text-text-secondary">{completedTodayCount} de {totalTodayCount} tareas</p>
        </div>

        <div className="flex gap-2 mb-6">
          {(['todas', 'fisica', 'digital'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 min-h-[44px] rounded-full text-sm font-medium transition-colors capitalize ${
                tab === t ? 'bg-text-main text-white' : 'bg-white text-text-secondary border border-border-main'
              }`}
            >
              {t === 'todas' ? 'Todas' : t === 'fisica' ? 'Físicas' : 'Digitales'}
            </button>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-text-main mb-4">Tareas de Hoy</h3>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-[16px] border border-border-main border-dashed">
              <p className="text-text-secondary">No tienes tareas pendientes.<br/>Agrega una para empezar.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`flex items-start gap-3 p-4 bg-white rounded-[16px] border ${
                    task.status === 'completada' ? 'border-border-main/50 opacity-60' : 'border-border-main'
                  } transition-all`}
                >
                  <button
                    onClick={() => task.status === 'pendiente' && handleComplete(task.id)}
                    disabled={task.status === 'completada' || completingIds.has(task.id)}
                    aria-label={`Completar tarea: ${task.title}`}
                    className="relative shrink-0 w-11 h-11 flex items-center justify-center -ml-2 -mt-2"
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      task.status === 'completada' 
                        ? 'bg-success border-success text-white' 
                        : 'border-border-main hover:border-primary'
                    }`}>
                      {task.status === 'completada' && <Icons.Check className="w-4 h-4" />}
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-text-main font-medium ${
                      task.status === 'completada' ? 'line-through text-text-secondary' : ''
                    }`}>
                      {task.title}
                    </p>
                    <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                      task.type === 'fisica' 
                        ? 'bg-[#f0f9ff] text-[#0284c7]' 
                        : 'bg-[#fdf4ff] text-[#c026d3]'
                    }`}>
                      {task.type === 'fisica' ? 'Físico' : 'Digital'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4 max-w-[480px] mx-auto z-40">
        <Button 
          className="w-full shadow-lg shadow-primary/20"
          onClick={() => { setIsSheetOpen(true); setTimeout(() => titleRef.current?.focus(), 100); }}
        >
          <Icons.Plus className="w-5 h-5 mr-1.5" />
          Nueva tarea
        </Button>
      </div>

      <Navigation currentPath="#/inicio" navigate={navigate} />

      {isSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setIsSheetOpen(false)}>
          <div 
            className="w-full max-w-[480px] bg-white rounded-t-[24px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-text-main mb-4">Nueva Tarea</h3>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <Input
                id="new-task-title"
                ref={titleRef}
                label="Título de la tarea"
                placeholder="Ej. Ordenar el escritorio"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                maxLength={120}
                error={newTaskError}
              />
              <div>
                <label className="text-sm font-medium text-text-main mb-2 block">Tipo de tarea</label>
                <div className="flex gap-3">
                  <label className="flex-1">
                    <input 
                      type="radio" 
                      name="type" 
                      value="fisica" 
                      className="peer sr-only" 
                      checked={newTaskType === 'fisica'}
                      onChange={() => setNewTaskType('fisica')}
                    />
                    <div className="text-center py-2.5 rounded-[12px] border border-border-main text-text-secondary peer-checked:border-primary peer-checked:bg-primary-soft peer-checked:text-primary peer-checked:font-medium transition-colors cursor-pointer">
                      Física
                    </div>
                  </label>
                  <label className="flex-1">
                    <input 
                      type="radio" 
                      name="type" 
                      value="digital" 
                      className="peer sr-only" 
                      checked={newTaskType === 'digital'}
                      onChange={() => setNewTaskType('digital')}
                    />
                    <div className="text-center py-2.5 rounded-[12px] border border-border-main text-text-secondary peer-checked:border-primary peer-checked:bg-primary-soft peer-checked:text-primary peer-checked:font-medium transition-colors cursor-pointer">
                      Digital
                    </div>
                  </label>
                </div>
              </div>
              <Button type="submit" loading={creating} className="mt-2">Guardar Tarea</Button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-text-main text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-bounce" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
