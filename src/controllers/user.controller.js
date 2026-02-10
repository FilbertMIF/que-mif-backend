const response = require('../utils/response')
const { poolPromise } = require('../config/db')

exports.getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise
        const request = pool.request()

        const result = await request.execute('sp_QueMIF_GetAllUsers')

        response.success(res, result.recordsets[0])
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

exports.upsertUser = async (req, res) => {
    const { UserID, Username, FullName, Role, BranchID, NPK, IsActive } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        if (UserID) request.input('UserID', UserID)
        request.input('Username', Username)
        request.input('FullName', FullName)
        request.input('Role', Role)
        request.input('BranchID', BranchID || null)
        request.input('NPK', NPK || null)
        request.input('IsActive', IsActive !== undefined ? IsActive : 1)

        await request.execute('sp_QueMIF_UpsertUser')

        response.success(res, null, 'User saved successfully')
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}
