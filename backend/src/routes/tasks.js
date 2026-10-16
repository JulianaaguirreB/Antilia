const express = require("express");
const { pool } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { validateString, validateType } = require("../validate");
const { body, uuid, instant, queryText, digitalKind, referenceUrl } = require('../release2-validation');
const { problem, route, transaction } = require('../http');

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    let status = req.query.status;
    if (status !== undefined && !['pendiente', 'en_progreso', 'completada', 'archivada', 'all'].includes(status)) throw problem(400, 'status no válido.');
    if (status === undefined) {
      status = "pendiente";
    }

    let type = req.query.type;
    if (type !== undefined) {
      if (type !== "fisica" && type !== "digital") {
        return res.status(400).json({ error: "type debe ser 'fisica' o 'digital'." });
      }
    }

    let query = "SELECT id, title, type, status, space_id, due_at, digital_kind, reference_url, updated_at, created_at, completed_at FROM tasks WHERE user_id = $1";
    const params = [req.userId];
    let paramIndex = 2;

    if (status !== "all") {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    } else {
      query += " AND status <> 'archivada'";
    }
    
    if (type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(type);
    }

    if (req.query.space_id !== undefined) {
      params.push(uuid(req.query.space_id, 'Espacio'));
      query += ` AND space_id = $${paramIndex++}`;
    }
    const search = queryText(req.query.search, 'search');
    if (search) {
      params.push(search);
      query += ` AND strpos(lower(title), lower($${paramIndex++})) > 0`;
    }
    query += " ORDER BY created_at ASC, id ASC";

    const result = await pool.query(query, params);
    res.json({ tasks: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const input = body(req.body, ['title', 'type', 'space_id', 'due_at', 'digital_kind', 'reference_url']);
    const title = validateString(input.title, "title", 1, 120);
    const type = validateType(input.type);
    const spaceId = input.space_id == null ? null : uuid(input.space_id, 'Espacio');
    const dueAt = input.due_at == null ? null : instant(input.due_at, 'due_at');
    const kind = digitalKind(input.digital_kind ?? 'general');
    if (type === 'fisica' && kind !== 'general') throw problem(400, 'Los correos y archivos deben ser digitales.');
    const reference = input.reference_url === undefined ? null : referenceUrl(input.reference_url);
    const task = await transaction(async client => {
      await validateSpace(client, spaceId, req.userId, type);
      const result = await client.query('INSERT INTO tasks (user_id, title, type, space_id, due_at, digital_kind, reference_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.userId, title, type, spaceId, dueAt, kind, reference]);
      return result.rows[0];
    });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

async function validateSpace(client, spaceId, userId, type) {
  if (!spaceId) return;
  const space = await client.query('SELECT type, archived_at FROM spaces WHERE id = $1 AND user_id = $2 FOR UPDATE', [spaceId, userId]);
  if (!space.rows.length || space.rows[0].archived_at) throw problem(404, 'Espacio activo no encontrado.');
  if (space.rows[0].type !== type) throw problem(400, 'El tipo de tarea debe coincidir con el espacio.');
}

router.patch('/:id', route(async (req, res) => {
  const id = uuid(req.params.id, 'Tarea');
  const input = body(req.body, ['title', 'type', 'space_id', 'due_at', 'digital_kind', 'reference_url', 'status']);
  const task = await transaction(async client => {
    const found = await client.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2 AND status IN ('pendiente','en_progreso') FOR UPDATE", [id, req.userId]);
    if (!found.rows.length) throw problem(404, 'Tarea pendiente no encontrada.');
    const previous = found.rows[0];
    const title = input.title === undefined ? previous.title : validateString(input.title, 'title', 1, 120);
    const type = input.type === undefined ? previous.type : validateType(input.type);
    const spaceId = input.space_id === undefined ? previous.space_id : input.space_id === null ? null : uuid(input.space_id, 'Espacio');
    const dueAt = input.due_at === undefined ? previous.due_at : input.due_at === null ? null : instant(input.due_at, 'due_at');
    const kind = input.digital_kind === undefined ? previous.digital_kind : digitalKind(input.digital_kind);
    const reference = input.reference_url === undefined ? previous.reference_url : referenceUrl(input.reference_url);
    const status = input.status === undefined ? previous.status : input.status;
    if (!['pendiente', 'en_progreso'].includes(status)) throw problem(400, 'Usa la acción completar o archivar para cerrar una tarea.');
    if (type === 'fisica' && kind !== 'general') throw problem(400, 'Los correos y archivos deben ser digitales.');
    await validateSpace(client, spaceId, req.userId, type);
    const result = await client.query('UPDATE tasks SET title = $1, type = $2, space_id = $3, due_at = $4, digital_kind = $5, reference_url = $6, status = $7, updated_at = now() WHERE id = $8 AND user_id = $9 RETURNING *', [title, type, spaceId, dueAt, kind, reference, status, id, req.userId]);
    return result.rows[0];
  });
  res.json({ task });
}));

router.post('/:id/archive', route(async (req, res) => {
  const result = await pool.query("UPDATE tasks SET status = 'archivada', updated_at = now() WHERE id = $1 AND user_id = $2 AND completed_at IS NULL RETURNING *", [uuid(req.params.id, 'Tarea'), req.userId]);
  if (!result.rows.length) throw problem(404, 'Tarea no encontrada o ya está completada.');
  res.json({ task: result.rows[0] });
}));

router.patch("/:id/complete", async (req, res, next) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id)) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const taskResult = await client.query(
      "UPDATE tasks SET status = 'completada', completed_at = now(), updated_at = now() WHERE id = $1 AND user_id = $2 AND status IN ('pendiente','en_progreso') RETURNING *",
      [req.params.id, req.userId]
    );

    if (taskResult.rows.length === 0) {
      await client.query("ROLLBACK").catch(() => {});
      return res.status(404).json({ error: "Tarea no encontrada o ya estaba completada." });
    }

    const streak = await updateStreakOnCompletion(client, req.userId);

    await client.query("COMMIT");
    res.json({ task: taskResult.rows[0], streak });
  } catch (err) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    next(err);
  } finally {
    if (client) client.release();
  }
});

async function updateStreakOnCompletion(client, userId) {
  const current = await client.query(
    "SELECT current_streak, best_streak, (now() AT TIME ZONE 'America/Bogota')::date - last_active_date AS diff FROM streaks WHERE user_id = $1 FOR UPDATE",
    [userId]
  );
  const row = current.rows[0] || { current_streak: 0, best_streak: 0, diff: null };

  let newStreak = row.current_streak;

  if (row.diff === null) {
    newStreak = 1;
  } else {
    const diff = row.diff;

    if (diff === 0) {
      newStreak = row.current_streak;
    } else if (diff === 1) {
      newStreak = row.current_streak + 1;
    } else {
      newStreak = 1;
    }
  }

  const newBest = Math.max(newStreak, row.best_streak);

  const updated = await client.query(
    `INSERT INTO streaks (user_id, current_streak, best_streak, last_active_date)
     VALUES ($1, $2, $3, (now() AT TIME ZONE 'America/Bogota')::date)
     ON CONFLICT (user_id)
     DO UPDATE SET current_streak = $2, best_streak = $3, last_active_date = (now() AT TIME ZONE 'America/Bogota')::date
     RETURNING current_streak, best_streak, last_active_date`,
    [userId, newStreak, newBest]
  );

  return updated.rows[0];
}

module.exports = router;
