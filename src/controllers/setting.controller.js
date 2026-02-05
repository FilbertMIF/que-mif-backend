const response = require('../utils/response')
const { poolPromise } = require('../config/db')
const { emitDisplayUpdate } = require('../socket')
const { logActivity } = require('../utils/activityLogger')

exports.updateSetting = async (req, res) => {
    const SettingID = req.params.id
    const { BranchIDLogin, NPKLogin, SettingValue } = req.body

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('SettingID', SettingID)
        request.input('SettingValue', SettingValue)

        const result = await request.execute('sp_QueMIF_UpdateSetting')

        logActivity({
            Action: 'UPDATE_SETTING',
            Entity: 'SETTING',
            EntityID: SettingID,
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

exports.getSetting = async (req, res) => {
    try {
        const pool = await poolPromise
        const request = pool.request()

        const result = await request.execute('sp_QueMIF_GetSetting')

        response.success(res, {
            Data: result.recordsets[0]
        })
    } catch (err) {
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}
