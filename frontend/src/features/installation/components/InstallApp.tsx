import { AndroidDownload, ANDROID_APK_URL } from './AndroidDownload';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallApp() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)');
    const detect = () => setInstalled(standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const ready = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const done = () => { setInstalled(true); setPrompt(null); setOpen(false); };
    detect();
    standalone.addEventListener('change', detect);
    window.addEventListener('beforeinstallprompt', ready);
    window.addEventListener('appinstalled', done);
    return () => {
      standalone.removeEventListener('change', detect);
      window.removeEventListener('beforeinstallprompt', ready);
      window.removeEventListener('appinstalled', done);
    };
  }, []);
  async function install() {
    if (!prompt) { setOpen(value => !value); return; }
    setBusy(true);
    setMessage('');
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setPrompt(null);
      setMessage(choice.outcome === 'accepted' ? 'Instalación solicitada. Busca Antilia en tus aplicaciones.' : 'Puedes instalarla después desde el menú del navegador.');
    } catch {
      setPrompt(null);
      setOpen(true);
      setMessage('Puedes usar el menú del navegador para instalar Antilia.');
    } finally { setBusy(false); }
  }
  if (Capacitor.isNativePlatform()) return null;
  const android = /Android/i.test(navigator.userAgent);
  if (installed && !android) return null;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return <aside aria-label="Instalar Antilia" className="mx-auto w-full max-w-lg px-6 py-3 bg-bg-main text-text-main">
    {android && <div className="mb-3"><AndroidDownload/></div>}
    {!installed && <button type="button" disabled={busy} onClick={install} aria-expanded={open} aria-controls="install-help" className="w-full rounded-2xl border border-primary/30 px-4 py-3 text-primary font-semibold focus-visible:outline-2 disabled:opacity-60">{busy ? 'Abriendo instalación…' : android ? 'Otras formas de instalar' : prompt ? 'Instalar Antilia en este dispositivo' : 'Cómo instalar Antilia'}</button>}
    {open && <div id="install-help" className="mt-3 rounded-2xl bg-white p-4 text-sm leading-relaxed">
      <p className="font-semibold">Antilia en tu pantalla de inicio</p>
      {!ios && <p className="mt-2">También puedes <a href={ANDROID_APK_URL} download="Antilia-Android.apk" className="text-primary underline font-semibold">descargar la aplicación para Android</a>. Abre el APK y, si Android lo solicita, autoriza a tu navegador a instalar este archivo. El APK no se instala en iPhone.</p>}
      <p className="mt-2">{ios ? 'Abre esta dirección en Safari. Toca Compartir, luego Agregar a pantalla de inicio y confirma Agregar. Si aparece Abrir como app, déjalo activado.' : 'Abre esta dirección en Chrome desde tu celular. En el menú ⋮ elige Instalar aplicación o Agregar a pantalla de inicio y confirma. En el computador busca Instalar en el menú del navegador.'}</p>
      <p className="mt-2">Ábrela desde su ícono. Necesitas internet para consultar y guardar tareas. No necesitas mantener encendido ningún computador.</p>
      <p className="mt-2">Si estás dentro de WhatsApp o Instagram, abre primero el enlace en el navegador del celular. No se instala desde Play Store.</p>
    </div>}
    {message && <p role="status" className="mt-2 text-sm">{message}</p>}
  </aside>;
}
