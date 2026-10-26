const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('../frontend/node_modules/typescript');
function load(file){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports,require,Math,Number});return exports;}
const {measureRectangle}=load('frontend/src/features/measurements/lib/photoCalibration.ts');
const {placeItem,fits}=load('frontend/src/features/desk/lib/layout.ts');
const photo=([x,y])=>({x:(5*x+2*y+100)/(1+.002*x+.003*y),y:(.4*x+4*y+100)/(1+.002*x+.003*y)});
const reference=[[40,20],[61,20],[61,49.7],[40,49.7]],table=[[0,0],[120,0],[120,70],[0,70]];
const points=[...reference,...table].map(photo);
const result=measureRectangle(points,21,29.7);assert.equal(result.width,120);assert.equal(result.depth,70);
assert.equal(measureRectangle([...points.slice(0,2),points[3],points[2],...points.slice(4)],21,29.7),null);
assert.equal(measureRectangle(points,0,29.7),null);assert.equal(measureRectangle(points.slice(1),21,29.7),null);
const degenerate=points.map(()=>({x:10,y:10}));assert.equal(measureRectangle(degenerate,21,29.7),null);
const corner={model:'esquina',width_cm:180,depth_cm:160,layout:[],name:'Prueba'};
const card={id:'test',kind:'personalizado',x:80,y:80,width_cm:30,depth_cm:20};assert.equal(fits(corner,card),false);
for(let x=-20;x<=120;x+=10)for(let y=-20;y<=120;y+=10){const item=placeItem(corner,card,x,y);assert.ok(fits(corner,item));assert.ok(item.x>=5&&item.x<=95&&item.y>=5&&item.y<=95);}
assert.equal(fits(corner,{...card,width_cm:300,depth_cm:300}),false);
console.log('Geometría: perspectiva recupera 120 × 70 cm; rechaza esquinas cruzadas y referencias inválidas; tarjetas permanecen dentro de la mesa en L.');
