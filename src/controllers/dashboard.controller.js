const response = require('../utils/response')
const { poolPromise } = require('../config/db')

exports.getKPIDashboard = async (req, res) => {
    const { BranchID, QueueStartDate, QueueEndDate } = req.query

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('BranchID', BranchID)
        request.input('QueueStartDate', QueueStartDate || null)
        request.input('QueueEndDate', QueueEndDate || null)

        const result = await request.execute('sp_QueMIF_GetKPIDashboard')

        const data = result.recordsets[0][0] || {}

        response.success(res, {
            TotalAntrian: data.TotalAntrian || 0,
            AvgTimeService: data.AvgTimeService ? parseFloat(data.AvgTimeService.toFixed(2)) : 0,
            NoShowRate: data.NoShowRate ? parseFloat(data.NoShowRate.toFixed(2)) : 0,
            TotalComplete: data.TotalComplete || 0,
            TotalCancel: data.TotalCancel || 0,
            TotalNoShow: data.TotalNoShow || 0,
            TotalServing: data.TotalServing || 0
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.getCounterInfo = async (req, res) => {
    const CounterID = req.params.counterId
    const { QueueDate } = req.query

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('CounterID', CounterID)
        request.input('QueueDate', QueueDate || null)

        const result = await request.execute('sp_QueMIF_GetCounterInfo')

        const data = result.recordsets[0][0]

        if (!data) {
            return response.fail(res, 'COUNTER_NOT_FOUND', 404, 'Counter not found')
        }

        response.success(res, {
            CounterID: data.CounterID,
            CounterName: data.CounterName,
            CSName: data.CSName,
            NPK: data.NPK,
            CurrentTicketNumber: data.CurrentTicketNumber,
            TotalServiceDuration: parseFloat(data.TotalServiceDuration || 0),
            TotalTicketServed: data.TotalTicketServed
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.getAllCountersByBranch = async (req, res) => {
    const { BranchID, QueueDate, PageSize, CurrentPage } = req.query

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('BranchID', BranchID)
        request.input('QueueDate', QueueDate || null)
        request.input('PageSize', PageSize || 10)
        request.input('CurrentPage', CurrentPage || 1)

        const result = await request.execute('sp_QueMIF_GetAllCountersByBranch')

        const counters = result.recordsets[0].map(counter => ({
            CounterID: counter.CounterID,
            CounterName: counter.CounterName,
            CSName: counter.CSName,
            NPK: counter.NPK,
            CurrentTicketNumber: counter.CurrentTicketNumber,
            TotalServiceDuration: parseFloat(counter.TotalServiceDuration || 0),
            TotalTicketServed: counter.TotalTicketServed
        }))

        response.success(res, counters)
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}
exports.getHourlyStats = async (req, res) => {
    const { BranchID, QueueDate } = req.query

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('BranchID', BranchID)
        request.input('QueueDate', QueueDate || null)

        const result = await request.execute('sp_QueMIF_GetHourlyStats')

        response.success(res, result.recordsets[0])
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.getServiceStats = async (req, res) => {
    const { BranchID, QueueDate } = req.query

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('BranchID', BranchID)
        request.input('QueueDate', QueueDate || null)

        const result = await request.execute('sp_QueMIF_GetServiceStats')

        response.success(res, result.recordsets[0])
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}
