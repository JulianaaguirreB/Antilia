import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {type DeskData,type DeskItem,itemSize,labels} from '../lib/layout';

type Props={desk:DeskData;selected:string;mode:'move'|'orbit';top:boolean;onSelect:(id:string)=>void;onMove:(id:string,x:number,y:number)=>void};
type World={scene:THREE.Scene;camera:THREE.PerspectiveCamera;renderer:THREE.WebGLRenderer;controls:OrbitControls;model:THREE.Group;items:THREE.Group;draw:()=>void};
function dispose(group:THREE.Group) {
  group.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>{if('map' in material)(material as THREE.MeshBasicMaterial).map?.dispose();material.dispose();});}});
  group.clear();
}
function paper(item:DeskItem,selected:boolean) {
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=384;
  const ctx=canvas.getContext('2d')!;
  ctx.fillStyle=item.color??'#fff2bf';ctx.fillRect(0,0,768,384);
  ctx.fillStyle=selected?'#123b67':'#d5ad53';ctx.fillRect(0,0,768,24);
  ctx.fillStyle='#142e4c';ctx.textAlign='center';ctx.textBaseline='middle';
  const title=item.label||labels[item.kind];
  ctx.font=`700 ${title.length>24?58:title.length>14?72:90}px sans-serif`;
  const words=title.split(' ');const lines=[''];
  words.forEach(word=>{const last=lines.length-1;if(ctx.measureText(lines[last]+' '+word).width>650&&lines[last])lines.push(word);else lines[last]+=(lines[last]?' ':'')+word;});
  lines.slice(0,3).forEach((line,i)=>ctx.fillText(line,384,160+(i-(Math.min(lines.length,3)-1)/2)*76,680));
  ctx.font='28px sans-serif';ctx.fillStyle='#426080';const size=itemSize(item);ctx.fillText(`${size.width} × ${size.depth} cm`,384,308);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export default function DeskScene(props:Props) {
  const host=useRef<HTMLDivElement>(null);const world=useRef<World|null>(null);const latest=useRef(props);latest.current=props;
  const [unavailable,setUnavailable]=useState(false);
  useEffect(()=>{
    const container=host.current!;let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}catch{setUnavailable(true);return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor('#eaf2fa');
    renderer.domElement.setAttribute('aria-label','Mesa 3D interactiva. Usa también los controles de posición debajo.');
    renderer.domElement.setAttribute('role','img');renderer.domElement.style.touchAction='none';container.appendChild(renderer.domElement);
    const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(38,1,1,10000);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minPolarAngle=.02;controls.maxPolarAngle=Math.PI*.48;controls.minDistance=60;controls.maxDistance=2200;
    const tag=document.createElement('span');tag.className='desk-scene-label';container.appendChild(tag);
    const draw=()=>{renderer.render(scene,camera);const {desk,selected}=latest.current;const item=desk.layout.find(i=>i.id===selected);tag.hidden=!item;if(item){const pos=new THREE.Vector3((item.x/100-.5)*desk.width_cm,(desk.height_cm??75)+3,(item.y/100-.5)*desk.depth_cm).project(camera);tag.textContent=item.label||labels[item.kind];tag.style.left=`${(pos.x*.5+.5)*100}%`;tag.style.top=`${(-pos.y*.5+.5)*100}%`;}};controls.addEventListener('change',draw);
    scene.add(new THREE.HemisphereLight('#ffffff','#49627f',2.6));const light=new THREE.DirectionalLight('#fff2d8',3);light.position.set(-150,350,200);scene.add(light);
    const model=new THREE.Group(),items=new THREE.Group();scene.add(model,items);world.current={scene,camera,renderer,controls,model,items,draw};
    const resize=new ResizeObserver(()=>{const width=container.clientWidth,height=container.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();draw();});resize.observe(container);
    const ray=new THREE.Raycaster();let moving=false;let activeId='';
    const intersect=(event:PointerEvent)=>{const rect=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1),camera);};
    const move=(event:PointerEvent)=>{if(!moving)return;intersect(event);const {desk,onMove}=latest.current;const hit=new THREE.Vector3();if(ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-(desk.height_cm??75)-2.5),hit))onMove(activeId,(hit.x/desk.width_cm+.5)*100,(hit.z/desk.depth_cm+.5)*100);};
    const down=(event:PointerEvent)=>{if(latest.current.mode!=='move'||event.button!==0)return;intersect(event);const hit=ray.intersectObjects(items.children,true)[0];activeId=hit?.object.userData.itemId??latest.current.selected;if(!activeId)return;if(hit)latest.current.onSelect(activeId);moving=true;renderer.domElement.setPointerCapture(event.pointerId);if(!hit)move(event);};
    const up=()=>{moving=false;};
    renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);
    const lost=(event:Event)=>{event.preventDefault();setUnavailable(true);};renderer.domElement.addEventListener('webglcontextlost',lost);
    return()=>{resize.disconnect();controls.dispose();dispose(items);dispose(model);renderer.dispose();renderer.domElement.remove();tag.remove();world.current=null;};
  },[]);
  useEffect(()=>{
    const w=world.current;if(!w)return;dispose(w.model);
    const {width_cm:width,depth_cm:depth}=props.desk,height=props.desk.height_cm??75;
    const box=(x:number,y:number,z:number,a:number,b:number,c:number,color:string)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(a,b,c),new THREE.MeshStandardMaterial({color,roughness:.75}));mesh.position.set(x,y,z);w.model.add(mesh);};
    if(props.desk.model==='esquina'){
      box(0,height,depth*(-.28),width,3,depth*.44,'#b98d5e');box(width*(-.28),height,depth*.22,width*.44,3,depth*.56,'#b98d5e');
      [[-width/2+5,-depth/2+5],[width/2-5,-depth/2+5],[width/2-5,-depth*.06-5],[-width/2+5,depth/2-5],[-width*.06-5,depth/2-5]].forEach(([x,z])=>box(x,height/2,z,4,height,4,'#203e5d'));
    }else{
      box(0,height,0,width,3,depth,props.desk.model==='cajonera'?'#ddc09c':'#c69e70');
      [-1,1].forEach(x=>[-1,1].forEach(z=>box(x*(width/2-6),height/2,z*(depth/2-6),4,height,4,'#203e5d')));
      if(props.desk.model==='cajonera'){
        box(width/2-22,height*.48,0,34,height*.92,depth-12,'#dce6ef');
        for(let i=0;i<3;i++){box(width/2-22,15+i*(height-8)/3,depth/2-5,32,(height-12)/3-1,1,'#c0d0df');box(width/2-22,21+i*(height-8)/3,depth/2-4,9,1.2,1,'#b58b34');}
      }
    }
    box(0,-2,0,width*1.55,1,depth*1.55,'#dae6f1');w.draw();
  },[props.desk.model,props.desk.width_cm,props.desk.depth_cm,props.desk.height_cm]);
  useEffect(()=>{
    const w=world.current;if(!w)return;dispose(w.items);const {width_cm:width,depth_cm:depth}=props.desk;
    props.desk.layout.forEach(item=>{const size=itemSize(item);const mesh=new THREE.Mesh(new THREE.BoxGeometry(size.width,.8,size.depth),new THREE.MeshStandardMaterial({color:item.id===props.selected?'#183f70':'#f1d991'}));mesh.position.set((item.x/100-.5)*width,(props.desk.height_cm??75)+2,(item.y/100-.5)*depth);mesh.rotation.y=-(item.rotation??0)*Math.PI/180;mesh.userData.itemId=item.id;w.items.add(mesh);
      const label=new THREE.Mesh(new THREE.PlaneGeometry(size.width,size.depth),new THREE.MeshBasicMaterial({map:paper(item,item.id===props.selected),side:THREE.DoubleSide}));label.rotation.x=-Math.PI/2;label.position.y=.42;label.userData.itemId=item.id;mesh.add(label);
    });w.draw();
  },[props.desk,props.selected]);
  useEffect(()=>{const w=world.current;if(!w)return;const h=props.desk.height_cm??75;const distance=Math.max(props.desk.width_cm,props.desk.depth_cm,h)*1.5;w.controls.target.set(0,h*.55,0);w.camera.position.set(props.top?0:distance*.8,props.top?distance*1.7:distance*1.05,props.top?.1:distance*1.15);w.controls.update();w.draw();},[props.top,props.desk.width_cm,props.desk.depth_cm,props.desk.height_cm]);
  useEffect(()=>{if(world.current)world.current.controls.enabled=props.mode==='orbit';},[props.mode]);
  return <div className="desk-scene" ref={host}>{unavailable&&<p className="p-6 text-sm" role="status">Este dispositivo no pudo abrir la vista 3D. Tus objetos siguen disponibles en la vista Plano y en los controles de posición.</p>}</div>;
}
