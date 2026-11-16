import { useEffect, useRef } from 'react';
import type { RefObject, FormEvent } from 'react';
import { Button, Input } from '../../../shared/components/ui';

interface Props {
  title: string; type: 'fisica' | 'digital'; error: string | null; creating: boolean;
  titleRef: RefObject<HTMLInputElement | null>;
  onTitle: (v: string) => void; onType: (v: 'fisica' | 'digital') => void;
  onClose: () => void; onSubmit: (e: FormEvent) => void;
}
export function TaskSheet(props: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    props.titleRef.current?.focus();
    const keydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (!props.creating) props.onClose(); return; }
      if (e.key !== 'Tab') return;
      const controls = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled)');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, [props.creating, props.onClose]);
  return <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#17132c]/40 backdrop-blur-sm px-0 sm:px-4" onClick={() => { if (!props.creating) props.onClose(); }}>
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="task-sheet-title" className="w-full max-w-[480px] max-h-[90dvh] overflow-y-auto bg-white rounded-t-[28px] sm:rounded-[28px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-start mb-5"><div><p className="eyebrow mb-2">Un paso a la vez</p><h2 id="task-sheet-title" className="text-2xl font-bold">Nueva Tarea</h2></div><button type="button" onClick={props.onClose} disabled={props.creating} aria-label="Cerrar formulario" className="h-11 w-11 rounded-full bg-bg-main text-xl">×</button></div>
      <form onSubmit={props.onSubmit} noValidate className="flex flex-col gap-5">
        <Input id="new-task-title" ref={props.titleRef} label="Título de la tarea" placeholder="Ej. Ordenar el escritorio" value={props.title} onChange={e => props.onTitle(e.target.value)} maxLength={120} error={props.error} disabled={props.creating} />
        <p className="text-xs text-text-secondary -mt-3 text-right">{props.title.length}/120</p>
        <fieldset><legend className="text-sm font-medium mb-3">Tipo de tarea</legend><div className="grid grid-cols-2 gap-3">{(['fisica','digital'] as const).map(type => <label key={type} className="cursor-pointer"><input type="radio" name="type" value={type} className="peer sr-only" checked={props.type === type} onChange={() => props.onType(type)} disabled={props.creating} /><div className="rounded-2xl border border-border-main p-4 peer-checked:border-primary peer-checked:bg-primary-soft peer-focus-visible:ring-2 peer-focus-visible:ring-primary"><strong className="block text-sm">{type === 'fisica' ? 'Física' : 'Correos y archivos'}</strong><span className="text-xs text-text-secondary">{type === 'fisica' ? 'Escritorio, archivos, objetos' : 'Carpetas, correos, documentos'}</span></div></label>)}</div></fieldset>
        <Button type="submit" loading={props.creating}>Guardar Tarea</Button>
      </form>
    </div>
  </div>;
}
