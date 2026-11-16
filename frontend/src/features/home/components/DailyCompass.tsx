import { ActionIcon } from '../../../shared/components/ActionIcon';
import { useState } from 'react';
import type { Navigate } from '../../../shared/components/ReleaseLayout';

export function DailyCompass({ userId, completed, pending, navigate }: { userId: string; completed: number; pending: number; navigate: Navigate }) {
  const key = `antilia_daily_goal_${userId}`;
  const [goal, setGoal] = useState(() => {
    try { const stored = Number(localStorage.getItem(key)); return [1, 3, 5, 8].includes(stored) ? stored : 3; } catch { return 3; }
  });
  const [expanded, setExpanded] = useState(false);
  const reached = completed >= goal;
  return <section className="daily-compass" aria-label="Tu meta diaria">
    <div className="daily-compass-header"><div><p className="eyebrow mb-1">A tu ritmo</p><h2 className="font-bold text-lg">{reached ? 'Una meta que brilla' : 'Tu pequeña meta de hoy'}</h2></div><label className="shrink-0"><span className="sr-only">Meta diaria de tareas</span><select className="goal-select" value={goal} onChange={e => { const value = Number(e.target.value); setGoal(value); try { localStorage.setItem(key, String(value)); } catch {} }}>{[1, 3, 5, 8].map(n => <option value={n} key={n}>{n} {n === 1 ? 'tarea' : 'tareas'}</option>)}</select></label></div>
    <div className="goal-dots" aria-hidden="true">{Array.from({ length: goal }, (_, i) => <span key={i} className={`goal-dot ${i < completed ? 'is-done' : ''}`}/>)}</div>
    <p className="text-xs text-text-secondary mt-3 leading-relaxed" role="status">{completed} de {goal} completadas hoy. {reached ? 'Disfruta lo que has logrado.' : pending ? 'Un paso pequeño también cuenta.' : 'Crea una tarea para dar el primer paso.'}</p>
    <button className="text-primary text-xs font-semibold min-h-11 mt-1" aria-expanded={expanded} aria-controls="daily-guide" onClick={() => setExpanded(!expanded)}>{expanded ? 'Cerrar tu guía −' : '¿Por dónde empiezo? +'}</button>
    {expanded && <div id="daily-guide" className="border-t border-border-main pt-3"><p className="text-sm font-semibold">Hazlo simple, hazlo tuyo.</p><ol className="text-xs text-text-secondary leading-relaxed grid gap-2 mt-3 list-decimal pl-4"><li>Elige una sola superficie o un pendiente concreto.</li><li>Dedica cinco minutos sin intentar resolverlo todo.</li><li>Completa tu tarea y mira cómo crece tu constelación.</li></ol><button onClick={() => navigate('#/sesion')} className="text-primary font-semibold text-sm min-h-11 mt-2"><ActionIcon action="Empezar una sesión"/><span>Empezar una sesión</span></button></div>}
    <p className="text-[10px] text-text-secondary mt-1">Tu meta se guarda en este dispositivo y no cambia las reglas de la racha.</p>
  </section>;
}
