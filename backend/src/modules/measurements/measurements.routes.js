const express = require('express');
const { pool } = require('../../infrastructure/database/pool');
const { requireAuth } = require('../../shared/middleware/auth');
const { body } = require('../../shared/release2-validation');
const { route, problem } = require('../../shared/http');
const { validateString } = require('../../shared/validate');
const router = express.Router();
router.use(requireAuth);
router.get('/', route(async (req, res) => {
  const result = await pool.query('SELECT * FROM measurements WHERE user_id=$1 ORDER BY created_at DESC,id DESC LIMIT 100', [req.userId]);
  res.json({ measurements: result.rows });
}));
router.post('/', route(async (req, res) => {
  const input = body(req.body, ['search_minutes','misplaced_items','clear_width_cm','notes']);
  for (const [key,max] of [['search_minutes',1440],['misplaced_items',10000]]) {
    if (!Number.isInteger(input[key]) || input[key]<0 || input[key]>max) throw problem(400, `${key} debe ser un entero entre 0 y ${max}.`);
  }
  const width = input.clear_width_cm ?? null;
  if (width !== null && (typeof width !== 'number' || !Number.isFinite(width) || width<=0 || width>10000)) throw problem(400,'El ancho debe estar entre 0 y 10000 cm, sin incluir cero.');
  const notes = validateString(input.notes ?? '', 'notes',0,500);
  const result = await pool.query('INSERT INTO measurements(user_id,search_minutes,misplaced_items,clear_width_cm,notes) VALUES($1,$2,$3,$4,$5) RETURNING *',[req.userId,input.search_minutes,input.misplaced_items,width,notes]);
  res.status(201).json({measurement:result.rows[0]});
}));
module.exports = router;
