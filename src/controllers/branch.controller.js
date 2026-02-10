const response = require('../utils/response')
const { poolPromise } = require('../config/db')

/**
 * Get all branches with pagination support
 * Query params: pageSize (default: 0), currentPage (default: 1)
 * pageSize = 0 means no pagination (return all)
 */
exports.getBranches = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 0
    const currentPage = parseInt(req.query.currentPage) || 1

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('PageSize', pageSize)
        request.input('CurrentPage', currentPage)

        const result = await request.execute('sp_QueMIF_GetBranches')

        // First recordset: branches
        const branches = result.recordsets[0].map(branch => ({
            branchId: branch.BranchID,
            branchFullName: branch.BranchFullName
        }))

        // Second recordset: total count
        const totalRecords = result.recordsets[1][0].TotalRecords
        const totalPages = pageSize === 0 ? 1 : Math.ceil(totalRecords / pageSize)

        response.success(res, branches)
    } catch (err) {
        console.error('Error in getBranches:', err)
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}
