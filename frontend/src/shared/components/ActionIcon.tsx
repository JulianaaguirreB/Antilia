export function actionKind(action:string) {
  const value=action.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(/cancelar|cerrar/.test(value))return 'close';
  if(/completar|hecho|confirmar/.test(value))return 'check';
  if(/continuar|en curso/.test(value))return 'play';
  if(/camara|foto|camera/.test(value))return 'camera';
  if(/^guardar/.test(value))return 'save';
  if(/guard|archiv|carpeta/.test(value))return 'archive';
  if(/correo|gmail|verificar/.test(value))return 'mail';
  if(/turno|agenda|calend/.test(value))return 'calendar';
  if(/recordatorio|alerta/.test(value))return 'bell';
  if(/medir|camara|foto|camera/.test(value))return 'measure';
  if(/escritorio|mesa/.test(value))return 'desk';
  if(/espacio/.test(value))return 'spaces';
  if(/tablero|pendiente|tarea/.test(value))return 'tasks';
  if(/metrica|estad|estado|logro/.test(value))return 'chart';
  if(/racha|lumi|progreso/.test(value))return 'star';
  if(/privacidad|seguridad/.test(value))return 'shield';
  if(/perfil|cuenta/.test(value))return 'person';
  if(/editar/.test(value))return 'edit';
  if(/sesion|empezar|saltar|bienvenida/.test(value))return 'play';
  if(/volver|inicio/.test(value))return 'home';
  if(/leer|anterior|siguiente/.test(value))return 'book';
  return 'link';
}
export function ActionIcon({action,className=''}:{action:string;className?:string}) {
  const kind=actionKind(action);
  return <svg viewBox="0 0 24 24" className={`action-icon ${className}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind==='close'?<path d="m6 6 12 12M6 18 18 6"/>:kind==='check'?<path d="m4 12 5 5L20 6"/>:kind==='camera'?<><path d="M3 7h4l2-3h6l2 3h4v14H3z"/><circle cx="12" cy="13" r="4"/></>:kind==='save'?<><path d="M4 3h13l3 3v15H4zM7 3v6h9V3M8 21v-7h8v7"/></>:kind==='archive'?<><path d="M3 7h18v13H3zM2 3h20v4H2zM9 11h6"/></>:kind==='mail'?<><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></>:kind==='calendar'?<><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18M7 14h3m4 0h3m-10 3h3"/></>:kind==='bell'?<><path d="M5 17h14l-2-4V9a5 5 0 0 0-10 0v4zm5 4h4"/><path d="M12 2v2"/></>:kind==='measure'?<><rect x="3" y="7" width="18" height="10" rx="2" transform="rotate(-25 12 12)"/><path d="m7 10 1 3m3-5 1 3m3-5 1 3"/></>:kind==='desk'?<><path d="M3 13h18M5 13v8m14-8v8M7 4h10v6H7zM12 10v3"/></>:kind==='spaces'?<><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>:kind==='tasks'?<><rect x="4" y="3" width="16" height="18" rx="3"/><path d="m7 9 1 1 2-2m3 1h4m-10 6h3m3 0h4"/></>:kind==='chart'?<><path d="M5 20V12m7 8V4m7 16V8"/><circle cx="5" cy="9" r="1"/></>:kind==='star'?<><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/></>:kind==='shield'?<><path d="m12 3 8 3v6q0 6-8 10Q4 18 4 12V6z"/><path d="m8 12 3 3 5-6"/></>:kind==='person'?<><circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 5 0 0 1 16 0v3"/></>:kind==='edit'?<><path d="m5 15 10-10 4 4L9 19l-5 1zM14 6l4 4"/></>:kind==='play'?<><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z" fill="currentColor" stroke="none"/></>:kind==='home'?<><path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/></>:kind==='book'?<><path d="M12 5Q6 2 3 5v15q5-3 9 0 5-3 9 0V5q-4-3-9 0v15"/></>:<><path d="m10 14 4-4M8 15l-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0m2 1 1-1a3 3 0 0 1 4 4l-4 4a3 3 0 0 1-4 0"/></>}
  </svg>;
}
