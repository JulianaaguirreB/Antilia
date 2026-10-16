const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validateString, validateType } = require('../validate');
const { body, uuid, queryBoolean } = require('../release2-validation');
const { route, problem, transaction } = require('../http');

const router = express.Router();
router.use(requireAuth);

router.get('/', route(async (req, res) => {
  const archived = queryBoolean(req.query.archived, 'archived');
  const result = await pool.query('SELECT * FROM spaces WHERE user_id = $1 AND (archived_at IS NOT NULL) = $2 ORDER BY created_at, id', [req.userId, archived]);
  res.json({ spaces: result.rows });
}));

router.post('/', route(async (req, res) => {
  const input = body(req.body, ['name', 'type', 'description']);
  const result = await pool.query('INSERT INTO spaces (user_id, name, type, description) VALUES ($1, $2, $3, $4) RETURNING *', [req.userId, validateString(input.name, 'name', 1, 100), validateType(input.type), validateString(input.description ?? '', 'description', 0, 1000)]);
  res.status(201).json({ space: result.rows[0] });
}));

router.get('/:id', route(async (req, res) => {
  const result = await pool.query('SELECT * FROM spaces WHERE id = $1 AND user_id = $2', [uuid(req.params.id, 'Espacio'), req.userId]);
  if (!result.rows.length) throw problem(404, 'Espacio no encontrado.');
  res.json({ space: result.rows[0] });
}));

router.patch('/:id', route(async (req, res) => {
  const id = uuid(req.params.id, 'Espacio');
  const input = body(req.body, ['name', 'description']);
  const values = [];
  const assignments = Object.keys(input).map(key => {
    values.push(validateString(input[key], key, key === 'name' ? 1 : 0, key === 'name' ? 100 : 1000));
    return `${key} = $${values.length}`;
  });
  values.push(id, req.userId);
  const result = await pool.query(`UPDATE spaces SET ${assignments.join(', ')}, updated_at = now() WHERE id = $${values.length - 1} AND user_id = $${values.length} AND archived_at IS NULL RETURNING *`, values);
  if (!result.rows.length) throw problem(404, 'Espacio activo no encontrado.');
  res.json({ space: result.rows[0] });
}));

router.post('/:id/archive', route(async (req, res) => {
  const id = uuid(req.params.id, 'Espacio');
  const space = await transaction(async client => {
    const found = await client.query('SELECT * FROM spaces WHERE id = $1 AND user_id = $2 FOR UPDATE', [id, req.userId]);
    if (!found.rows.length) throw problem(404, 'Espacio no encontrado.');
    const pending = await client.query("SELECT 1 FROM tasks WHERE space_id = $1 AND user_id = $2 AND status IN ('pendiente','en_progreso') LIMIT 1", [id, req.userId]);
    if (pending.rows.length) throw problem(409, 'Completa, archiva o mueve las tareas pendientes antes de archivar el espacio.');
    const result = await client.query('UPDATE spaces SET archived_at = COALESCE(archived_at, now()), updated_at = now() WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  });
  res.json({ space });
}));

module.exports = router;
