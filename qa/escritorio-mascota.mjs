import {chromium,devices} from 'playwright';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const base=process.env.BASE_URL||'http://localhost:3102';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Solo se ejecuta en la vista local.');
const browser=await chromium.launch();
try{
 const context=await browser.newContext({...devices['iPhone 13']});
 const response=await context.request.post(base+'/api/auth/register',{data:{name:'Astra prueba',email:`astra-${Date.now()}@example.com`,password:'PruebaAstra2026'}});
 const {token}=await response.json();
 await context.addInitScript(value=>localStorage.setItem('antilia_token',value),token);
 const page=await context.newPage();
 await page.goto(base+'/#/mi-escritorio');
 await page.getByLabel('Nombre del escritorio',{exact:true}).fill('Mi escritorio guardado');
 await page.getByLabel('Ancho en cm',{exact:true}).fill('140');
 await page.getByLabel('Posición horizontal:',{exact:false}).fill('70');
 await page.getByRole('button',{name:'Guardar escritorio',exact:true}).click();
 await page.getByText('Escritorio guardado en tu cuenta. Lo encontrarás al volver a entrar.',{exact:true}).waitFor();
 await page.reload();
 assert.equal(await page.getByLabel('Nombre del escritorio',{exact:true}).inputValue(),'Mi escritorio guardado');
 assert.equal(await page.getByLabel('Ancho en cm',{exact:true}).inputValue(),'140');
 assert.equal(await page.getByLabel('Posición horizontal:',{exact:false}).inputValue(),'70');
 await page.getByRole('button',{name:'Guardar escritorio',exact:true}).click();
 await page.getByText('Escritorio guardado en tu cuenta. Lo encontrarás al volver a entrar.',{exact:true}).waitFor();
 mkdirSync('qa/evidencias/astra',{recursive:true});
 await page.screenshot({path:'qa/evidencias/astra/escritorio.png',fullPage:true});
 console.log('PASA: dimensiones, distribución, recarga y segundo guardado.');
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const yesterday=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(Date.parse(today+'T12:00:00-05:00')-86400000));
 for(const [state,current,last] of [['sleeping',0,null],['waiting',3,yesterday],['lit',3,today],['radiant',7,today]]){
   await page.route('**/api/streak',route=>route.fulfill({json:{streak:{current_streak:current,best_streak:7,last_active_date:last}}}));
   await page.goto(base+'/#/progreso');await page.reload();
   await page.locator(`[data-streak-state="${state}"]:not(.is-compact)`).waitFor();
   await page.screenshot({path:`qa/evidencias/astra/${state}.png`,fullPage:true});
   await page.unroute('**/api/streak');
 }
 console.log('PASA: Astra apagada, pendiente, encendida y dorada según fecha y racha simuladas.');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.star-body').evaluate(el=>getComputedStyle(el).animationName),'none');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 console.log('PASA: movimiento reducido y pantalla móvil sin desborde.');
}finally{await browser.close();}
