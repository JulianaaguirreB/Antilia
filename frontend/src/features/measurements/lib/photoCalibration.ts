export type Point={x:number;y:number};
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
export function validQuad(points:Point[]) {
  if(points.length!==4||points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))return false;
  const cross=points.map((a,i)=>{const b=points[(i+1)%4],c=points[(i+2)%4];return (b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x);});
  return points.every((p,i)=>distance(p,points[(i+1)%4])>=10)&&(cross.every(n=>n>1)||cross.every(n=>n< -1));
}
function solve(matrix:number[][]) {
  for(let i=0;i<8;i++){
    let pivot=i;for(let j=i+1;j<8;j++)if(Math.abs(matrix[j][i])>Math.abs(matrix[pivot][i]))pivot=j;
    [matrix[i],matrix[pivot]]=[matrix[pivot],matrix[i]];
    const divisor=matrix[i][i];if(Math.abs(divisor)<1e-10)return null;
    for(let k=i;k<=8;k++)matrix[i][k]/=divisor;
    for(let j=0;j<8;j++)if(j!==i){const factor=matrix[j][i];for(let k=i;k<=8;k++)matrix[j][k]-=matrix[i][k]*factor;}
  }
  return matrix.map(row=>row[8]);
}
export function measureRectangle(points:Point[],referenceWidth:number,referenceDepth:number):{width:number;depth:number}|null {
  if(points.length!==8||![referenceWidth,referenceDepth].every(n=>Number.isFinite(n)&&n>=1&&n<=1000)||!validQuad(points.slice(0,4))||!validQuad(points.slice(4)))return null;
  const scale=Math.max(1,...points.flatMap(p=>[Math.abs(p.x),Math.abs(p.y)]));
  const target=[[0,0],[referenceWidth,0],[referenceWidth,referenceDepth],[0,referenceDepth]];
  const matrix=points.slice(0,4).flatMap((p,i)=>{const x=p.x/scale,y=p.y/scale,[u,v]=target[i];return [[x,y,1,0,0,0,-u*x,-u*y,u],[0,0,0,x,y,1,-v*x,-v*y,v]];});
  const h=solve(matrix);if(!h)return null;
  const projected=points.slice(4).map(p=>{const x=p.x/scale,y=p.y/scale,d=h[6]*x+h[7]*y+1;return {x:(h[0]*x+h[1]*y+h[2])/d,y:(h[3]*x+h[4]*y+h[5])/d,d};});
  if(projected.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)||Math.abs(p.d)<1e-6)||!projected.every(p=>Math.sign(p.d)===Math.sign(projected[0].d)))return null;
  const sides=projected.map((p,i)=>distance(p,projected[(i+1)%4]));
  if(sides.some(n=>n<1||n>1000)||Math.abs(sides[0]-sides[2])/Math.max(sides[0],sides[2])>.2||Math.abs(sides[1]-sides[3])/Math.max(sides[1],sides[3])>.2)return null;
  const a={x:projected[1].x-projected[0].x,y:projected[1].y-projected[0].y},b={x:projected[3].x-projected[0].x,y:projected[3].y-projected[0].y};
  if(Math.abs(a.x*b.x+a.y*b.y)/(sides[0]*sides[3])>.25)return null;
  return {width:Math.round((sides[0]+sides[2])*5)/10,depth:Math.round((sides[1]+sides[3])*5)/10};
}
