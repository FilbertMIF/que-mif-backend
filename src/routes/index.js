const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth.routes'))
router.use('/services', require('./service.routes'))
router.use('/counters', require('./counter.routes'))
router.use('/tickets', require('./ticket.routes'))
router.use('/dashboard', require('./dashboard.routes'))
router.use('/settings', require('./setting.routes'))
router.use('/reports', require('./report.routes'))
router.use('/users', require('./user.routes'))
router.use('/branches', require('./branch.routes'))

module.exports = router