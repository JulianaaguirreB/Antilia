import { useRef, useState } from 'react';
import { useAuth, User } from '../../auth/context/AuthContext';
import { api } from '../../../shared/api/client';
import { Modal, Notice } from '../../../shared/components/ReleaseLayout';
import { Button } from '../../../shared/components/ui';

async function preparePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/') || file.size > 20 * 1024 * 1024) throw new Error('Elige una imagen de hasta 20 MB.');
  const url=URL.createObjectURL(file);
  try {
    const image=new Image(); image.src=url;
    await image.decode();
    const size=Math.min(image.naturalWidth,image.naturalHeight);
    if (!size) throw new Error('No pudimos abrir esta imagen. Prueba con una foto JPG.');
    const canvas=document.createElement('canvas'); canvas.width=512;canvas.height=512;
    const ctx=canvas.getContext('2d'); if(!ctx) throw new Error('No pudimos preparar tu foto.');
    ctx.fillStyle='#f0f5f9';ctx.fillRect(0,0,512,512);
    ctx.drawImage(image,(image.naturalWidth-size)/2,(image.naturalHeight-size)/2,size,size,0,0,512,512);
    const result=canvas.toDataURL('image/jpeg',.78);
    if(result.length>350000) throw new Error('Esta foto es muy pesada. Prueba con otra imagen.');
    return result;
  } finally { URL.revokeObjectURL(url); }
}
export function ProfilePhoto() {
  const {user,login}=useAuth(); const gallery=useRef<HTMLInputElement>(null),camera=useRef<HTMLInputElement>(null);
  const [open,setOpen]=useState(false),[draft,setDraft]=useState<string|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
  if(!user)return null;
  const initials=user.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
  async function choose(file?:File){if(!file)return;setBusy(true);setError('');try{setDraft(await preparePhoto(file));}catch(e){setError((e as Error).message||'No pudimos abrir la foto. Prueba con JPG o PNG.');}finally{setBusy(false);}}
  async function save(value:string|null){setBusy(true);setError('');try{const result=await api<{user:User}>('/auth/appearance',{method:'PATCH',body:JSON.stringify({avatar_url:value})});login(localStorage.getItem('antilia_token')||'',result.user);setOpen(false);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  return <><button className="profile-photo-button" aria-label="Cambiar foto de perfil" onClick={()=>{setDraft(user.avatar_url||null);setError('');setOpen(true);}}>{user.avatar_url?<img src={user.avatar_url} alt="Tu foto de perfil"/>:<span>{initials}</span>}<b aria-hidden="true">＋</b></button><button className="text-primary text-sm min-h-11 mb-2" onClick={()=>{setDraft(user.avatar_url||null);setError('');setOpen(true);}}>Cambiar foto</button>
  {open&&<Modal title="Tu mejor cara" busy={busy} onClose={()=>setOpen(false)}><p className="text-sm text-text-secondary mb-4">Una foto para sentir este espacio más tuyo. Se recorta al centro y se guarda solo en tu perfil.</p><div className="photo-preview">{draft?<img src={draft} alt="Vista previa de tu foto"/>:<span>{initials}</span>}</div><input ref={gallery} hidden type="file" accept="image/*" aria-label="Elegir imagen de galería" onChange={e=>{void choose(e.target.files?.[0]);e.target.value='';}}/><input ref={camera} hidden type="file" accept="image/*" capture="user" aria-label="Tomar foto de perfil" onChange={e=>{void choose(e.target.files?.[0]);e.target.value='';}}/>{error&&<Notice error>{error}</Notice>}<div className="grid gap-3"><Button disabled={busy} variant="secondary" onClick={()=>gallery.current?.click()}>Elegir de mi galería</Button><Button disabled={busy} variant="secondary" onClick={()=>camera.current?.click()}>Tomar una foto</Button><Button loading={busy} disabled={!draft} onClick={()=>save(draft)}>Guardar foto</Button>{user.avatar_url&&<button disabled={busy} className="min-h-11 text-error" onClick={()=>save(null)}>Quitar mi foto</button>}</div></Modal>}</>;
}
