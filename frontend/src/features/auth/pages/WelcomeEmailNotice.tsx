import { useState } from 'react';
import { api } from '../../../shared/api/client';
export function WelcomeEmailNotice() {
  const [status,setStatus] = useState(() => sessionStorage.getItem('antilia_welcome_email'));
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  if (!status) return null;
  const retry = async () => {
    setBusy(true); setError('');
    try { const result = await api<{welcome_email:string}>('/auth/welcome-email',{method:'POST',body:'{}'}); setStatus(result.welcome_email); sessionStorage.setItem('antilia_welcome_email',result.welcome_email); }
    catch (err) { setError(err instanceof Error ? err.message : 'No pudimos enviar el correo.'); }
    finally { setBusy(false); }
  };
  return <section className="surface p-4 mb-5" aria-label="Correo de bienvenida"><p role="status">{status === 'sent' ? 'Tu cuenta está lista. Enviamos una bienvenida a tu correo; revisa también Spam.' : 'Tu cuenta está lista. No pudimos enviar la bienvenida, pero ya puedes usar Antilia.'}</p>{error && <p role="alert" className="text-red-800 mt-2">{error}</p>}<div className="flex gap-4 mt-2">{status !== 'sent' && <button disabled={busy} onClick={retry} className="min-h-11 font-bold">{busy ? 'Enviando…' : 'Reintentar correo'}</button>}<button className="min-h-11" onClick={()=>{sessionStorage.removeItem('antilia_welcome_email');setStatus(null);}}>Entendido</button></div></section>;
}
