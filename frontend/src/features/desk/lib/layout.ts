export type DeskModel = 'recta' | 'cajonera' | 'esquina';
export type Kind = 'monitor' | 'lampara' | 'planta' | 'archivador' | 'teclado' | 'personalizado';
export type DeskItem = { id:string; kind:Kind; x:number; y:number; label?:string; width_cm?:number; depth_cm?:number; rotation?:number; color?:string };
export type DeskData = { name:string; width_cm:number; depth_cm:number; height_cm?:number; model?:DeskModel; layout:DeskItem[]; updated_at?:string };
export const models: {id:DeskModel; name:string; description:string; width:number; depth:number}[] = [
  {id:'recta',name:'Mesa esencial',description:'Tablero recto · cuatro patas',width:120,depth:70},
  {id:'cajonera',name:'Oficina con cajonera',description:'Almacenamiento bajo el tablero',width:140,depth:70},
  {id:'esquina',name:'Escritorio en L',description:'Dos alas para separar actividades',width:180,depth:160},
];
export const labels:Record<Kind,string> = {monitor:'Monitor',lampara:'Lámpara',planta:'Planta',archivador:'Archivador',teclado:'Teclado',personalizado:'Objeto'};
export function itemSize(item:DeskItem) { return {width:item.width_cm??(item.kind==='monitor'?32:22),depth:item.depth_cm??(item.kind==='teclado'?12:18)}; }
export function footprint(item:DeskItem) {
  const size=itemSize(item); const radians=(item.rotation??0)*Math.PI/180;
  return {width:Math.abs(size.width*Math.cos(radians))+Math.abs(size.depth*Math.sin(radians)),depth:Math.abs(size.width*Math.sin(radians))+Math.abs(size.depth*Math.cos(radians))};
}
export function fits(desk:DeskData,item:DeskItem) {
  const {width,depth}=footprint(item), x=item.x*desk.width_cm/100, y=item.y*desk.depth_cm/100;
  const epsilon=1e-6;
  return x-width/2>=-epsilon && x+width/2<=desk.width_cm+epsilon && y-depth/2>=-epsilon && y+depth/2<=desk.depth_cm+epsilon && (desk.model!=='esquina'||x+width/2<=desk.width_cm*.44+epsilon||y+depth/2<=desk.depth_cm*.44+epsilon);
}
export function placeItem(desk:DeskData,item:DeskItem,x=item.x,y=item.y):DeskItem {
  const size=footprint(item);
  const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
  const halfX=size.width/desk.width_cm*50,halfY=size.depth/desk.depth_cm*50;
  const next={...item,x:clamp(x,Math.max(5,halfX),Math.min(95,100-halfX)),y:clamp(y,Math.max(5,halfY),Math.min(95,100-halfY))};
  if(desk.model==='esquina'&&!fits(desk,next)) {
    const left={...next,x:Math.min(next.x,44-halfX)},back={...next,y:Math.min(next.y,44-halfY)};
    const options=[left,back].filter(value=>fits(desk,value));
    if(options.length)return options.sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];
  }
  return next;
}
export function normalizeDesk(value:DeskData):DeskData { return {...value,model:value.model??'recta',height_cm:Number(value.height_cm??75),width_cm:Number(value.width_cm),depth_cm:Number(value.depth_cm)}; }
