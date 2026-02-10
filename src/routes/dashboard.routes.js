const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard.controller')

router.get('/kpi', dashboardController.getKPIDashboard)
router.get('/counter/:counterId', dashboardController.getCounterInfo)
router.get('/counters', dashboardController.getAllCountersByBranch)
router.get('/hourly', dashboardController.getHourlyStats)
router.get('/services', dashboardController.getServiceStats)

module.exports = router
