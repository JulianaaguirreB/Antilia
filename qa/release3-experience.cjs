const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.BASE_URL||'http://127.0.0.1:3105';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('Este recorrido crea ejemplos solo en local.');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const cap=await page.request.get(base+'/api/capabilities').then(r=>r.json());assert.equal(cap.email_configured,false);
  const owner=await page.request.post(base+'/api/auth/register',{data:{name:'Demostración R3',email:'recorrido-'+Date.now()+'@example.com',password:'PruebaR32026'}}).then(r=>r.json());assert.ok(owner.token);
  const request=async(path,body,method='POST')=>{const r=await page.request.fetch(base+'/api'+path,{method,headers:{Authorization:'Bearer '+owner.token},data:body});assert.ok(r.ok(),await r.text());return r.status()===204?null:r.json();};
  await page.addInitScript(t=>{localStorage.setItem('antilia_token',t);sessionStorage.setItem('antilia_intro_seen','1');},owner.token);
  await page.goto(base+'/#/inicio');await page.getByRole('button',{name:'Empezar paso a paso',exact:true}).click();await page.waitForURL('**/#/primeros-pasos');
  await page.getByRole('button',{name:'Agregar mi pendiente',exact:true}).isDisabled().then(v=>assert.equal(v,true));
  await page.getByRole('button',{name:'Crear mi espacio',exact:true}).click();await page.getByLabel('Nombre del espacio',{exact:true}).fill('Oficina Bogotá');await page.getByRole('button',{name:'Guardar mi espacio',exact:true}).click();
  await page.getByRole('button',{name:'Agregar mi pendiente',exact:true}).click();await page.getByLabel('Título de la tarea',{exact:true}).fill('Guardar una libreta');await page.getByRole('button',{name:'Guardar tarea',exact:true}).click();
  await page.getByRole('button',{name:'Completar',exact:true}).click();await page.getByRole('button',{name:'Ver a Lumi y mi racha',exact:true}).waitFor();
  await page.reload();await page.getByText('3 de 3 pasos listos',{exact:false}).waitFor();await page.getByRole('button',{name:'Ver a Lumi y mi racha',exact:true}).click();await page.waitForURL('**/#/progreso');
  await page.goto(base+'/#/primeros-pasos');await page.getByRole('button',{name:'Ver todos mis pendientes',exact:true}).click();await page.waitForURL('**/#/pendientes');
  const space=(await request('/spaces',undefined,'GET')).spaces[0];
  await request('/tasks',{title:'Vencida física',type:'fisica',space_id:space.id,due_at:'2026-10-01T10:00:00-05:00'});
  await request('/tasks',{title:'Sin fecha física',type:'fisica',space_id:space.id});
  const digital=(await request('/spaces',{name:'Correos del equipo',type:'digital'})).space;
  await request('/tasks',{title:'Responder propuesta',type:'digital',space_id:digital.id,digital_kind:'correo',due_at:new Date().toISOString()});
  await page.reload();await page.getByText('3 resultados.',{exact:false}).waitFor();
  await page.getByLabel('Fecha límite',{exact:true}).selectOption('none');await page.getByRole('heading',{name:'Sin fecha física',exact:true}).waitFor();assert.equal(await page.getByRole('heading',{name:'Vencida física',exact:true}).count(),0);
  await page.getByRole('button',{name:'Limpiar filtros',exact:true}).click();await page.getByLabel('Dónde',{exact:true}).selectOption('digital');await page.getByRole('heading',{name:'Responder propuesta',exact:true}).waitFor();assert.equal(await page.getByRole('heading',{name:'Vencida física',exact:true}).count(),0);
  await page.getByRole('button',{name:'Limpiar filtros',exact:true}).click();await page.getByLabel('Buscar pendiente o espacio',{exact:true}).fill('bogota');await page.getByText('2 resultados.',{exact:false}).waitFor();
  await page.getByLabel('Buscar pendiente o espacio',{exact:true}).fill('no existe');await page.getByRole('heading',{name:'Un poco de aire en tu lista',exact:true}).waitFor();await page.getByRole('button',{name:'Ver todos los pendientes',exact:true}).click();
  await page.getByLabel('Fecha límite',{exact:true}).selectOption('overdue');await page.getByRole('heading',{name:'Vencida física',exact:true}).waitFor();assert.equal(await page.getByRole('heading',{name:'Sin fecha física',exact:true}).count(),0);
  fs.mkdirSync('qa/evidencias/release3',{recursive:true});await page.screenshot({path:'qa/evidencias/release3/pendientes.png',fullPage:true});
  await page.goto(base+'/#/espacios');await page.getByRole('heading',{name:'Oficina Bogotá',exact:true}).waitFor();await page.getByText('2 pendientes · 1 completadas',{exact:true}).waitFor();
  await page.getByLabel('Buscar espacio',{exact:true}).fill('bogota');assert.equal(await page.getByRole('heading',{name:'Correos del equipo',exact:true}).count(),0);
  await page.getByRole('button',{name:'Limpiar búsqueda de espacios',exact:true}).click();await page.getByLabel('Tipo de espacios',{exact:true}).selectOption('digital');await page.getByRole('heading',{name:'Correos del equipo',exact:true}).waitFor();assert.equal(await page.getByRole('heading',{name:'Oficina Bogotá',exact:true}).count(),0);
  const archived=(await request('/spaces',{name:'Restauración de ejemplo',type:'fisica'})).space;await request('/spaces/'+archived.id+'/archive',{});
  await page.getByRole('button',{name:'Limpiar búsqueda de espacios',exact:true}).click();await page.getByRole('button',{name:'Ver espacios archivados',exact:true}).click();await page.getByRole('heading',{name:'Restauración de ejemplo',exact:true}).waitFor();await page.getByRole('button',{name:'Restaurar espacio',exact:true}).click();await page.getByText('Espacio restaurado.',{exact:false}).waitFor();await page.getByRole('button',{name:'Ver espacios activos',exact:true}).click();await page.getByRole('heading',{name:'Restauración de ejemplo',exact:true}).waitFor();
  for(const path of ['espacios','pendientes','primeros-pasos']){
   await page.goto(base+'/#/'+path);await page.getByRole('heading',{level:1}).waitFor();
   for(const width of [320,390,768]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Desborde '+path+' '+width);}
   await page.setViewportSize({width:390,height:900});await page.screenshot({path:'qa/evidencias/release3/'+path+'.png',fullPage:true});
  }
  assert.deepEqual(errors,[]);console.log('R3: recorrido guiado con persistencia real y racha; pendientes físicos y digitales, búsquedas sin tildes, filtros de fecha/estado; espacios con contadores, búsqueda, tipo y restauración; sin desbordes 320/390/768. Solo ejemplos locales.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
