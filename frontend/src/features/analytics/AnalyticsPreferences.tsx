import {useState} from 'react';
import {analyticsAllowed,setMeasurementAllowed} from './context';
export function AnalyticsPreferences() {
 const [allowed,setAllowed]=useState(analyticsAllowed);
 const [message,setMessage]=useState('');
 return <section className="surface p-4 my-5 text-sm" aria-label="Medición de uso"><h2 className="font-bold mb-2">Tú decides sobre la medición</h2><p>Medimos visitas de esta pestaña y, al usar tu cuenta, registro, primera activación y regreso en otro día. Nos ayuda a encontrar dificultades. No copiamos tus correos ni el contenido de tus tareas a la analítica.</p><label className="flex items-center gap-3 py-3"><input type="checkbox" checked={allowed} onChange={e=>{try{setMeasurementAllowed(e.target.checked);setAllowed(analyticsAllowed());setMessage('Preferencia guardada en este dispositivo. No cambia los eventos ya registrados.');}catch{setMessage('No pudimos guardar la preferencia. Revisa el almacenamiento del navegador.');}}}/>Permitir medición de uso en este dispositivo</label><p className="text-xs">Respetamos también No rastrear y Global Privacy Control. La sesión de medición dura esta pestaña; la actividad de tu cuenta usa su identificador interno. El panel solo está disponible para el equipo autorizado.</p>{message&&<p role="status" className="mt-2">{message}</p>}</section>;
}
