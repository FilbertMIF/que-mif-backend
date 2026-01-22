const response = require('../utils/response')
const { poolPromise } = require('../config/db')
const { logActivity } = require('../utils/activityLogger')

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