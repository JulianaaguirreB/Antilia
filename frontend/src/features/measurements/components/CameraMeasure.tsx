import { ActionIcon } from '../../../shared/components/ActionIcon';
import {useEffect,useRef,useState} from 'react';
import {Capacitor} from '@capacitor/core';
import {CameraSource} from '@capacitor/camera';
import {pickNativePhoto} from '../../../shared/lib/nativePhoto';
import {Button,Input} from '../../../shared/components/ui';
import {Notice} from '../../../shared/components/ReleaseLayout';
import {measureRectangle,type Point} from '../lib/photoCalibration';

export function calibratedWidth(points:Point[],reference:number) {
 if(points.length!==4||!Number.isFinite(reference)||reference<=0||reference>1000)return null;
 const known=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y),target=Math.hypot(points[2].x-points[3].x,points[2].y-points[3].y);
 if(known<10||target<10)return null;const cm=reference*target/known;return Number.isFinite(cm)&&cm<=10000?Math.round(cm*10)/10:null;
}
const corners=['superior izquierda','superior derecha','inferior derecha','inferior izquierda'];
export function CameraMeasure({onUse,onDimensions}:{onUse:(cm:number)=>void;onDimensions?:(width:number,depth:number)=>boolean|void}) {
 const [photo,setPhoto]=useState('');const [size,setSize]=useState({width:1000,height:1000});
 const [points,setPoints]=useState<Point[]>([]);const [reference,setReference]=useState('a4');
 const [referenceWidth,setReferenceWidth]=useState('21');const [referenceDepth,setReferenceDepth]=useState('29.7');
 const [manualWidth,setManualWidth]=useState('');const [manualDepth,setManualDepth]=useState('');
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [accepted,setAccepted]=useState(false);
 const gallery=useRef<HTMLInputElement>(null),captureFile=useRef<HTMLInputElement>(null),blob=useRef('');
 useEffect(()=>()=>{if(blob.current)URL.revokeObjectURL(blob.current);},[]);
 const isIOS=Capacitor.getPlatform()==='ios'||/iPhone|iPad/.test(navigator.userAgent);
 const setImage=(url:string)=>{if(blob.current){URL.revokeObjectURL(blob.current);blob.current='';}setPhoto(url);setPoints([]);setAccepted(false);setError('');};
 async function capture(source:CameraSource){
  if(!Capacitor.isNativePlatform()){(source===CameraSource.Camera?captureFile:gallery).current?.click();return;}
  setBusy(true);setError('');try{const path=await pickNativePhoto(source===CameraSource.Camera?'camera':'gallery','measurement');if(path)setImage(path);}
  catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }
 const fileChanged=(file:File|undefined)=>{if(!file)return;if(file.size>20*1024*1024){setError('Elige una foto de menos de 20 MB.');return;}const url=URL.createObjectURL(file);setImage(url);blob.current=url;};
 const estimate=measureRectangle(points,Number(referenceWidth),Number(referenceDepth));
 const useDimensions=(width:number,depth:number)=>{setError('');if(onDimensions){if(onDimensions(width,depth)===false)return;}else onUse(width);setAccepted(true);};
 const chooseReference=(value:string)=>{setReference(value);if(value==='a4'){setReferenceWidth('21');setReferenceDepth('29.7');}else if(value==='tarjeta'){setReferenceWidth('8.56');setReferenceDepth('5.398');}setPoints([]);setAccepted(false);};
 return <section className="surface p-5 mb-5 camera-measure"><p className="eyebrow mb-2">Cámara y medidas</p><h2 className="font-bold text-lg mb-2">Dale medidas a tu mesa</h2><p className="text-sm text-text-secondary mb-4">Coloca una hoja A4 plana sobre el tablero y fotografía la mesa completa, con las cuatro esquinas visibles. Cuanto más de frente a la superficie y mejor iluminada esté, mejor.</p>
 <p className="text-xs text-text-secondary mb-4">La cámara se usa solo si la autorizas. En la galería eliges una sola foto. La imagen de tu mesa se procesa en el dispositivo y no se sube al servidor; también puedes introducir medidas sin usar fotos.</p><div className="measurement-steps"><span>1 · Toma la foto</span><span>2 · Marca las esquinas</span><span>3 · Revisa las medidas</span></div>
 <div className="grid gap-2 mt-4"><Button type="button" loading={busy} onClick={()=>capture(CameraSource.Camera)}>Tomar foto de la mesa</Button><button type="button" className="min-h-11 text-primary" disabled={busy} onClick={()=>capture(CameraSource.Photos)}>Elegir una foto</button></div>
 <input ref={captureFile} type="file" capture="environment" accept="image/*" aria-label="Tomar foto del escritorio" className="sr-only" onChange={e=>{fileChanged(e.target.files?.[0]);e.target.value='';}}/>
 <input ref={gallery} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" aria-label="Foto del escritorio" className="sr-only" onChange={e=>{fileChanged(e.target.files?.[0]);e.target.value='';}}/>
 {error&&<Notice error>{error}</Notice>}
 {photo&&<><p className="text-xs text-text-secondary my-3">La foto se procesa en este dispositivo. No se sube al servidor. Este método es para tableros rectangulares; para una mesa en L usa las medidas manuales.</p>
 <label className="grid gap-2 text-sm mb-3">Referencia rectangular<select className="rounded-xl border border-border-main bg-white p-3 min-h-13" value={reference} onChange={e=>chooseReference(e.target.value)}><option value="a4">Hoja A4 · 21 × 29,7 cm</option><option value="tarjeta">Tarjeta estándar · 8,56 × 5,398 cm</option><option value="custom">Otra referencia rectangular</option></select></label>
 <p className="text-xs mb-3 text-text-secondary">Orienta la referencia con su ancho de izquierda a derecha y su fondo de arriba abajo en la foto. Evita tarjetas con datos personales.</p>
 <div className="grid grid-cols-2 gap-3"><Input label="Ancho de referencia (cm)" type="number" min={1} max={1000} step="any" value={referenceWidth} onChange={e=>{setReferenceWidth(e.target.value);setAccepted(false);}}/><Input label="Fondo de referencia (cm)" type="number" min={1} max={1000} step="any" value={referenceDepth} onChange={e=>{setReferenceDepth(e.target.value);setAccepted(false);}}/></div>
 <div className="measurement-instruction" role="status">{points.length<8?<><strong>{points.length+1}/8 · {points.length<4?'Referencia':'Mesa'}</strong><span>Marca la esquina {corners[points.length%4]} {points.length<4?'de la hoja o tarjeta':'del tablero'}.</span></>:<strong>Revisa las esquinas antes de usar el resultado.</strong>}</div>
 <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-border-main"><img src={photo} alt="Mesa y referencia rectangular para medir" className="block w-full" onLoad={e=>setSize({width:e.currentTarget.naturalWidth,height:e.currentTarget.naturalHeight})} onError={()=>{setError('No se pudo abrir esta imagen. Usa una foto JPEG o PNG.');setPhoto('');}}/>
 <svg viewBox={`0 0 ${size.width} ${size.height}`} className="absolute inset-0 w-full h-full touch-manipulation" role="img" aria-label="Marca las cuatro esquinas de la referencia y después las cuatro esquinas de la mesa" onPointerDown={e=>{if(points.length>=8)return;const rect=e.currentTarget.getBoundingClientRect();setPoints([...points,{x:(e.clientX-rect.left)/rect.width*size.width,y:(e.clientY-rect.top)/rect.height*size.height}]);setAccepted(false);}}>
 {[0,4].map(start=>{const group=points.slice(start,start+4);return group.length>1&&<polyline key={start} points={[...group,...(group.length===4?[group[0]]:[])].map(p=>`${p.x},${p.y}`).join(' ')} stroke={start===0?'#eab64c':'#72e4ff'} strokeWidth={size.width/200} fill={group.length===4?(start===0?'#eab64c22':'#72e4ff11'):'none'}/>;})}
 {points.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r={size.width/48} fill={i<4?'#ffda76':'#91e5ff'} stroke="#0f294b" strokeWidth={size.width/450}/><text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize={size.width/42} fill="#0f294b">{i+1}</text></g>)}
 </svg></div>
 <div className="flex flex-wrap gap-4"><button type="button" className="text-primary min-h-11" disabled={!points.length} onClick={()=>{setPoints(points.slice(0,-1));setAccepted(false);}}>Deshacer punto</button><button type="button" className="text-primary min-h-11" onClick={()=>{setPoints([]);setAccepted(false);}}>Repetir puntos</button></div>
 {points.length===8&&(estimate?<div className="measurement-result"><p className="eyebrow">Dimensiones estimadas</p><div className="grid grid-cols-2 gap-3 my-4"><p><strong>{estimate.width} cm</strong><span>Ancho</span></p><p><strong>{estimate.depth} cm</strong><span>Fondo</span></p></div><p className="text-xs mb-4">Corregimos la perspectiva a partir de tu referencia plana. La lente, una hoja doblada o las esquinas imprecisas pueden alterar el resultado. Comprueba con una cinta métrica.</p><Button type="button" onClick={()=>useDimensions(estimate.width,estimate.depth)}>{onDimensions?'Usar ancho y fondo':'Usar ancho en el registro'}</Button></div>:<Notice error>No se pudo calcular una medida fiable. Marca las esquinas en orden, sin cruzarlas, usa una referencia más grande y comprueba que todo esté sobre el mismo plano.</Notice>)}
 <button type="button" className="block text-red-700 min-h-11 mt-2" onClick={()=>{setImage('');}}>Quitar foto</button></>}
 <details className="measurement-manual mt-4"><summary className="font-semibold min-h-11 cursor-pointer py-3">{isIOS?'Usar Medidas del iPhone o cinta métrica':'Introducir medidas con cinta métrica'}</summary>
 {isIOS&&<><p className="text-sm text-text-secondary mb-3">Abre la app Medidas de Apple en tu iPhone. Mueve el teléfono como indica, marca cada extremo del ancho y después del fondo. Vuelve aquí e introduce los centímetros. La transferencia es manual.</p><a className="text-primary underline text-sm" href="https://support.apple.com/es-co/guide/iphone/iphd8ac2cfea/ios" target="_blank" rel="noreferrer"><ActionIcon action="Cómo usar Medidas de Apple"/><span>Cómo usar Medidas de Apple</span></a></>}
 <p className="text-sm text-text-secondary my-3">En una mesa en L, mide el ancho y fondo exteriores completos. Para muebles que deban encajar, comprueba siempre con una cinta métrica.</p>
 <div className="grid grid-cols-2 gap-3 mb-3"><Input label="Ancho medido (cm)" type="number" min={1} max={1000} step={0.1} value={manualWidth} onChange={e=>{setManualWidth(e.target.value);setAccepted(false);}}/><Input label="Fondo medido (cm)" type="number" min={1} max={1000} step={0.1} value={manualDepth} onChange={e=>{setManualDepth(e.target.value);setAccepted(false);}}/></div>
 <button type="button" className="desk-add" disabled={![Number(manualWidth),Number(manualDepth)].every(n=>Number.isFinite(n)&&n>=1&&n<=1000)} onClick={()=>useDimensions(Number(manualWidth),Number(manualDepth))}>{onDimensions?'Aplicar medidas a mi mesa':'Usar ancho medido'}</button>
 </details>{accepted&&<p role="status" className="text-sm font-semibold text-primary mt-3">{onDimensions?'Medidas aplicadas. Toca Guardar escritorio para conservarlas.':'Ancho copiado al formulario. Completa tus datos y toca Guardar medición.'}</p>}
 </section>;
}
