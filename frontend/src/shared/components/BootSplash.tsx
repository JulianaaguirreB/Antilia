import {useEffect,useRef,useState} from 'react';
import {BroomArtwork} from './OrbitArtwork';
export function introWasSeen(){try{return sessionStorage.getItem('antilia_intro_seen')==='1';}catch{return false;}}
export function BootSplash({ready,onDone}:{ready:boolean;onDone:()=>void}) {
  const [stage,setStage]=useState<'loading'|'flight'|'slogan'>('loading');
  const done=useRef(onDone);done.current=onDone;
  const finish=()=>{try{sessionStorage.setItem('antilia_intro_seen','1');}catch{}done.current();};
  const finishRef=useRef(finish);finishRef.current=finish;
  const skip=useRef<HTMLButtonElement>(null);
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;skip.current?.focus();return()=>previous?.focus();},[]);
  useEffect(()=>{
    if(!ready)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setStage('slogan');const timer=setTimeout(()=>finishRef.current(),350);return()=>clearTimeout(timer);}
    const timers=[setTimeout(()=>setStage('flight'),600),setTimeout(()=>setStage('slogan'),1350),setTimeout(()=>finishRef.current(),2450)];
    return()=>timers.forEach(clearTimeout);
  },[ready]);
  return <section className={`boot-splash boot-${stage}`} role="dialog" aria-modal="true" aria-label="Bienvenida a Antilia" onKeyDown={event=>{if(event.key==='Escape')finishRef.current();if(event.key==='Tab'){event.preventDefault();skip.current?.focus();}}}>
    <div className="boot-stars" aria-hidden="true">✦<span>·</span><b>✧</b><i>·</i></div>
    <div className="boot-planet" aria-hidden="true"/>
    <div className="boot-center"><img className="boot-logo" src="/icons/ios-icon-1024.png" alt="Antilia"/><BroomArtwork className="boot-broom"/>
      <div className="boot-spinner" aria-hidden="true"/>
      <p className="boot-status" role="status">{stage==='loading'?'Preparando tu espacio…':stage==='flight'?'Un poco de orden, un nuevo comienzo.':'the space is yours'}</p>
      <p className="boot-caption">{stage==='slogan'?'Haz espacio para lo que te importa.':'Antilia'}</p>
    </div>
    <button ref={skip} className="boot-skip" onClick={finish}>Saltar bienvenida →</button>
  </section>;
}
