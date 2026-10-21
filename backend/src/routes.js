const router = require("express").Router();

router.use("/auth", require("./modules/auth/auth.routes"));
router.use("/tasks", require("./modules/tasks/tasks.routes"));
router.use("/streak", require("./modules/streak/streak.routes"));
router.use('/spaces', require('./modules/spaces/spaces.routes'));
router.use('/shifts', require('./modules/shifts/shifts.routes'));
router.use('/stats', require('./modules/stats/stats.routes'));
router.use('/measurements', require('./modules/measurements/measurements.routes'));
router.use('/desk', require('./modules/desk/desk.routes'));
router.use('/reminders', require('./modules/reminders/reminders.routes'));
router.use('/email-verification', require('./modules/auth/email-verification.routes'));
router.use('/password-reset', require('./modules/auth/password-reset.routes'));
router.use('/internal', require('./modules/reminders/internal.routes'));

module.exports = router;
