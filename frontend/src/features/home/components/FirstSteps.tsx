import { useState } from 'react';
import { Button } from '../../../shared/components/ui';

const guideKey = (userId: string) => `antilia_start_guide_hidden_${userId}`;

export function reopenStartGuide(userId: string) {
  try { localStorage.removeItem(guideKey(userId)); } catch { /* almacenamiento no disponible */ }
}

export function StartGuide({ userId, onCreate }: { userId: string; onCreate: () => void }) {
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(guideKey(userId)) === '1'; } catch { return false; }
  });
  if (hidden) return null;
  const close = () => {
    setHidden(true);
    try { localStorage.setItem(guideKey(userId), '1'); } catch { /* almacenamiento no disponible */ }
  };
  return (
    <section className="surface p-5 mb-6" aria-labelledby="start-guide-title">
      <p className="eyebrow mb-2">Guía de inicio</p>
      <h2 id="start-guide-title" className="font-bold text-lg mb-3">Antilia en tres pasos</h2>
      <ol className="grid gap-3 text-sm text-text-secondary leading-relaxed list-decimal pl-5">
        <li><strong className="text-text-main">Anota algo que quieras ordenar hoy</strong> con el botón «Nueva tarea». Elige si es de tu espacio o de tus correos y archivos.</li>
        <li><strong className="text-text-main">Márcala como hecha</strong> tocando el círculo junto a la tarea cuando la termines.</li>
        <li><strong className="text-text-main">Mira tu racha en Progreso.</strong> Una tarea completada al día la mantiene encendida.</li>
      </ol>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button onClick={onCreate}>Crear tarea</Button>
        <Button variant="secondary" onClick={close}>Entendido</Button>
      </div>
      <p className="text-xs text-text-secondary mt-3">Puedes volver a abrir esta guía desde Perfil.</p>
    </section>
  );
}

export function FirstTaskCard({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="hero-card mb-6" aria-labelledby="first-task-title">
      <p className="eyebrow mb-3">Empieza aquí</p>
      <h2 id="first-task-title" className="font-semibold text-white text-xl mb-2">Tu primer paso</h2>
      <p className="text-sm text-white/80 mb-4">Escribe una sola cosa que quieras ordenar hoy. Cuando tengas tu primera tarea, aquí aparecerán tus espacios, tu escritorio 3D y las demás herramientas.</p>
      <Button className="w-full" variant="secondary" onClick={onCreate}>Crear mi primera tarea</Button>
    </section>
  );
}
