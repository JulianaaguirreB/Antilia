const path=require('node:path');
const {spawnSync}=require('node:child_process');

if(process.env.VERCEL_ENV==='production'){
  const result=spawnSync(process.execPath,['src/migrate.js'],{cwd:path.resolve(__dirname,'..'),env:process.env,stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
}else{
  console.log('Las vistas previas no migran la base de producción.');
}
