const express = require('express')
const router = express.Router()
const settingController = require('../controllers/setting.controller')

router.get('/', settingController.getSetting)
router.patch('/:id', settingController.updateSetting)

module.exports = router