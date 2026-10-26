const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.addInitScript(()=>localStorage.setItem('antilia_token','qa-local'));
let streak;let mutations=0;
await page.route('**/api/**',route=>{if(route.request().method()!=='GET')mutations++;const url=new URL(route.request().url());return route.fulfill({json:url.pathname.endsWith('/auth/me')?{user:{id:'qa',name:'Prueba',email:'qa@example.com'}}:url.pathname.endsWith('/streak')?{streak}:{tasks:[],spaces:[],reminders:[]}})});
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota'}).format(new Date());
const yesterday=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota'}).format(new Date(Date.now()-86400000));
fs.mkdirSync('qa/evidencias/lumi',{recursive:true});
for(const [state,date,days,animation] of [['lit',today,2,'lumi-dance'],['radiant',today,7,'lumi-dance'],['waiting',yesterday,2,'lumi-sigh'],['sleeping','2020-01-01',2,'lumi-sigh']]){
streak={current_streak:days,best_streak:7,last_active_date:date};await page.goto('http://localhost:3102/#/progreso');await page.reload();const mascot=page.locator('[data-streak-state]');await mascot.waitFor();assert.equal(await mascot.getAttribute('data-streak-state'),state);assert.match(await mascot.innerText(),/Lumi/i);assert.equal(await page.locator('.star-body').evaluate(el=>getComputedStyle(el).animationName),animation);
assert.equal(await page.getByRole('button',{name:'✦ Encender mi racha',exact:true}).count(),['waiting','sleeping'].includes(state)?1:0);
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`qa/evidencias/lumi/${state}.png`,fullPage:true});
if(state==='sleeping'){assert.match(await mascot.innerText(),/0 días/);await page.getByRole('button',{name:'✦ Encender mi racha',exact:true}).click();assert.equal(new URL(page.url()).hash,'#/inicio');}
}
await page.goto('http://localhost:3102/#/progreso');await page.locator('.star-body').waitFor();await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.star-body').evaluate(el=>getComputedStyle(el).animationName),'none');assert.equal(mutations,0);console.log('Lumi: cuatro estados, animaciones, racha vencida, acción sin cambios de datos, móvil y movimiento reducido correctos.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});


