const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validateString } = require('../validate');
const { body, uuid, instant, queryBoolean } = require('../release2-validation');
const { route, problem, transaction } = require('../http');

const router = express.Router();
router.use(requireAuth);

router.get('/', route(async (req, res) => {
  const from = req.query.from === undefined ? null : instant(req.query.from, 'from');
  const to = req.query.to === undefined ? null : instant(req.query.to, 'to');
  if (from && to && from >= to) throw problem(400, 'from debe ser anterior a to.');
  const result = await pool.query('SELECT * FROM shifts WHERE user_id = $1 AND (archived_at IS NOT NULL) = $2 AND ($3::timestamptz IS NULL OR ends_at > $3) AND ($4::timestamptz IS NULL OR starts_at < $4) ORDER BY starts_at, id', [req.userId, queryBoolean(req.query.archived, 'archived'), from, to]);
  res.json({ shifts: result.rows });
}));

async function saveShift(req, res, existingId) {
  const input = body(req.body, ['title', 'starts_at', 'ends_at', 'notes']);
  const shift = await transaction(async client => {
    await client.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [req.userId]);
    let previous = {};
    if (existingId) {
      const found = await client.query('SELECT * FROM shifts WHERE id = $1 AND user_id = $2 AND archived_at IS NULL', [existingId, req.userId]);
      if (!found.rows.length) throw problem(404, 'Turno no encontrado.');
      previous = found.rows[0];
    }
    const title = validateString(input.title === undefined ? previous.title : input.title, 'title', 1, 120);
    const starts = input.starts_at === undefined && previous.starts_at ? previous.starts_at.toISOString() : instant(input.starts_at, 'starts_at');
    const ends = input.ends_at === undefined && previous.ends_at ? previous.ends_at.toISOString() : instant(input.ends_at, 'ends_at');
    const notes = validateString(input.notes === undefined ? previous.notes ?? '' : input.notes, 'notes', 0, 1000);
    if (Date.parse(starts) >= Date.parse(ends)) throw problem(400, 'El final del turno debe ser posterior al inicio.');
    const overlap = await client.query('SELECT id FROM shifts WHERE user_id = $1 AND archived_at IS NULL AND starts_at < $3 AND ends_at > $2 AND ($4::uuid IS NULL OR id <> $4) LIMIT 1', [req.userId, starts, ends, existingId]);
    if (overlap.rows.length) throw problem(409, 'Ya tienes un turno en ese horario.');
    const result = existingId
      ? await client.query('UPDATE shifts SET title = $1, starts_at = $2, ends_at = $3, notes = $4, updated_at = now() WHERE id = $5 AND user_id = $6 RETURNING *', [title, starts, ends, notes, existingId, req.userId])
      : await client.query('INSERT INTO shifts (user_id, title, starts_at, ends_at, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *', [req.userId, title, starts, ends, notes]);
    return result.rows[0];
  });
  res.status(existingId ? 200 : 201).json({ shift });
}

router.post('/', route((req, res) => saveShift(req, res, null)));
router.patch('/:id', route((req, res) => saveShift(req, res, uuid(req.params.id, 'Turno'))));
router.post('/:id/archive', route(async (req, res) => {
  const result = await pool.query('UPDATE shifts SET archived_at = COALESCE(archived_at, now()), updated_at = now() WHERE id = $1 AND user_id = $2 RETURNING *', [uuid(req.params.id, 'Turno'), req.userId]);
  if (!result.rows.length) throw problem(404, 'Turno no encontrado.');
  res.json({ shift: result.rows[0] });
}));

module.exports = router;
