const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth.routes'))
router.use('/services', require('./service.routes'))
router.use('/counters', require('./counter.routes'))
router.use('/tickets', require('./ticket.routes'))
router.use('/dashboard', require('./dashboard.routes'))
router.use('/setting', require('./setting.routes'))

module.exports = router