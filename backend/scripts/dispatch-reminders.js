require('dotenv').config();
const { dispatchReminders } = require('../src/modules/reminders/reminder-dispatcher');
const { pool } = require('../src/infrastructure/database/pool');

dispatchReminders().then(result => console.log(JSON.stringify(result))).catch(error => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => pool.end());
