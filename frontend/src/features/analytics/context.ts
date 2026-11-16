const key='antilia_measurement_session';
export function analyticsAllowed() {
 try {return navigator.doNotTrack!=='1' && !(navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl && localStorage.getItem('antilia_measurement_disabled')!=='1';} catch{return false;}
}
export function analyticsContext() {
 if(!analyticsAllowed())return null;
 try {
  let session=sessionStorage.getItem(key);
  if(!session){session=crypto.randomUUID();sessionStorage.setItem(key,session);}
  const query=new URLSearchParams(location.search);
  if(query.get('analytics_test')==='1')sessionStorage.setItem('antilia_measurement_test','1');
  const sourceValue=query.get('utm_source')?.toLowerCase();
  if(sourceValue)sessionStorage.setItem('antilia_measurement_source',['whatsapp','instagram','qr'].includes(sourceValue)?sourceValue:'otro');
  const source=sessionStorage.getItem('antilia_measurement_source')||'directo';
  const device=/Android/i.test(navigator.userAgent)?'android':/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)?'iphone':'desktop';
  return {session,source,device,audience:sessionStorage.getItem('antilia_measurement_test')==='1'?'test':'public'};
 }catch{return null;}
}
export function measurementHeaders(headers:Headers) {
 const ctx=analyticsContext();headers.set('X-Antilia-Analytics',ctx?'on':'off');
 if(ctx){headers.set('X-Antilia-Session',ctx.session);headers.set('X-Antilia-Source',ctx.source);headers.set('X-Antilia-Device',ctx.device);headers.set('X-Antilia-Audience',ctx.audience);}
}
export function setMeasurementAllowed(allowed:boolean) {
 localStorage.setItem('antilia_measurement_disabled',allowed?'0':'1');
 if(!allowed)sessionStorage.removeItem(key);
 window.dispatchEvent(new Event('antilia-measurement-change'));
}
