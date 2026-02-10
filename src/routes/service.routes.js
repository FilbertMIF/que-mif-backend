const express = require('express')
const router = express.Router()
const serviceController = require('../controllers/service.controller')

router.get('/', serviceController.getServices)
router.post('/', serviceController.insertService)
router.patch('/:id', serviceController.updateService)
router.delete('/:id', serviceController.deleteService)
router.get('/branch/:branchId', serviceController.getBranchServices)
router.put('/branch/:branchId', serviceController.updateBranchService)

module.exports = router