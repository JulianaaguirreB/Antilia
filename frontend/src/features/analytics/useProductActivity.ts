import {useEffect} from 'react';
import {api} from '../../shared/api/client';
import {analyticsAllowed} from './context';
export function useProductActivity(userId:string|undefined,route:string) {
 useEffect(()=>{
  if(!userId||['#/','#/landing','#/acceso','#/registro','#/recuperar','#/bienvenida'].includes(route))return;
  let disposed=false,pending=false,lastAttempt=0;
  const send=()=>{
   if(disposed||pending||document.hidden||!analyticsAllowed()||Date.now()-lastAttempt<15000)return;
   pending=true;lastAttempt=Date.now();
   void api('/analytics/activity',{method:'POST',body:'{}'}).catch(()=>{}).finally(()=>{pending=false;});
  };
  send();const timer=setInterval(send,60000);
  document.addEventListener('visibilitychange',send);window.addEventListener('focus',send);window.addEventListener('antilia-measurement-change',send);
  return()=>{disposed=true;clearInterval(timer);document.removeEventListener('visibilitychange',send);window.removeEventListener('focus',send);window.removeEventListener('antilia-measurement-change',send);};
 },[userId,route]);
}
