const { instant } = require('../../shared/release2-validation');
const { problem } = require('../../shared/http');

function nextDaily(localTime, after = new Date()) {
  if (typeof localTime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d(?::00)?$/.test(localTime)) throw problem(400, 'local_time debe tener formato HH:MM.');
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(after);
  let next = new Date(`${day}T${localTime.slice(0, 5)}:00-05:00`);
  if (next <= after) next = new Date(next.getTime() + 86400000);
  return next.toISOString();
}

function schedule(input) {
  if (input.timezone !== undefined && input.timezone !== 'America/Bogota') throw problem(400, 'Esta versión usa la zona America/Bogota.');
  if (input.schedule_type === 'daily') {
    if (input.scheduled_at !== undefined) throw problem(400, 'Un recordatorio diario usa local_time, no scheduled_at.');
    const next = nextDaily(input.local_time);
    return { schedule_type: 'daily', local_time: input.local_time.slice(0, 5), next_run_at: next };
  }
  if (input.schedule_type !== 'once') throw problem(400, 'schedule_type debe ser once o daily.');
  if (input.local_time !== undefined) throw problem(400, 'Un recordatorio único usa scheduled_at, no local_time.');
  const date = instant(input.scheduled_at, 'scheduled_at');
  if (Date.parse(date) <= Date.now()) throw problem(400, 'scheduled_at debe estar en el futuro.');
  return { schedule_type: 'once', local_time: null, next_run_at: date };
}

module.exports = { nextDaily, schedule };
