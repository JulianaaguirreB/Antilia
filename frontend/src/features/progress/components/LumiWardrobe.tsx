import { useState } from 'react';
import { useAuth, LumiStyle, User } from '../../auth/context/AuthContext';
import { api } from '../../../shared/api/client';
import { Modal, Notice } from '../../../shared/components/ReleaseLayout';
import { Button } from '../../../shared/components/ui';
import { StreakMascot } from './StreakMascot';
import { LumiClothes, defaultStyle } from './LumiClothes';

type Category = 'outfit'|'hair'|'hat'|'glasses';
const categories: {key:Category;title:string;sample:string;items:[string,string,string][]}[] = [
 {key:'outfit',title:'Ropa',sample:'sweater',items:[['none','Sin ropa','#f2ede7'],['sweater','Suéter rosa','#fae8ed'],['overalls','Overol azul','#e1f0f5'],['cape','Capa cósmica','#eee6fa']]},
 {key:'hair',title:'Peinados',sample:'curls',items:[['none','Sin peluca','#f2ede7'],['curls','Rizos cacao','#f0e5dd'],['pink','Melena rosa','#fae8f1'],['silver','Melena lunar','#e7edf9']]},
 {key:'hat',title:'Sombreros',sample:'beanie',items:[['none','Sin sombrero','#f2ede7'],['beanie','Gorro menta','#e0f3ed'],['party','De fiesta','#fae7f0'],['crown','Corona dorada','#fff1c9']]},
 {key:'glasses',title:'Gafas',sample:'round',items:[['none','Sin gafas','#f2ede7'],['round','Lentes de luna','#eee4f3'],['sun','Día de sol','#e0edf1'],['heart','Mucho amor','#fce2eb']]}
];
function Garment({category,value}:{category:Category;value:string}) {
 if(value==='none')return <svg viewBox="0 0 100 80" aria-hidden="true" className="garment-art garment-empty"><circle cx="50" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 5"/><path d="M37 53 63 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
 const style={...defaultStyle,[category]:value} as LumiStyle;
 const views={outfit:'60 105 120 72',hair:'65 55 112 78',hat:'72 12 96 90',glasses:'77 86 86 46'};
 return <svg viewBox={views[category]} aria-hidden="true" className="garment-art"><LumiClothes style={style} layer="back"/><LumiClothes style={style} layer="front"/></svg>;
}
export function LumiWardrobe(){
 const {user,login}=useAuth();
 const [open,setOpen]=useState(false),[draft,setDraft]=useState<LumiStyle>(defaultStyle),[category,setCategory]=useState<Category>('outfit'),[happy,setHappy]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(false);
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const active=categories.find(c=>c.key===category)!;
 const wearing=categories.filter(c=>(draft[c.key]||'none')!=='none').length;
 async function save(){setBusy(true);setError('');try{const data=await api<{user:User}>('/auth/appearance',{method:'PATCH',body:JSON.stringify({lumi_style:draft})});login(localStorage.getItem('antilia_token')||'',data.user);setOpen(false);setSaved(true);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return <><section className="lumi-wardrobe-invitation"><div><p className="eyebrow">Un toque muy tuyo</p><h2>El vestidor de Lumi</h2><p>Su conjunto favorito lo eliges tú.</p></div><Button variant="secondary" onClick={()=>{setDraft({...defaultStyle,...user?.lumi_style});setCategory('outfit');setHappy(true);setError('');setSaved(false);setOpen(true);}}>Vestir a Lumi</Button></section>{saved&&<Notice>¡Lista para brillar! Lumi ya lleva tu conjunto.</Notice>}
 {open&&<Modal className="lumi-boutique" title="El vestidor de Lumi" busy={busy} onClose={()=>setOpen(false)}>
 <div className="boutique-stage">
   <div className="boutique-stage-heading"><span>HECHO A TU MANERA</span><span className="boutique-piece-count">{wearing?`${wearing} ${wearing===1?'toque especial':'toques especiales'}`:'Lumi, al natural'}</span></div>
   <div className="boutique-spark boutique-spark-one" aria-hidden="true">✧</div><div className="boutique-spark boutique-spark-two" aria-hidden="true">✦</div>
   <div className="lumi-dressing-preview"><StreakMascot compact style={draft} streak={happy?{current_streak:1,best_streak:1,last_active_date:today}:null}/></div>
   <div className="boutique-plinth" aria-hidden="true"/>
   <p className="boutique-whisper" aria-live="polite">{happy?'«Me queda bonito porque lo elegiste tú.»':'«Guardo tu cariño, incluso en mis días azules.»'}</p>
   <div className="wardrobe-moods" aria-label="Vista previa del ánimo"><button aria-pressed={happy} onClick={()=>setHappy(true)}>Encendida</button><button aria-pressed={!happy} onClick={()=>setHappy(false)}>Por encender</button></div>
 </div>
 <div className="boutique-tabs" role="tablist" aria-label="Categorías del vestidor">{categories.map(c=><button key={c.key} role="tab" id={`wardrobe-tab-${c.key}`} aria-controls="wardrobe-items" aria-selected={category===c.key} tabIndex={category===c.key?0:-1} onKeyDown={e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const index=categories.findIndex(c=>c.key===category);const next=e.key==='Home'?0:e.key==='End'?categories.length-1:(index+(e.key==='ArrowRight'?1:-1)+categories.length)%categories.length;setCategory(categories[next].key);document.getElementById('wardrobe-items')?.scrollTo(0,0);document.getElementById(`wardrobe-tab-${categories[next].key}`)?.focus();}} onClick={()=>{setCategory(c.key);document.getElementById('wardrobe-items')?.scrollTo(0,0);}}><Garment category={c.key} value={c.sample}/><span>{c.title}</span>{(draft[c.key]||'none')!=='none'&&<i aria-label="Con una prenda elegida"/>}</button>)}</div>
 <div className="boutique-shelf" id="wardrobe-items" role="tabpanel" aria-labelledby={`wardrobe-tab-${category}`}>
 <div className="boutique-shelf-heading"><h3>{active.title}</h3><span>Toca para probar</span></div>
 <div className="boutique-item-grid">{active.items.map(([value,label,color])=>{const selected=(draft[category]||'none')===value;return <button key={value} className="boutique-item" aria-label={label} aria-pressed={selected} onClick={()=>setDraft({...draft,[category]:value})}><div className="boutique-item-art" style={{background:color}}><Garment category={category} value={value}/>{selected&&<b className="boutique-selected" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 10 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></b>}</div><span>{label}</span></button>})}</div>
 </div>
 <footer className="boutique-footer">{error&&<Notice error>{error}</Notice>}<div><button className="boutique-reset" disabled={busy} onClick={()=>setDraft({...defaultStyle})}>Empezar de nuevo</button><Button loading={busy} onClick={save}>Guardar conjunto</Button></div><p>Su ropa queda contigo. Tu racha sigue igual.</p></footer>
 </Modal>}</>;
}
