const response = require('../utils/response')
const { poolPromise } = require('../config/db')
const { logActivity } = require('../utils/activityLogger')

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
