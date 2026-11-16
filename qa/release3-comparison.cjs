const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.BASE_URL||'http://127.0.0.1:3105';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw Error('Solo se permiten datos de demostración en local.');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const cap=await page.request.get(base+'/api/capabilities').then(r=>r.json());assert.equal(cap.email_configured,false);
  const owner=await page.request.post(base+'/api/auth/login',{data:{email:'equipo-r3@example.com',password:'AntiliaLocal2026'}}).then(r=>r.json());assert.ok(owner.token);
  await page.addInitScript(token=>{localStorage.setItem('antilia_token',token);sessionStorage.setItem('antilia_intro_seen','1');},owner.token);
  await page.goto(base+'/#/comparacion');await page.getByRole('heading',{name:'Lo que aprendimos',exact:true}).waitFor();
  await page.getByRole('button',{name:'Registrar protocolo original',exact:true}).click();
  const title='=Demostración local · no es validación real '+Date.now();
  await page.getByLabel('Nombre del protocolo',{exact:true}).fill(title);
  await page.getByLabel('Fecha original de preparación',{exact:true}).fill('2026-10-01');
  await page.getByLabel('Referencia de evidencia del protocolo',{exact:true}).fill('E-DEMO');
  for(let i=1;i<=3;i++){
   await page.getByLabel('Descripción T'+i,{exact:true}).fill(['=Crear un espacio','Guardar una tarea','Revisar el progreso'][i-1]);
   await page.getByLabel('Criterio de éxito T'+i,{exact:true}).fill('La acción queda guardada sin ayuda del equipo.');
  }
  await page.getByRole('button',{name:'Guardar protocolo',exact:true}).click();
  await page.getByRole('heading',{name:title,exact:true}).waitFor();await page.getByText('Base incompleta:',{exact:false}).waitFor();
  async function fillSession(release){
   await page.getByRole('button',{name:'Registrar sesión',exact:true}).click();
   await page.getByLabel('Release',{exact:true}).selectOption(release);
   await page.getByLabel('Código del participante',{exact:true}).fill('P01');
   await page.getByLabel('Fecha real de la sesión',{exact:true}).fill(release==='R1'?'2026-10-10':'2026-10-23');
   await page.getByLabel('Referencia de evidencia de la sesión',{exact:true}).fill('E-DEMO-'+release+'-P01');
   for(const label of ['Pertenece al segmento definido','No es del equipo, compañero de clase, familiar ni amigo','Realizó las tareas sin explicación ni ayuda del equipo','Tenemos permiso para registrar esta evidencia'])await page.getByRole('checkbox',{name:label,exact:true}).check();
   for(let i=1;i<=3;i++){
    await page.getByLabel('Resultado T'+i,{exact:true}).selectOption(release==='R1'&&i===2?'no':'yes');
    await page.getByLabel('Tiempo medido T'+i+' en segundos',{exact:true}).fill(release==='R1'?'60':'30');
   }
   for(let i=1;i<=10;i++)await page.getByLabel('SUS pregunta '+i,{exact:true}).selectOption(release==='R1'?'3':i%2?'5':'1');
   await page.getByText('SUS calculado: '+(release==='R1'?'50':'100')+' puntos',{exact:true}).waitFor();
   await page.getByRole('button',{name:'Guardar sesión',exact:true}).click();
   await page.getByRole('button',{name:'Editar '+release+' P01',exact:true}).waitFor();
  }
  await fillSession('R1');await fillSession('R2');
  await page.getByText('1 participantes repetidos entre ciclos',{exact:true}).waitFor();
  await page.getByText('+50 puntos',{exact:false}).waitFor();
  await page.getByRole('button',{name:'Editar R2 P01',exact:true}).click();
  await page.getByLabel('Tiempo medido T1 en segundos',{exact:true}).fill('20');
  await page.getByRole('button',{name:'Guardar corrección',exact:true}).click();
  await page.getByText('Corrección guardada con historial.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Excluir R2 P01',exact:true}).click();
  await page.getByLabel('Motivo sin datos personales',{exact:true}).fill('Prueba local de exclusión.');
  await page.getByRole('button',{name:'Confirmar exclusión',exact:true}).click();
  await page.getByText('0 participantes repetidos entre ciclos',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Restaurar R2 P01',exact:true}).click();
  await page.getByLabel('Motivo sin datos personales',{exact:true}).fill('Prueba local de restauración.');
  await page.getByRole('button',{name:'Confirmar restauración',exact:true}).click();
  await page.getByText('1 participantes repetidos entre ciclos',{exact:true}).waitFor();
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar comparación CSV',exact:true}).click();
  const csv=fs.readFileSync(await (await download).path(),'utf8');assert.match(csv,/'=Demostración local/);assert.match(csv,/E-DEMO-R2-P01/);assert.match(csv,/5 1 5 1 5 1 5 1 5 1/);assert.ok(!csv.includes('equipo-r3@example.com'));
  for(const width of [320,390,768]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Desborde en '+width);}
  await page.setViewportSize({width:390,height:1000});fs.mkdirSync('qa/evidencias/release3',{recursive:true});await page.screenshot({path:'qa/evidencias/release3/comparacion.png'});
  await page.screenshot({path:'qa/evidencias/release3/comparacion-completa.png',fullPage:true});
  assert.deepEqual(errors,[]);console.log('Comparación R1/R2: protocolo, SUS, repetidos, corrección, exclusión/restauración, CSV seguro y diseño sin desbordes en 320/390/768. Solo datos locales.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
