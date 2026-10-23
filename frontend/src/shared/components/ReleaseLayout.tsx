import { OrbitArtwork } from './OrbitArtwork';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { api } from '../api/client';

export type Navigate = (path: string) => void;

export function ReleasePage({ title, subtitle, children, navigate, active = '#/inicio', back }: { title: string; subtitle?: string; children: ReactNode; navigate: Navigate; active?: string; back?: string }) {
  return <div className="min-h-dvh bg-bg-main"><main className="page-content"><header className="page-heading cosmic-heading mb-6"><div className="flex items-center justify-between mb-5"><button aria-label="Ir a inicio" onClick={() => navigate('#/inicio')} className="brand-bar flex items-center gap-2 font-bold"><img src="/icons/icon-192.png" alt="" className="brand-mark !w-8 !h-8 !text-lg"/>antilia.</button>{back && <button className="text-sm text-primary min-h-11" onClick={() => navigate(back)}>← Volver</button>}</div><OrbitArtwork className="masthead-art"/><p className="masthead-motto">the space is yours</p><h1 className="text-3xl font-bold">{title}</h1>{subtitle && <p className="text-sm text-text-secondary mt-2 leading-relaxed">{subtitle}</p>}</header>{children}</main><Navigation currentPath={active} navigate={navigate}/></div>;
}

export function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <p role={error ? 'alert' : 'status'} className={`rounded-2xl p-4 text-sm mb-4 ${error ? 'bg-error/10 text-red-800' : 'bg-primary-soft text-[#21466c]'}`}>{children}</p>;
}

export function Modal({ title, children, onClose, busy = false }: { title: string; children: ReactNode; onClose: () => void; busy?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const busyRef = useRef(busy);
  busyRef.current = busy;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLElement>('input,button,select,textarea')?.focus();
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busyRef.current) closeRef.current();
      if (e.key !== 'Tab') return;
      const elements = ref.current?.querySelectorAll<HTMLElement>('input:not(:disabled),button:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]');
      if (!elements?.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', listener);
    return () => { document.removeEventListener('keydown', listener); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <div className="fixed inset-0 z-50 bg-[#201931]/45 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" onClick={() => !busy && onClose()}><div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-[480px] max-h-[90dvh] overflow-y-auto p-6 pb-[calc(24px+env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}><div className="flex items-start justify-between gap-3 mb-5"><h2 className="text-2xl font-bold">{title}</h2><button aria-label="Cerrar" disabled={busy} onClick={onClose} className="rounded-full h-11 w-11 shrink-0 bg-bg-main text-xl">×</button></div>{children}</div></div>;
}

export function useResource<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    api<T>(path).then(value => { if (active) setData(value); }).catch(err => { if (active) setError(err.message || 'No se pudieron cargar los datos.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [path, revision]);
  return { data, error, loading, reload: () => setRevision(n => n + 1) };
}

export function ResourceState({ loading, error, retry }: { loading: boolean; error: string; retry: () => void }) {
  if (loading) return <p role="status" className="surface p-5 mb-4">Cargando tus datos…</p>;
  if (error) return <div><Notice error>{error}</Notice><button onClick={retry} className="text-primary min-h-11">Volver a intentar</button></div>;
  return null;
}

export function FieldSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: ReactNode }) {
  return <label className="flex flex-col gap-2 text-sm font-medium">{label}<select value={value} onChange={e => onChange(e.target.value)} className="rounded-xl border border-border-main bg-white p-3 min-h-13 text-base">{children}</select></label>;
}
