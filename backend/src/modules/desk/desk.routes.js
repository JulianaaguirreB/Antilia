const express=require('express');
const {pool}=require('../../infrastructure/database/pool');
const {requireAuth}=require('../../shared/middleware/auth');
const {route}=require('../../shared/http');
const {validateDesk}=require('./desk.validation');
const router=express.Router();
router.use(requireAuth);
router.get('/',route(async(req,res)=>{const result=await pool.query('SELECT name,width_cm,depth_cm,height_cm,model,layout,updated_at FROM desks WHERE user_id=$1',[req.userId]);res.json({desk:result.rows[0]||null});}));
router.put('/',route(async(req,res)=>{
 const input=validateDesk(req.body);
 const result=await pool.query('INSERT INTO desks(user_id,name,width_cm,depth_cm,layout,model,height_cm) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(user_id) DO UPDATE SET name=EXCLUDED.name,width_cm=EXCLUDED.width_cm,depth_cm=EXCLUDED.depth_cm,layout=EXCLUDED.layout,model=EXCLUDED.model,height_cm=EXCLUDED.height_cm,updated_at=now() RETURNING name,width_cm,depth_cm,height_cm,model,layout,updated_at',[req.userId,input.name,input.width_cm,input.depth_cm,JSON.stringify(input.layout),input.model,input.height_cm]);
 res.json({desk:result.rows[0]});
}));
module.exports=router;
