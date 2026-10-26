import { App } from '@capacitor/app';
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

// Each page owns an index so Android never returns to a previous login session.
let routeIndex = 0;
let currentRoute = window.location.hash;
function announceRoute() { window.dispatchEvent(new HashChangeEvent('hashchange')); }
export function replaceRoute(path: string) {
  routeIndex = 0;
  currentRoute = path;
  window.history.replaceState({ ...window.history.state, antiliaIndex: 0 }, '', path);
  announceRoute();
}
export function goBack(fallback = '#/inicio') {
  if (routeIndex > 0) window.history.back();
  else if (window.location.hash !== fallback) replaceRoute(fallback);
}
export function handleAndroidBack(exit: () => void) {
  const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[aria-modal="true"]'));
  const dialog = dialogs[dialogs.length - 1];
  if (dialog) {
    dialog.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true}));
    return;
  }
  if (routeIndex > 0) { window.history.back(); return; }
  const route = window.location.hash.split('?')[0];
  if (['#/registro','#/recuperar','#/bienvenida'].includes(route)) { replaceRoute('#/acceso'); return; }
  if (route && !['#/inicio','#/acceso','#/'].includes(route)) { replaceRoute('#/inicio'); return; }
  if (window.confirm('¿Quieres salir de Antilia? Tus cambios guardados seguirán aquí.')) exit();
}
let backSubscribers = 0;
let backSubscription: Promise<{remove: () => Promise<void>}> | null = null;
function subscribeAndroidBack() {
  backSubscribers++;
  if (!backSubscription) backSubscription = App.addListener('backButton', () => handleAndroidBack(() => { void App.exitApp(); }));
  return () => {
    backSubscribers--;
    if (backSubscribers === 0) {
      const subscription = backSubscription;
      backSubscription = null;
      void subscription?.then(listener => listener.remove());
    }
  };
}
export function useHashRoute() {
  const defaultRoute = () => window.location.hash || (Capacitor.isNativePlatform()?'#/inicio':'#/');
  const [hash, setHash] = useState(defaultRoute);
  useEffect(() => {
    const onHashChange = () => {
      const path = window.location.hash;
      if (path !== currentRoute) {
        const index = window.history.state?.antiliaIndex;
        routeIndex = typeof index === 'number' ? index : routeIndex + 1;
        currentRoute = path;
        window.history.replaceState({...window.history.state, antiliaIndex:routeIndex}, '', window.location.href);
      }
      setHash(defaultRoute());
      window.scrollTo(0,0);
    };
    window.history.replaceState({...window.history.state, antiliaIndex:routeIndex}, '', window.location.href);
    window.addEventListener('hashchange', onHashChange);
    const removeBack = Capacitor.getPlatform() === 'android' ? subscribeAndroidBack() : undefined;
    return () => { window.removeEventListener('hashchange', onHashChange); removeBack?.(); };
  }, []);
  const navigate = (path: string) => { if (window.location.hash !== path) window.location.hash = path; };
  return { hash, navigate };
}
