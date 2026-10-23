import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';

const returnPaths=new Set(['#/inicio','#/mi-escritorio','#/medir-espacio','#/espacios','#/escritorio','#/progreso','#/digital','#/sesion','#/metricas','#/estado','#/perfil','#/turnos','#/recordatorios','#/correos','#/archivos','#/kanban','#/archivadas','#/privacidad']);
function allowedReturn(path:string) { return returnPaths.has(path)||/^#\/espacio\/[0-9a-f-]{36}$/i.test(path); }
export function rememberLoginDestination(path:string) {
  try{if(allowedReturn(path))sessionStorage.setItem('antilia_login_destination',path);}catch{}
}
export function loginDestination() {
  try{const path=sessionStorage.getItem('antilia_login_destination')||'';return allowedReturn(path)?path:'#/inicio';}catch{return '#/inicio';}
}
export function clearLoginDestination() {
  try{sessionStorage.removeItem('antilia_login_destination');}catch{}
}

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || (Capacitor.isNativePlatform()?'#/inicio':'#/'));

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash || (Capacitor.isNativePlatform()?'#/inicio':'#/'));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return { hash, navigate };
}
