import {spawnSync} from 'node:child_process';
for(const file of ['qa/desk3d.cjs','qa/lumi.cjs']){
 const result=spawnSync(process.execPath,[file],{stdio:'inherit',env:process.env});
 if(result.status!==0)process.exit(result.status||1);
}
