require('dotenv').config();
const { dispatchReminders } = require('../src/services/reminder-dispatcher');
const { pool } = require('../src/db');

dispatchReminders().then(result => console.log(JSON.stringify(result))).catch(error => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => pool.end());
