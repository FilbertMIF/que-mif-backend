const express = require('express')
const router = express.Router()
const serviceController = require('../controllers/service.controller')

router.get('/', serviceController.getServices)
router.post('/', serviceController.insertService)
router.patch('/:id', serviceController.updateService)
router.delete('/:id', serviceController.deleteService)

module.exports = router