import { useEffect, useId, useState } from 'react';
import type { Streak } from '../../home/pages/Home';

export function streakAppearance(streak:Streak|null,now=new Date()) {
  const date=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'});
  const today=date.format(now);
  const yesterday=date.format(new Date(new Date(`${today}T12:00:00-05:00`).getTime()-86400000));
  const last=streak?.last_active_date?.slice(0,10);
  const days=last&&(last===today||last===yesterday)?streak?.current_streak||0:0;
  const lit=days>0&&last===today;
  return {days,lit,state:lit?(days>=7?'radiant':'lit'):days>0?'waiting':'sleeping',label:lit?'Tu constelación está encendida hoy':days>0?'Completa una tarea hoy para mantener tu constelación':'Tu constelación espera su primera tarea'};
}

export function StreakMascot({streak,compact=false}:{streak:Streak|null;compact?:boolean}) {
  const id=useId().replace(/:/g,'');
  const [now,setNow]=useState(()=>new Date());
  useEffect(()=>{const update=()=>setNow(new Date());const timer=setInterval(update,60000);window.addEventListener('focus',update);return()=>{clearInterval(timer);window.removeEventListener('focus',update);};},[]);
  const appearance=streakAppearance(streak,now);
  return <div className={`streak-companion ${compact?'is-compact':''} constellation-${appearance.state}`} data-streak-state={appearance.state}>
    <svg viewBox="0 0 240 200" role="img" aria-label={`Lumi. ${appearance.label}`} className="constellation-mascot">
      <defs><radialGradient id={`${id}halo`}><stop stopColor="currentColor" stopOpacity=".2"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient><linearGradient id={`${id}star`} x2=".7" y2="1"><stop stopColor="var(--star-light)"/><stop offset="1" stopColor="var(--star-dark)"/></linearGradient></defs>
      <circle className="star-halo" cx="120" cy="100" r="95" fill={`url(#${id}halo)`}/>
      <path d="M25 63 L65 35 L120 40 L177 29 L209 75 L195 151 L153 174" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.7" strokeDasharray="4 5"/>
      {[[25,63],[65,35],[177,29],[209,75],[195,151],[153,174]].map(([x,y],i)=><g className="constellation-spark" key={i} style={{animationDelay:`${i*.35}s`}}><circle cx={x} cy={y} r={i%2?4:3} fill="currentColor"/><path d={`M${x-7} ${y}h14 M${x} ${y-7}v14`} stroke="currentColor" strokeWidth="1" opacity=".5"/></g>)}
      <ellipse cx="120" cy="174" rx="38" ry="5" fill="currentColor" opacity=".09"/>
      <g className="star-body">{appearance.lit&&<g className="lumi-arms" fill="none" stroke="var(--star-light)" strokeWidth="6" strokeLinecap="round"><path d="M80 120 Q57 119 52 103 M160 120 Q183 119 188 103"/></g>}<path d="M120 46 Q124 46 128 57 L142 82 L173 87 Q185 89 176 99 L155 121 L159 153 Q160 164 149 159 L120 145 L91 159 Q80 164 81 153 L85 121 L64 99 Q55 89 67 87 L98 82 L112 57 Q116 46 120 46Z" fill={`url(#${id}star)`} stroke="var(--star-outline)" strokeWidth="2.5"/>
      <path d="M104 72 L111 59" stroke="white" strokeWidth="4" strokeLinecap="round" opacity=".7"/>
      {!appearance.lit&&<g stroke="#162444" strokeWidth="2.5" strokeLinecap="round"><path d="M99 98 L110 95 M130 95 L141 98"/></g>}
      <g className="star-eyes"><ellipse cx="105" cy="108" rx="4" ry="6" fill="#162444"/><ellipse cx="135" cy="108" rx="4" ry="6" fill="#162444"/></g>
      <path d={!appearance.lit?'M113 124 Q120 120 127 124':'M111 121 Q120 133 129 121'} fill="none" stroke="#162444" strokeWidth="2.8" strokeLinecap="round"/>
      <ellipse cx="94" cy="120" rx="7" ry="3" fill="#ff8299" opacity=".5"/><ellipse cx="146" cy="120" rx="7" ry="3" fill="#ff8299" opacity=".5"/>
      </g>
    </svg>
    {!compact&&<><p className="eyebrow mb-2">Lumi · Tu constelación</p><span className="lumi-status">{appearance.lit?"✦ Encendida hoy":"☾ Por encender hoy"}</span><p className="text-4xl font-bold text-text-main">{appearance.days} <span className="text-lg font-medium">{appearance.days===1?'día':'días'}</span></p><div className="lumi-message"><p className="lumi-voice">{appearance.lit?(appearance.days>=7?"¡Una semana brillando juntos!":"¡Mira cómo brillo contigo!"):"¿Me ayudas a encender mi luz?"}</p><p className="text-sm mt-2">{appearance.lit?"Hoy completaste una tarea. Este baile es para ti.":appearance.days>0?"Tu racha sigue viva. Completa una tarea hoy y volvemos a bailar.":"Completa tu primera tarea de hoy y me pondré dorada de alegría."}</p></div></>}
  </div>;
}
