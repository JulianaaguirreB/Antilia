const express = require('express');
const crypto = require('crypto');
const { route, problem } = require('../http');
const { dispatchReminders } = require('../services/reminder-dispatcher');

const router = express.Router();
router.post('/reminders/dispatch', route(async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) throw problem(503, 'El programador de recordatorios no está configurado.');
  const expected = crypto.createHash('sha256').update(`Bearer ${secret}`).digest();
  const actual = crypto.createHash('sha256').update(req.headers.authorization || '').digest();
  if (!crypto.timingSafeEqual(expected, actual)) throw problem(401, 'Acceso no autorizado.');
  res.json(await dispatchReminders());
}));
module.exports = router;
