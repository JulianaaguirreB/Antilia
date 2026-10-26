import { Camera, CameraDirection, MediaTypeSelection, type CameraPlugin } from '@capacitor/camera';
export type PhotoSource='camera'|'gallery';
export class PhotoPermissionError extends Error {
 constructor(public kind:'camera'|'gallery') {super(kind==='camera'?'No activaste la cámara. Puedes elegir una foto de la galería o habilitar Cámara en Ajustes / Aplicaciones / Antilia / Permisos.':'No se autorizó la foto. Puedes elegir otra imagen o revisar Fotos en los ajustes de Antilia.');}
}
// Check on every use: Android can revoke a one-time or unused permission after the app closes.
export async function pickNativePhoto(source:PhotoSource, purpose:'profile'|'measurement', camera:CameraPlugin=Camera):Promise<string|null> {
 try {
  let photo;
  if(source==='camera') {
   let status=await camera.checkPermissions();
   if(status.camera==='denied')throw new PhotoPermissionError('camera');
   if(status.camera!=='granted')status=await camera.requestPermissions({permissions:['camera']});
   if(status.camera!=='granted')throw new PhotoPermissionError('camera');
   photo=await camera.takePhoto({quality:purpose==='profile'?85:95,targetWidth:purpose==='profile'?1200:2400,targetHeight:purpose==='profile'?1200:2400,correctOrientation:true,saveToGallery:false,includeMetadata:false,cameraDirection:purpose==='profile'?CameraDirection.Front:CameraDirection.Rear});
  }else {
   const selected=await camera.chooseFromGallery({mediaType:MediaTypeSelection.Photo,allowMultipleSelection:false,limit:1,quality:95,includeMetadata:false,correctOrientation:true});
   photo=selected.results[0];
   if(!photo)return null;
  }
  if(!photo.webPath)throw new Error('No pudimos abrir la imagen. Prueba con otra foto.');
  return photo.webPath;
 }catch(error) {
  if(error instanceof PhotoPermissionError)throw error;
  const e=error as {code?:string;message?:string};
  if(['OS-PLUG-CAMR-0006','OS-PLUG-CAMR-0020','OS-PLUG-CAMR-0013'].includes(e.code||'')||/cancel(?:led|ed|ado|ada)|no (?:image|images|photos?) (?:picked|selected)/i.test(e.message||''))return null;
  if(e.code==='OS-PLUG-CAMR-0003'||/denied.*camera|camera.*denied/i.test(e.message||''))throw new PhotoPermissionError('camera');
  if(e.code==='OS-PLUG-CAMR-0005')throw new PhotoPermissionError('gallery');
  if(e.code==='OS-PLUG-CAMR-0007')throw new Error('Este dispositivo no tiene una cámara disponible. Puedes elegir una foto de la galería.');
  throw new Error('No pudimos abrir la foto. Puedes volver a intentarlo o elegir otra imagen.');
 }
}
