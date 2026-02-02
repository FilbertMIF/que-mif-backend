const express = require('express')
const router = express.Router()

router.use('/services', require('./service.routes'))
router.use('/counters', require('./counter.routes'))
router.use('/tickets', require('./ticket.routes'))
router.use('/dashboard', require('./dashboard.routes'))

module.exports = router