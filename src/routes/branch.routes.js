const express = require('express')
const router = express.Router()
const branchController = require('../controllers/branch.controller')

// GET /api/branches - Get all branches with pagination
router.get('/', branchController.getBranches)

module.exports = router
