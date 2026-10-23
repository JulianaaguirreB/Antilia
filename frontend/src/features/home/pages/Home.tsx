import { ActionIcon } from '../../../shared/components/ActionIcon';
import { DeskEntry } from '../../desk/components/DeskEntry';
import { DailyCompass } from '../components/DailyCompass';
import { useState, useEffect, useMemo, useRef } from 'react';
import { api, ApiError } from '../../../shared/api/client';
import { useAuth } from '../../auth/context/AuthContext';
import { isCompletedToday } from '../../../shared/lib/dates';
import { StreakMascot } from '../../progress/components/StreakMascot';
import { Navigation } from '../../../shared/components/Navigation';
import { Icons } from '../../../shared/components/Icons';
import { Button, Input } from '../../../shared/components/ui';
import { TaskSheet } from '../../tasks/components/TaskSheet';
import { validateTitle } from '../../../shared/lib/validation';

export interface Task {
  id: string;
  title: string;
  type: 'fisica' | 'digital';
  status: 'pendiente' | 'en_progreso' | 'completada' | 'archivada';
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
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'hoy' | 'historial'>('hoy');
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
      if (e.key === 'Escape' && isSheetOpen && !creating) {
        setIsSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSheetOpen, creating]);

  const todayTasks = useMemo(() => {
    return tasks.filter(t => ['pendiente', 'en_progreso'].includes(t.status) || isCompletedToday(t.completed_at));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = view === 'historial' ? tasks.filter(t => t.status === 'completada') : todayTasks;
    if (search.trim()) filtered = filtered.filter(t => t.title.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es')));
    if (tab !== 'todas') {
      filtered = filtered.filter(t => t.type === tab);
    }
    return [...filtered].sort((a, b) => {
      if (a.status !== 'completada' && b.status === 'completada') return -1;
      if (a.status === 'completada' && b.status !== 'completada') return 1;
      return 0;
    });
  }, [todayTasks, tasks, tab, search, view]);

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
      <div className="page-content" role="status"><p className="eyebrow mb-5">Antilia</p><div className="skeleton h-10 w-2/3 mb-6"/><div className="skeleton h-44 mb-6"/><div className="skeleton h-20 mb-3"/><div className="skeleton h-20 mb-4"/><p className="text-sm text-text-secondary">{isSlow ? 'Conectando con el servidor… la primera vez puede tardar unos segundos.' : 'Cargando…'}</p></div>
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
      <div className="home-shell max-w-[480px] mx-auto px-5 pt-6">
        <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><img src="/icons/icon-192.png" alt="" className="brand-mark !w-8 !h-8 !text-lg !rounded-xl"/><span className="font-bold text-lg">antilia.</span></div><span className="home-date">{new Intl.DateTimeFormat('es-CO', {weekday:'short',day:'numeric',month:'short',timeZone:'America/Bogota'}).format(new Date())}</span></div>
        <header className="home-welcome mb-6 flex justify-between items-start gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Hola, {firstName}</h1>
            <p className="text-text-secondary text-sm mt-1">¿Qué quieres ordenar hoy?</p>
          </div>
          <button 
            onClick={() => navigate('#/progreso')}
            className="flex items-center gap-1.5 bg-primary-soft text-primary px-3 min-h-[44px] rounded-full text-sm font-medium"
          >
            <StreakMascot streak={streak} compact/>
            Racha: {streak?.current_streak || 0}
          </button>
        </header>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm" role="alert">
            {error}
          </div>
        )}

        <DeskEntry navigate={navigate}/>
        <button className="focus-invitation w-full text-left mb-5" onClick={()=>navigate('#/sesion')}><span className="focus-orbit" aria-hidden="true"><ActionIcon action="Empezar"/></span><span><span className="eyebrow">Un respiro para tu espacio</span><strong className="block text-primary mt-1 text-lg">Cinco minutos de orden</strong><span className="text-xs text-text-secondary">Una tarea pequeña. Un cambio que se siente.</span></span></button>
        <section aria-label="Accesos de organización" className="grid grid-cols-2 gap-3 mb-6">{[['#/espacios','Tus espacios','Todo en su lugar','spaces'],['#/mi-escritorio','Escritorio 3D','Tres mesas para diseñar','desk'],['#/turnos','Tu agenda','Tiempo para lo importante','agenda'],['#/recordatorios','Recordatorios','Acompaña tu rutina','reminder']].map(([path,title,text,kind]) => <button key={path} className="shortcut-card surface p-4 text-left" onClick={() => navigate(path)}><span className="shortcut-icon block"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{kind==='spaces'?<><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>:kind==='desk'?<><path d="M3 14h18M5 14v7m14-7v7M8 4h8v7H8zM12 11v3"/></>:kind==='agenda'?<><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 2v6m10-6v6M3 11h18m-13 4h3m3 0h3"/></>:<><path d="M5 17h14l-2-4V9a5 5 0 0 0-10 0v4zm5 3h4"/><path d="M12 2v2"/></>}</svg></span><span className="font-semibold block text-sm">{title}</span><span className="text-xs text-text-secondary mt-1 block">{text}</span></button>)}</section>
        <div className="hero-card mb-6">
          <p className="eyebrow mb-3">Tu enfoque de hoy</p>
          <div className="flex justify-between items-end mb-3">
            <h2 className="font-semibold text-white">Así va tu día</h2>
            <div className="text-right">
              <span className="text-3xl font-bold text-white">{pct}%</span>
              <span className="text-white/70 text-xs ml-1">Completado</span>
            </div>
          </div>
          <div role="progressbar" aria-label="Progreso de tareas de hoy" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="h-2 bg-white/15 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-[#efd48a] transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm text-white/80">{completedTodayCount} de {totalTodayCount} tareas</p><p className="mt-4 text-xs text-white/65">{totalTodayCount === 0 ? 'Tu primer paso empieza con una tarea.' : pct === 100 ? 'Todo listo por hoy. Disfruta tu espacio.' : 'Cada tarea completada cuenta. Sigue a tu ritmo.'}</p>
        </div>

        <DailyCompass key={user?.id} userId={user?.id || 'local'} completed={completedTodayCount} pending={tasks.filter(t=>['pendiente','en_progreso'].includes(t.status)).length} navigate={navigate}/>
        <div className="flex items-center justify-between mb-3"><h2 className="font-bold text-lg">A mano, cuando lo necesites</h2><span className="eyebrow">Explora</span></div>
        <section className="explore-strip" aria-label="Más herramientas">{[['#/kanban','Tablero'],['#/medir-espacio','Medir espacio'],['#/correos','Correos'],['#/archivos','Archivos'],['#/metricas','Estadísticas']].map(([path,title])=><button key={path} onClick={()=>navigate(path)}><ActionIcon action={path}/>{title}</button>)}</section>
        <div className="flex gap-2 mb-4 rounded-2xl bg-white p-1 border border-border-main/60"><button onClick={() => setView('hoy')} aria-pressed={view === 'hoy'} className={`flex-1 rounded-xl py-3 text-sm font-semibold ${view === 'hoy' ? 'bg-primary-soft text-primary' : 'text-text-secondary'}`}>Hoy</button><button onClick={() => setView('historial')} aria-pressed={view === 'historial'} className={`flex-1 rounded-xl py-3 text-sm font-semibold ${view === 'historial' ? 'bg-primary-soft text-primary' : 'text-text-secondary'}`}>Historial</button></div>
        <div className="mb-4"><Input id="task-search" label="Buscar tus tareas" placeholder="Escribe una palabra del título" value={search} onChange={e => setSearch(e.target.value)} type="search" /></div>
        <div className="flex gap-2 mb-6">
          {(['todas', 'fisica', 'digital'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`px-4 min-h-[44px] rounded-full text-sm font-medium transition-colors capitalize ${
                tab === t ? 'bg-text-main text-white' : 'bg-white text-text-secondary border border-border-main'
              }`}
            >
              {t === 'todas' ? 'Todas' : t === 'fisica' ? 'En mi espacio' : 'Correos y archivos'}
            </button>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-text-main mb-4">{view === 'historial' ? 'Tareas completadas' : 'Un paso a la vez'}</h3>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-[16px] border border-border-main border-dashed">
              <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><Icons.Check /></span><p className="font-semibold mb-2">{search ? 'No encontramos esa tarea' : view === 'historial' ? 'Tu historia empieza aquí' : 'Un espacio para empezar'}</p><p className="text-text-secondary text-sm px-6">{search ? 'Prueba otra palabra o cambia el filtro.' : view === 'historial' ? 'Cuando completes tareas aparecerán en esta lista.' : 'Agrega una tarea física o digital y da tu primer paso.'}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-card flex items-start gap-3 p-4 bg-white rounded-[16px] border ${
                    task.status === 'completada' ? 'border-border-main/50 opacity-60' : 'border-border-main'
                  } transition-all`}
                >
                  <button
                    onClick={() => ['pendiente','en_progreso'].includes(task.status) && handleComplete(task.id)}
                    disabled={task.status === 'completada' || completingIds.has(task.id)}
                    aria-label={`Completar tarea: ${task.title}`}
                    aria-busy={completingIds.has(task.id)}
                    className="relative shrink-0 w-11 h-11 flex items-center justify-center -ml-2 -mt-2"
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      task.status === 'completada' 
                        ? 'bg-success border-success text-white' 
                        : 'border-border-main hover:border-primary'
                    }`}>
                      {completingIds.has(task.id) ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : task.status === 'completada' && <Icons.Check className="w-4 h-4" />}
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
                        : 'bg-[#fff4d7] text-[#8a6827]'
                    }`}>
                      {task.type === 'fisica' ? 'En mi espacio' : 'Correos y archivos'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-[calc(88px+env(safe-area-inset-bottom))] left-0 right-0 px-4 max-w-[480px] mx-auto z-30">
        <Button 
          className="w-full shadow-lg shadow-primary/20"
          onClick={() => { setIsSheetOpen(true); setTimeout(() => titleRef.current?.focus(), 100); }}
        >
          <Icons.Plus className="w-5 h-5 mr-1.5" />
          Nueva tarea
        </Button>
      </div>

      <Navigation currentPath="#/inicio" navigate={navigate} />

      {isSheetOpen && <TaskSheet title={newTaskTitle} type={newTaskType} error={newTaskError} creating={creating} titleRef={titleRef} onTitle={setNewTaskTitle} onType={setNewTaskType} onClose={() => { if (!creating) setIsSheetOpen(false); }} onSubmit={handleCreateTask} />}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-text-main text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
