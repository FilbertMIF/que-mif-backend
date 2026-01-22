const express = require('express')
const router = express.Router()
const counterController = require('../controllers/counter.controller')

router.get('/', counterController.getCounters)
router.post('/', counterController.insertCounter)
router.patch('/:id', counterController.updateCounter)
router.delete('/:id', counterController.deleteCounter)

module.exports = router