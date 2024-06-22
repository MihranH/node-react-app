const router = require('express').Router();
const authRouter = require('./auth');

router.use('/api', authRouter);

module.exports = router;