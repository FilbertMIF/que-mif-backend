const express = require('express')
const router = express.Router()
const ticketController = require('../controllers/ticket.controller')

router.post('/', ticketController.insertTicket)
router.get('/', ticketController.getTickets)
router.get('/settlement', ticketController.getTicketsSettlement)

router.post('/:id/call', ticketController.callTicket)
router.post('/:id/noshow', ticketController.noShowTicket)
router.post('/:id/assign', ticketController.assignTicket)
router.post('/:id/hold', ticketController.holdTicket)
router.post('/:id/cancel', ticketController.cancelTicket)
router.post('/:id/complete', ticketController.completeTicket)

module.exports = router
