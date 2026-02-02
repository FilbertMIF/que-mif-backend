const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard.controller')

router.get('/kpi', dashboardController.getKPIDashboard)
router.get('/counter/:counterId', dashboardController.getCounterInfo)
router.get('/counters', dashboardController.getAllCountersByBranch)

module.exports = router
