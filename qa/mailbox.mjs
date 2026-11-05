import {chromium,devices} from 'playwright';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const base=process.env.BASE_URL||'http://localhost:3102';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Solo entorno local.');
const browser=await chromium.launch();
try {
 const context=await browser.newContext({...devices['iPhone 13']});
 const response=await context.request.post(base+'/api/auth/register',{data:{name:'Bandeja prueba',email:`bandeja-${Date.now()}@example.com`,password:'PruebaBandeja2026'}});
 const {token}=await response.json();assert.ok(token);
 await context.addInitScript(value=>localStorage.setItem('antilia_token',value),token);
 const page=await context.newPage();
 mkdirSync('qa/evidencias/mailbox',{recursive:true});
 await page.goto(base+'/#/correos');
 await page.getByRole('button',{name:'Conectar con Google'}).waitFor();
 assert.ok(await page.getByRole('button',{name:'Conectar con Google'}).isDisabled());
 await page.screenshot({path:'qa/evidencias/mailbox/sin-configurar.png',fullPage:true});
 let connected=true;
 let category='proyectos';
 const message={id:'720d060c-8232-4695-8bd7-ac29cb6a5a6c',gmail_id:'mailfixture',subject:'Proyecto Antilia: entrega',sender:'Equipo <equipo@example.com>',snippet:'Mensaje simulado para comprobar la interfaz.',received_at:new Date().toISOString(),category,reason:'El asunto menciona un proyecto.',manual_category:false};
 await page.route('**/api/mailbox/**',async route=>{
  const url=new URL(route.request().url());const path=url.pathname;const method=route.request().method();
  let data;
  if(path.endsWith('/status'))data={configured:true,connected,connection:connected?{email:'prueba@example.com',last_synced_at:new Date().toISOString(),has_more:false}:null};
  else if(path.endsWith('/content'))data={text:'Texto de correo <script>window.injected=true</script>'};
  else if(path.endsWith('/sync'))data={reviewed:2,imported:1,has_more:false};
  else if(path.endsWith('/connection')&&method==='DELETE'){connected=false;data={message:'Desconectado.'};}
  else if(method==='PATCH'){category=route.request().postDataJSON().category;data={updated:true};}
  else if(path.endsWith('/messages')){const requested=url.searchParams.get('category');data={messages:connected&&(!requested||requested===category)?[{...message,category}]:[],has_more:false,counts:[{category,total:1}]};}
  else throw new Error('Solicitud inesperada '+path);
  await route.fulfill({json:data});
 });
 await page.reload();
 await page.getByRole('button',{name:'Actualizar correos',exact:true}).click();
 await page.getByText('2 mensajes revisados; 1 coincidencias guardadas o actualizadas.').waitFor();
 await page.getByRole('button',{name:'Leer y clasificar'}).click();
 await page.getByText('Texto de correo <script>window.injected=true</script>',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>window.injected),undefined);
 await page.getByLabel('Guardar en').selectOption('documentos');
 await page.getByText('Clasificación elegida por ti.',{exact:true}).waitFor();
 await page.screenshot({path:'qa/evidencias/mailbox/lectura.png',fullPage:true});
 await page.getByRole('button',{name:'Cerrar',exact:true}).click();
 await page.getByRole('button',{name:'Documentos · 1',exact:true}).click();
 await page.getByText(message.subject,{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.getByRole('button',{name:'Desconectar y eliminar copias de Antilia'}).click();
 await page.getByRole('button',{name:'Desconectar y eliminar copias',exact:true}).click();
 await page.getByRole('button',{name:'Conectar con Google'}).waitFor();
 assert.equal(connected,false);
 const recovery=await browser.newPage({...devices['iPhone 13']});
 await recovery.goto(base+'/#/recuperar');
 await recovery.getByRole('button',{name:'Enviar código'}).waitFor();
 assert.ok(await recovery.getByRole('button',{name:'Enviar código'}).isDisabled());
 assert.equal(await recovery.getByText('Error interno.',{exact:true}).count(),0);
 await recovery.screenshot({path:'qa/evidencias/mailbox/recuperacion.png',fullPage:true});
 console.log('PASA: estado sin configurar, selección, lectura sin HTML activo, clasificación, desconexión y recuperación sin error interno. Gmail simulado; sin leer ni enviar correos reales.');
} finally {await browser.close();}
