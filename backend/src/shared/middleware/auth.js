const jwt = require("jsonwebtoken");
const { pool } = require('../../infrastructure/database/pool');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Falta el token de acceso (Authorization: Bearer <token>)." });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!payload || typeof payload !== 'object' || typeof payload.sub !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.sub)) throw new Error('Invalid subject');
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o vencido." });
  }
  try {
    const result = await pool.query('SELECT token_version FROM users WHERE id = $1', [payload.sub]);
    if (!result.rows.length || result.rows[0].token_version !== (payload.version ?? 0)) return res.status(401).json({ error: 'Tu sesión venció. Inicia sesión de nuevo.' });
    req.userId = payload.sub;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAuth };
