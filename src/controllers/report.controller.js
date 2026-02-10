const response = require('../utils/response')
const { poolPromise } = require('../config/db')

exports.getDailyReport = async (req, res) => {
    const { date, branchId } = req.query

    if (!date) {
        return response.fail(res, 'MISSING_PARAMETER', 400, 'Date parameter is required')
    }

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('BranchID', branchId || null)
        request.input('QueueDate', date)

        const result = await request.execute('sp_QueMIF_GetDailyReport')

        // First recordset: overall statistics
        const summary = result.recordsets[0][0] || {
            ReportDate: date,
            TotalTickets: 0,
            CompleteCount: 0,
            NoShowCount: 0,
            CanceledCount: 0,
            AvgServiceDuration: 0,
            AvgHoldDuration: 0,
            TotalServiceDuration: 0,
            TotalHoldDuration: 0
        }

        // Second recordset: breakdown by service
        const serviceBreakdown = result.recordsets[1] || []

        // Third recordset: detailed tickets
        const tickets = result.recordsets[2] || []

        // Fourth recordset: waiting tickets
        const waitingTickets = result.recordsets[3] || []

        response.success(res, {
            date,
            branchId: branchId || null,
            summary: {
                totalTickets: summary.TotalTickets,
                waitingCount: summary.WaitingCount,
                complete: summary.CompleteCount,
                noShow: summary.NoShowCount,
                canceled: summary.CanceledCount,
                avgServiceDuration: parseFloat(summary.AvgServiceDuration || 0).toFixed(2),
                avgHoldDuration: parseFloat(summary.AvgHoldDuration || 0).toFixed(2),
                totalServiceDuration: summary.TotalServiceDuration,
                totalHoldDuration: summary.TotalHoldDuration
            },
            serviceBreakdown: serviceBreakdown.map(s => ({
                serviceId: s.ServiceID,
                serviceCode: s.ServiceCode,
                serviceName: s.ServiceName,
                totalTickets: s.TotalTickets,
                complete: s.CompleteCount,
                noShow: s.NoShowCount,
                canceled: s.CanceledCount,
                avgServiceDuration: parseFloat(s.AvgServiceDuration || 0).toFixed(2)
            })),
            tickets: tickets.map(t => ({
                ticketNumber: t.TicketNumber,
                plateNumber: t.PlateNumber,
                customerName: t.CustomerName,
                agreementNo: t.AgreementNo,
                serviceCode: t.ServiceCode,
                serviceName: t.ServiceName,
                counterName: t.CounterName,
                servedByName: t.ServedByName,
                status: t.Status,
                createdAt: t.CreatedAt,
                calledAt: t.CalledAt,
                startedAt: t.StartedAt,
                finishedAt: t.FinishedAt,
                waitingMinutes: t.WaitingMinutes,
                serviceDuration: t.ServiceDuration,
                holdDuration: t.HoldDuration
            })),
            waitingTickets: waitingTickets.map(t => ({
                ticketId: t.TicketID,
                ticketNumber: t.TicketNumber,
                plateNumber: t.PlateNumber,
                customerName: t.CustomerName,
                agreementNo: t.AgreementNo,
                serviceCode: t.ServiceCode,
                serviceName: t.ServiceName,
                status: t.Status,
                createdAt: t.CreatedAt,
                waitingMinutes: t.WaitingMinutes
            }))
        })
    } catch (err) {
        console.error('Error in getDailyReport:', err)
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

/**
 * Get monthly report for a specific year and month
 * Query params: year (YYYY), month (MM), branchId (optional)
 */
exports.getMonthlyReport = async (req, res) => {
    const { year, month, branchId } = req.query

    if (!year || !month) {
        return response.fail(res, 'MISSING_PARAMETER', 400, 'Year and month parameters are required')
    }

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('BranchID', branchId || null)
        request.input('Year', parseInt(year))
        request.input('Month', parseInt(month))

        const result = await request.execute('sp_QueMIF_GetMonthlyReport')

        // First recordset: daily aggregates
        const dailyData = result.recordsets[0] || []

        // Second recordset: monthly totals
        const monthlyTotal = result.recordsets[1][0] || {
            Year: parseInt(year),
            Month: parseInt(month),
            TotalTickets: 0,
            CompleteCount: 0,
            NoShowCount: 0,
            CanceledCount: 0,
            AvgServiceDuration: 0,
            AvgHoldDuration: 0,
            TotalServiceDuration: 0,
            TotalHoldDuration: 0
        }

        response.success(res, {
            year: parseInt(year),
            month: parseInt(month),
            branchId: branchId || null,
            dailyStats: dailyData.map(d => ({
                date: d.ReportDate,
                totalTickets: d.TotalTickets,
                complete: d.CompleteCount,
                noShow: d.NoShowCount,
                canceled: d.CanceledCount,
                avgServiceDuration: parseFloat(d.AvgServiceDuration || 0).toFixed(2),
                avgHoldDuration: parseFloat(d.AvgHoldDuration || 0).toFixed(2),
                totalServiceDuration: d.TotalServiceDuration,
                totalHoldDuration: d.TotalHoldDuration
            })),
            monthlyTotal: {
                totalTickets: monthlyTotal.TotalTickets,
                complete: monthlyTotal.CompleteCount,
                noShow: monthlyTotal.NoShowCount,
                canceled: monthlyTotal.CanceledCount,
                avgServiceDuration: parseFloat(monthlyTotal.AvgServiceDuration || 0).toFixed(2),
                avgHoldDuration: parseFloat(monthlyTotal.AvgHoldDuration || 0).toFixed(2),
                totalServiceDuration: monthlyTotal.TotalServiceDuration,
                totalHoldDuration: monthlyTotal.TotalHoldDuration
            }
        })
    } catch (err) {
        console.error('Error in getMonthlyReport:', err)
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}
