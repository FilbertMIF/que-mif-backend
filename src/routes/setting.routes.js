const express = require('express')
const router = express.Router()
const settingController = require('../controllers/setting.controller')

// GET /api/settings - Get all settings
router.get('/', settingController.getAllSettings)

// PATCH /api/settings/:id - Update a specific setting
router.patch('/:id', settingController.updateSetting)

module.exports = router
