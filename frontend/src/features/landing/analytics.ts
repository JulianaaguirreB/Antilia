export type LandingEvent='visit'|'try_app'|'download_options'|'download_android'|'iphone_web'|'download_ipa';
export function visitorDevice(): 'desktop'|'android'|'iphone' {
 if(/Android/i.test(navigator.userAgent))return 'android';
 if(/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))return 'iphone';
 return 'desktop';
}
export function trackLanding(event:LandingEvent, device=visitorDevice()) {
 if(navigator.doNotTrack==='1'||(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl)return;
 const sourceValue=new URLSearchParams(location.search).get('utm_source')?.toLowerCase();
 const source=!sourceValue?'directo':['whatsapp','instagram','qr'].includes(sourceValue)?sourceValue:'otro';
 const key=`antilia_landing_${event}_${device}_${source}`;
 // One event per type, source and device in each tab session. StrictMode and reloads do not duplicate it.
 try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1');}catch{}
 void fetch('/api/landing/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,device,source}),keepalive:true,credentials:'omit'}).then(response=>{if(!response.ok)try{sessionStorage.removeItem(key);}catch{}}).catch(()=>{try{sessionStorage.removeItem(key);}catch{}});
}
