const response = require('../utils/response')
const { poolPromise } = require('../config/db')
const { emitDisplayUpdate } = require('../socket')
const { logActivity } = require('../utils/activityLogger')
const QRCode = require('qrcode')

// Tickets
exports.insertTicket = async (req, res) => {
    const {
        ServiceID,
        PlateNumber,
        AgreementNo,
        CustomerName,
        BranchIDLogin,
        NPKLogin,
    } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('ServiceID', ServiceID)
        request.input('BranchID', BranchIDLogin)
        request.input('PlateNumber', PlateNumber || null)
        request.input('AgreementNo', AgreementNo || null)
        request.input('CustomerName', CustomerName || null)

        const result = await request.execute('sp_QueMIF_InsertTicket')
        const TicketID = result.recordsets[0][0].TicketID
        const TicketNumber = result.recordsets[0][0].TicketNumber

        emitDisplayUpdate(BranchIDLogin, {
            action: 'display-update',
        })

        logActivity({
            Action: 'INSERT_TICKET',
            Entity: 'TICKET',
            EntityID: TicketID,
            BranchIDLogin,
            NPKLogin,
            Payload: req.body
        })

        const url = `http://localhost:3000/customer/${TicketID}`
        const QrCode = await QRCode.toDataURL(url)

        response.success(res, {
            TicketID,
            TicketNumber,
            QrCode
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.getTickets = async (req, res) => {
    const {
        CurrentPage = 1,
        PageSize = 10,
        TicketNumber,
        Status,
        CurrentCounterID,
        ServedByUserId,
        QueueDate,
        PlateNumber,
        AgreementNo,
        CustomerName,
        BranchID,
    } = req.query

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('CurrentPage', Number(CurrentPage))
        request.input('PageSize', Number(PageSize))
        request.input('TicketNumber', TicketNumber || null)
        request.input('Status', Status || null)
        request.input('CurrentCounterID', CurrentCounterID ? Number(CurrentCounterID) : null)
        request.input('ServedByUserId', ServedByUserId ? Number(ServedByUserId) : null)
        request.input('QueueDate', QueueDate || null)
        request.input('PlateNumber', PlateNumber || null)
        request.input('AgreementNo', AgreementNo || null)
        request.input('CustomerName', CustomerName || null)
        request.input('BranchID', BranchID || null)

        const result = await request.execute('sp_QueMIF_GetTickets')
        response.success(res, {
            Data: result.recordsets[0],
            pagination: {
                currentPage: Number(CurrentPage),
                pageSize: Number(PageSize),
                total: result.recordsets[1][0].Total
            }
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.callTicket = async (req, res) => {
    const TicketID = req.params.id
    const { BranchIDLogin, NPKLogin } = req.body


    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)

        const result = await request.execute('sp_QueMIF_CallTicket')

        emitDisplayUpdate(BranchIDLogin, {
            action: 'display-update',
        })

        logActivity({
            Action: 'CALL_TICKET',
            Entity: 'TICKET',
            EntityID: TicketID,
            BranchIDLogin,
            NPKLogin,
            Payload: req.body
        })

        response.success(res, {
            Data: result.recordsets[0][0]
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.assignTicket = async (req, res) => {
    const TicketID = req.params.id
    const { CounterID, BranchIDLogin, NPKLogin } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)
        request.input('CounterID', CounterID)

        const result = await request.execute('sp_QueMIF_AssignTicket')

        emitDisplayUpdate(BranchIDLogin, {
            action: 'display-update',
        })

        logActivity({
            Action: 'ASSIGN_TICKET',
            Entity: 'TICKET',
            EntityID: TicketID,
            BranchIDLogin,
            NPKLogin,
            Payload: req.body
        })

        response.success(res, {
            Affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.holdTicket = async (req, res) => {
    const TicketID = req.params.id
    const { HoldReason, BranchIDLogin, NPKLogin } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)
        request.input('HoldReason', HoldReason)

        const result = await request.execute('sp_QueMIF_HoldTicket')

        emitDisplayUpdate(BranchIDLogin, {
            action: 'display-update',
        })
        logActivity({
            Action: 'HOLD_TICKET',
            Entity: 'TICKET',
            EntityID: TicketID,
            BranchIDLogin,
            NPKLogin,
            Payload: req.body
        })
        response.success(res, {
            Affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.cancelTicket = async (req, res) => {
    const TicketID = req.params.id
    const { Note, BranchIDLogin, NPKLogin } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)
        request.input('Note', Note)

        const result = await request.execute('sp_QueMIF_CancelTicket')

        emitDisplayUpdate(BranchIDLogin, {
            action: 'display-update',
        })

        logActivity({
            Action: 'CANCEL_TICKET',
            Entity: 'TICKET',
            EntityID: TicketID,
            BranchIDLogin,
            NPKLogin,
            Payload: req.body
        })

        response.success(res, {
            Affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.completeTicket = async (req, res) => {
    const TicketID = req.params.id
    const { BranchIDLogin, NPKLogin } = req.body
    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)

        const result = await request.execute('sp_QueMIF_CompleteTicket')

        emitDisplayUpdate(BranchIDLogin, {
            action: 'display-update',
        })

        logActivity({
            Action: 'CANCEL_TICKET',
            Entity: 'TICKET',
            EntityID: TicketID,
            BranchIDLogin,
            NPKLogin,
            Payload: req.body
        })


        response.success(res, {
            Affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

