const express = require('express')
const router = express.Router()
const controller = require('../controllers/queue.controller')

// Services
router.get('/services', controller.getServices)
router.post('/services', controller.insertService)
router.patch('/services/:id', controller.updateService)
router.delete('/services/:id', controller.deleteService)

// Counters
router.get('/counters', controller.getCounters)
router.post('/counters', controller.insertCounter)
router.patch('/counters/:id', controller.updateCounter)
router.delete('/counters/:id', controller.deleteCounter)

// Tickets
router.post('/tickets', controller.insertTicket)
router.get('/tickets', controller.getTickets)

// CS Actions
router.get('/tickets/:id/call', controller.callTicket)
router.post('/tickets/:id/assign', controller.assignTicket)
router.post('/tickets/:id/hold', controller.holdTicket)
router.post('/tickets/:id/cancel', controller.cancelTicket)
router.get('/tickets/:id/complete', controller.completeTicket)
module.exports = router
