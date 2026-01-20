const response = require('../utils/response')
const { poolPromise } = require('../config/db')

//Counters
exports.insertCounter = async (req, res) => {
    const { Name, IsActive, BranchID } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('Name', Name)
        request.input('IsActive', IsActive)
        request.input('BranchID', BranchID)

        const result = await request.execute('sp_QueMIF_InsertCounter')

        response.success(res, {
            counterId: result.recordsets[0][0].CounterId
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.getCounters = async (req, res) => {
    const {
        CurrentPage = 1,
        PageSize = 10,
        IsActive,
        Name,
        BranchID,
    } = req.query

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('CurrentPage', Number(CurrentPage))
        request.input('PageSize', Number(PageSize))
        request.input('IsActive', IsActive !== undefined ? Number(IsActive) : null)
        request.input('Name', Name || null)
        request.input('BranchID', BranchID ? Number(BranchID) : null)

        const result = await request.execute('sp_QueMIF_GetCounters')

        response.success(res, {
            data: result.recordsets[0],
            pagination: {
                currentPage: Number(CurrentPage),
                pageSize: Number(PageSize),
                total: result.recordsets[0]?.Total || 0
            }
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.updateCounter = async (req, res) => {
    const CounterId = req.params.id
    const { Name, IsActive, BranchID, NPK } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('CounterID', CounterId)
        request.input('Name', Name ?? null)
        request.input('IsActive', IsActive ?? null)
        request.input('BranchID', BranchID ?? null)
        request.input('NPK', NPK ?? null)

        const result = await request.execute('sp_QueMIF_UpdateCounter')

        response.success(res, {
            affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.deleteCounter = async (req, res) => {
    const CounterId = req.params.id

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('CounterId', CounterId)

        const result = await request.execute('sp_QueMIF_DeleteCounter')

        response.success(res, {
            affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

// Tickets
exports.insertTicket = async (req, res) => {
    const {
        ServiceID,
        BranchID,
        PlateNumber,
        AgreementNo,
        CustomerName,
    } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('ServiceID', ServiceID)
        request.input('BranchID', BranchID)
        request.input('PlateNumber', PlateNumber || null)
        request.input('AgreementNo', AgreementNo || null)
        request.input('CustomerName', CustomerName || null)

        const result = await request.execute('sp_QueMIF_InsertTicket')

        response.success(res, {
            ticketId: result.recordsets[0][0].TicketID,
            ticketNumber: result.recordsets[0][0].TicketNumber
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
        BranchID
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
            data: result.recordsets[0],
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

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)

        const result = await request.execute('sp_QueMIF_CallTicket')

        response.success(res, {
            data: result.recordsets[0][0]
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.assignTicket = async (req, res) => {
    const TicketID = req.params.id
    const { CounterID } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)
        request.input('CounterID', CounterID)

        const result = await request.execute('sp_QueMIF_AssignTicket')

        response.success(res, {
            affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.holdTicket = async (req, res) => {
    const TicketID = req.params.id
    const { HoldReason } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)
        request.input('HoldReason', HoldReason)

        const result = await request.execute('sp_QueMIF_HoldTicket')

        response.success(res, {
            affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.cancelTicket = async (req, res) => {
    const TicketID = req.params.id
    const { Note } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)
        request.input('Note', Note)

        const result = await request.execute('sp_QueMIF_CancelTicket')

        response.success(res, {
            affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.completeTicket = async (req, res) => {
    const TicketID = req.params.id

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('TicketID', TicketID)

        const result = await request.execute('sp_QueMIF_CompleteTicket')

        response.success(res, {
            affected: result.recordsets[0][0].Affected
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

