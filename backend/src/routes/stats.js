const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { route, problem } = require('../http');

const router = express.Router();
router.use(requireAuth);
router.get('/', route(async (req, res) => {
  const days = req.query.days === undefined ? 7 : Number(req.query.days);
  if (!Number.isInteger(days) || days < 1 || days > 90 || (req.query.days !== undefined && !/^\d+$/.test(req.query.days))) throw problem(400, 'days debe ser un entero entre 1 y 90.');
  const result = await pool.query(`WITH days AS (
    SELECT ((now() AT TIME ZONE 'America/Bogota')::date - i)::date AS day FROM generate_series(0, $2::int - 1) AS i
  ), totals AS (
    SELECT count(*) FILTER (WHERE status IN ('pendiente','en_progreso'))::int AS pending,
    count(*) FILTER (WHERE status = 'completada')::int AS completed,
    count(*) FILTER (WHERE status = 'archivada')::int AS archived FROM tasks WHERE user_id = $1
  ) SELECT (SELECT row_to_json(totals) FROM totals) AS totals,
  (SELECT json_agg(d ORDER BY day) FROM (
    SELECT days.day, count(tasks.id)::int AS completed,
    count(tasks.id) FILTER (WHERE type = 'fisica')::int AS physical,
    count(tasks.id) FILTER (WHERE type = 'digital')::int AS digital
    FROM days LEFT JOIN tasks ON tasks.user_id = $1 AND tasks.status = 'completada' AND (tasks.completed_at AT TIME ZONE 'America/Bogota')::date = days.day GROUP BY days.day
  ) d) AS daily`, [req.userId, days]);
  res.json({ timezone: 'America/Bogota', days, ...result.rows[0] });
}));
module.exports = router;
