const {chromium}=require('playwright');const fs=require('node:fs');const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://localhost:3102';
const user={id:'diseno',name:'Juliana Prueba',email:'prueba@example.com',created_at:'2026-10-01T12:00:00Z',email_verified_at:'2026-10-01T12:00:00Z'};
const tasks=[{id:'11111111-1111-4111-8111-111111111111',title:'Darle un lugar a mis libretas',type:'fisica',status:'pendiente',digital_kind:'general',created_at:'2026-10-23T12:00:00Z',completed_at:null,reference_url:null,due_at:null},{id:'22222222-2222-4222-8222-222222222222',title:'Revisar la propuesta del equipo',type:'digital',status:'pendiente',digital_kind:'correo',created_at:'2026-10-23T12:00:00Z',completed_at:null,reference_url:null,due_at:null}];
async function mock(page){await page.route('**/api/**',route=>{const path=new URL(route.request().url()).pathname;const data=path.includes('/auth/me')?{user}:path.includes('/tasks')?{tasks}:path.includes('/streak')?{streak:{current_streak:3,best_streak:3,last_active_date:'2026-10-23'}}:path.includes('/spaces')?{spaces:[]}:path.includes('/desk')?{desk:null}:path.includes('/measurements')?{measurements:[]}:path.includes('/shifts')?{shifts:[]}:path.includes('/reminders')?{reminders:[],email_configured:true}:path.includes('/mailbox/status')?{configured:true,connected:false,connection:null}:path.includes('/mailbox/messages')?{messages:[],has_more:false,counts:[]}:{email_configured:true,scheduler_configured:true};return route.fulfill({json:data});});}

(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{localStorage.setItem('antilia_token','qa');sessionStorage.setItem('antilia_intro_seen','1');});await mock(page);
  let checked=0;
  for(const path of ['espacios','digital','correos','archivos','kanban','archivadas','mi-escritorio','medir-espacio','turnos','recordatorios','metricas','estado','sesion','privacidad']) {
   await page.goto(base+'/#/'+path);await page.getByRole('heading',{level:1}).waitFor();
   const home=page.getByRole('button',{name:'Ir a inicio',exact:true});
   if(await home.count()) {await home.click();await page.waitForURL('**/#/inicio');checked++;}
  }
  await page.goto(base+'/#/inicio');await page.getByRole('heading',{level:1}).waitFor();
  await page.getByRole('navigation').getByRole('button',{name:'Espacios',exact:true}).click();await page.waitForURL('**/#/espacios');
  await page.getByRole('navigation').getByRole('button',{name:'Correos y archivos',exact:true}).click();await page.waitForURL('**/#/digital');
  await page.getByRole('button',{name:'Volver',exact:true}).click();await page.waitForURL('**/#/espacios');
  await page.goBack();await page.waitForURL('**/#/inicio');
  await page.getByRole('navigation').getByRole('button',{name:'Perfil',exact:true}).click();await page.waitForURL('**/#/perfil');
  await page.getByRole('button',{name:'Cerrar Sesión',exact:true}).click();await page.getByRole('alertdialog').waitFor();await page.keyboard.press('Escape');assert.equal(await page.getByRole('alertdialog').count(),0);
  await page.getByRole('navigation').getByRole('button',{name:'Inicio',exact:true}).click();await page.waitForURL('**/#/inicio');
  await page.evaluate(()=>sessionStorage.setItem('antilia_welcome_email','failed'));
  await page.route('**/api/auth/welcome-email',route=>route.fulfill({json:{welcome_email:'sent'}}));
  await page.reload();await page.getByRole('button',{name:'Reintentar correo',exact:true}).click();await page.getByText('Tu cuenta está lista. Enviamos una bienvenida a tu correo; revisa también Spam.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Entendido',exact:true}).click();assert.equal(await page.getByRole('region',{name:'Correo de bienvenida'}).count(),0);
  assert.deepEqual(errors,[]);
  console.log(checked+' accesos superiores llevan a Inicio; Volver y el historial recorren pantallas; Escape cancela cerrar sesión.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});

