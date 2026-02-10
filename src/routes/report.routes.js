const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report.controller')

// Daily report
router.get('/daily', reportController.getDailyReport)

// Monthly report
router.get('/monthly', reportController.getMonthlyReport)

module.exports = router
