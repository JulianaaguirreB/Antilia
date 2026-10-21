import { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button, Input } from '../../../shared/components/ui';
import { Notice } from '../../../shared/components/ReleaseLayout';

type Point = {x:number;y:number};
export function calibratedWidth(points:Point[],reference:number) {
  if(points.length!==4 || !Number.isFinite(reference) || reference<=0 || reference>1000) return null;
  const length=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
  const known=length(points[0],points[1]);
  const target=length(points[2],points[3]);
  if(known<10 || target<10) return null;
  const cm=reference*target/known;
  return Number.isFinite(cm)&&cm<=10000 ? Math.round(cm*10)/10 : null;
}

export function CameraMeasure({onUse}:{onUse:(cm:number)=>void}) {
  const [photo,setPhoto]=useState('');
  const [size,setSize]=useState({width:1000,height:1000});
  const [points,setPoints]=useState<Point[]>([]);
  const [reference,setReference]=useState('20');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [accepted,setAccepted]=useState(false);
  const file=useRef<HTMLInputElement>(null);
  const blob=useRef('');
  useEffect(()=>()=>{if(blob.current)URL.revokeObjectURL(blob.current);},[]);
  const setImage=(url:string)=>{setPhoto(url);setPoints([]);setAccepted(false);setError('');};
  async function capture(){
    if(!Capacitor.isNativePlatform()){file.current?.click();return;}
    setBusy(true);setError('');
    try{
      const image=await Camera.getPhoto({quality:85,width:1800,correctOrientation:true,saveToGallery:false,resultType:CameraResultType.Uri,source:CameraSource.Camera});
      if(image.webPath)setImage(image.webPath);
    }catch{setError('No se tomó la foto. Puedes volver a intentar, revisar el permiso de Cámara en Ajustes o elegir una foto.');}
    finally{setBusy(false);}
  }
  const cm=calibratedWidth(points,Number(reference));
  const labels=['Marca el inicio de la referencia','Marca el final de la referencia','Marca el inicio del ancho despejado','Marca el final del ancho despejado'];
  return <section className="surface p-5 mb-5"><h2 className="font-bold text-lg mb-2">Medir con cámara</h2><p className="text-sm text-text-secondary mb-4">Pon una regla sobre el escritorio. Toma la foto desde arriba, con la cámara paralela a la superficie. La referencia y el ancho deben estar en el mismo plano y ser paralelos.</p>
    <div className="grid gap-2"><Button type="button" loading={busy} onClick={capture}>Tomar foto del espacio</Button><button type="button" className="min-h-11 text-primary" onClick={()=>file.current?.click()}>Elegir una foto</button></div>
    <input ref={file} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" aria-label="Foto del escritorio" className="sr-only" onChange={event=>{const selected=event.target.files?.[0];if(!selected)return;if(selected.size>20*1024*1024){setError('Elige una foto de menos de 20 MB.');return;}if(blob.current)URL.revokeObjectURL(blob.current);blob.current=URL.createObjectURL(selected);setImage(blob.current);event.target.value='';}}/>
    {!Capacitor.isNativePlatform()&&<p className="text-xs text-text-secondary mt-2">En el celular, el selector puede ofrecer Tomar foto. La app iPhone abre la cámara directamente.</p>}
    {error&&<Notice error>{error}</Notice>}
    {photo&&<><p className="text-xs text-text-secondary mt-3 mb-3">La foto se procesa en este dispositivo. No se sube al servidor.</p><Input label="Longitud de la referencia en cm" type="number" min={0.1} max={1000} step={0.1} value={reference} onChange={e=>{setReference(e.target.value);setAccepted(false);}}/>
      <p role="status" className="text-sm font-semibold text-primary my-3">{points.length<4?`${points.length+1}/4 · ${labels[points.length]}`:'Comprueba los cuatro puntos antes de usar la medida.'}</p>
      <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-border-main"><img src={photo} alt="Tu escritorio para medir" className="block w-full" onLoad={e=>{const image=e.currentTarget;setSize({width:image.naturalWidth,height:image.naturalHeight});}} onError={()=>{setError('No se pudo abrir esta imagen. Prueba una foto JPEG o PNG.');setPhoto('');}}/>
        <svg viewBox={`0 0 ${size.width} ${size.height}`} className="absolute inset-0 w-full h-full touch-manipulation" aria-label="Marca cuatro puntos sobre la foto" role="img" onPointerDown={e=>{if(points.length>=4)return;const rect=e.currentTarget.getBoundingClientRect();setPoints([...points,{x:(e.clientX-rect.left)/rect.width*size.width,y:(e.clientY-rect.top)/rect.height*size.height}]);setAccepted(false);}}>
          {[0,2].map(index=>points[index]&&points[index+1]&&<line key={index} x1={points[index].x} y1={points[index].y} x2={points[index+1].x} y2={points[index+1].y} stroke={index===0?'#ffbf00':'#00db9a'} strokeWidth={size.width/150}/>)}
          {points.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r={size.width/50} fill={i<2?'#ffbf00':'#00db9a'} stroke="#0f172a" strokeWidth={size.width/400}/><text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize={size.width/40} fill="#0f172a">{i+1}</text></g>)}
        </svg></div>
      <div className="flex gap-4"><button type="button" className="text-primary min-h-11" disabled={!points.length} onClick={()=>{setPoints(points.slice(0,-1));setAccepted(false);}}>Deshacer punto</button><button type="button" className="text-primary min-h-11" onClick={()=>{setPoints([]);setAccepted(false);}}>Repetir puntos</button></div>
      {points.length===4&&(cm===null?<Notice error>Los segmentos son demasiado cortos o la referencia no es válida. Repite los puntos con una referencia visible.</Notice>:<><p className="text-2xl font-bold my-3">Ancho estimado: {cm} cm</p><p className="text-sm text-text-secondary mb-3">Es una estimación por proporción, no un escaneo 3D. La perspectiva, la posición de la regla y los puntos cambian el resultado. Comprueba la medida con una regla física.</p><Button type="button" onClick={()=>{onUse(cm);setAccepted(true);}}>Usar esta medida</Button>{accepted&&<p role="status" className="text-sm text-primary mt-3">Medida copiada al formulario. Completa tus datos y toca Guardar medición.</p>}</>)}
      <button type="button" className="block text-red-700 min-h-11 mt-2" onClick={()=>{setPhoto('');setPoints([]);if(blob.current){URL.revokeObjectURL(blob.current);blob.current='';}}}>Quitar foto</button>
    </>}
  </section>;
}
