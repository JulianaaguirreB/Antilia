const {body}=require('../../shared/release2-validation');
const {problem}=require('../../shared/http');
const {validateString}=require('../../shared/validate');

function validateDesk(raw){
  const input=body(raw,['name','width_cm','depth_cm','height_cm','model','layout']);
  const name=validateString(input.name,'name',1,80);
  for(const key of ['width_cm','depth_cm'])if(typeof input[key]!=='number'||!Number.isFinite(input[key])||input[key]<20||input[key]>1000)throw problem(400,'Las dimensiones deben estar entre 20 y 1000 cm.');
  const model=input.model??'recta',height=input.height_cm??75;
  if(!['recta','cajonera','esquina'].includes(model))throw problem(400,'Selecciona un modelo de escritorio válido.');
  if(typeof height!=='number'||!Number.isFinite(height)||height<30||height>130)throw problem(400,'La altura debe estar entre 30 y 130 cm.');
  if(!Array.isArray(input.layout)||input.layout.length>24)throw problem(400,'La distribución admite hasta 24 objetos.');
  const kinds=new Set(['monitor','lampara','planta','archivador','teclado','personalizado']);const seen=new Set();
  const layout=input.layout.map(item=>{
    const value=body(item,['id','kind','x','y','label','width_cm','depth_cm','rotation','color']);
    if(typeof value.id!=='string'||!/^[a-z0-9-]{1,40}$/.test(value.id)||seen.has(value.id)||!kinds.has(value.kind))throw problem(400,'Objeto de escritorio inválido.');seen.add(value.id);
    for(const key of ['x','y'])if(typeof value[key]!=='number'||!Number.isFinite(value[key])||value[key]<5||value[key]>95)throw problem(400,'Los objetos deben permanecer dentro del escritorio.');
    const result={id:value.id,kind:value.kind,x:value.x,y:value.y};
    if(value.label!==undefined)result.label=validateString(value.label,'Nombre del objeto',1,40);
    for(const key of ['width_cm','depth_cm'])if(value[key]!==undefined){if(typeof value[key]!=='number'||!Number.isFinite(value[key])||value[key]<1||value[key]>300)throw problem(400,'El tamaño del objeto debe estar entre 1 y 300 cm.');result[key]=value[key];}
    if(value.rotation!==undefined){if(![0,90,180,270].includes(value.rotation))throw problem(400,'La rotación del objeto no es válida.');result.rotation=value.rotation;}
    if(value.color!==undefined){if(!['#fff2bf','#d8edff','#dcf4e5','#f5dded'].includes(value.color))throw problem(400,'El color de la tarjeta no es válido.');result.color=value.color;}
    return result;
  });
  return {name,width_cm:input.width_cm,depth_cm:input.depth_cm,height_cm:height,model,layout};
}
module.exports={validateDesk};
