const response = require('../utils/response')
const { poolPromise } = require('../config/db')
const { emitDisplayUpdate } = require('../socket')
const { logActivity } = require('../utils/activityLogger')

//Services
exports.insertService = async (req, res) => {
    const { Code, Name, Description, IsActive, BranchIDLogin, NPKLogin } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('Code', Code)
        request.input('Name', Name)
        request.input('Description', Description)
        request.input('IsActive', IsActive)

        const result = await request.execute('sp_QueMIF_InsertService')
        const ServiceID = result.recordsets[0][0].ServiceID
        logActivity({
            Action: 'INSERT_SERVICE',
            Entity: 'SERVICE',
            EntityID: ServiceID,
            BranchIDLogin,
            NPKLogin,
            Payload: req.body
        })

        response.success(res, {
            ServiceID: ServiceID
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.getServices = async (req, res) => {
    const {
        CurrentPage = 1,
        PageSize = 10,
        Code,
        Name,
        IsActive,
    } = req.query

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('CurrentPage', Number(CurrentPage))
        request.input('PageSize', Number(PageSize))
        request.input('Code', Code || null)
        request.input('Name', Name || null)
        request.input('IsActive', IsActive !== undefined ? Number(IsActive) : null)

        const result = await request.execute('sp_QueMIF_GetServices')

        response.success(res, {
            Data: result.recordsets[0],
            pagination: {
                currentPage: Number(CurrentPage),
                pageSize: Number(PageSize),
                total: result.recordsets[0][0]?.Total || 0
            }
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.updateService = async (req, res) => {
    const ServiceID = req.params.id
    const { Code, Name, Description, IsActive, BranchIDLogin, NPKLogin } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('ServiceID', ServiceID)
        request.input('Code', Code || null)
        request.input('Name', Name || null)
        request.input('Description', Description || null)
        request.input('IsActive', IsActive !== undefined ? IsActive : null)

        const result = await request.execute('sp_QueMIF_UpdateService')

        logActivity({
            Action: 'UPDATE_SERVICE',
            Entity: 'SERVICE',
            EntityID: ServiceID,
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

exports.deleteService = async (req, res) => {
    const ServiceID = req.params.id
    const { BranchIDLogin, NPKLogin } = req.body
    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('ServiceID', ServiceID)

        const result = await request.execute('sp_QueMIF_DeleteService')

        logActivity({
            Action: 'DELETE_SERVICE',
            Entity: 'SERVICE',
            EntityID: ServiceID,
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

//Counters
exports.insertCounter = async (req, res) => {
    const { Name, IsActive, BranchID, BranchIDLogin, NPKLogin } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('Name', Name)
        request.input('IsActive', IsActive)
        request.input('BranchID', BranchID)

        const result = await request.execute('sp_QueMIF_InsertCounter')
        const CounterID = result.recordsets[0][0].CounterID
        logActivity({
            Action: 'INSERT_COUNTER',
            Entity: 'COUNTER',
            EntityID: CounterID,
            BranchIDLogin,
            NPKLogin,
            Payload: req.body
        })

        response.success(res, {
            CounterID: CounterID
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
        BranchID
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
            Data: result.recordsets[0],
            pagination: {
                currentPage: Number(CurrentPage),
                pageSize: Number(PageSize),
                total: result.recordsets[0][0]?.Total || 0
            }
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.updateCounter = async (req, res) => {
    const CounterID = req.params.id
    const { Name, IsActive, BranchID, NPK, BranchIDLogin, NPKLogin } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('CounterID', CounterID)
        request.input('Name', Name ?? null)
        request.input('IsActive', IsActive ?? null)
        request.input('BranchID', BranchID ?? null)
        request.input('NPK', NPK ?? null)

        const result = await request.execute('sp_QueMIF_UpdateCounter')

        logActivity({
            Action: 'UPDATE_COUNTER',
            Entity: 'COUNTER',
            EntityID: CounterID,
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

exports.deleteCounter = async (req, res) => {
    const CounterID = req.params.id
    const { BranchIDLogin, NPKLogin } = req.body
    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('CounterID', CounterID)

        const result = await request.execute('sp_QueMIF_DeleteCounter')

        logActivity({
            Action: 'DELETE_COUNTER',
            Entity: 'COUNTER',
            EntityID: CounterID,
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

        response.success(res, {
            TicketID: result.recordsets[0][0].TicketID,
            TicketNumber: result.recordsets[0][0].TicketNumber
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

