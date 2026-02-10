const response = require('../utils/response')
const { poolPromise } = require('../config/db')
const { emitDisplayUpdate } = require('../socket')
const { logActivity } = require('../utils/activityLogger')

/**
 * Get all settings from QueMIF_Settings table
 */
exports.getAllSettings = async (req, res) => {
    try {
        const pool = await poolPromise
        const request = pool.request()

        const result = await request.execute('sp_QueMIF_GetSetting')

        const settings = result.recordsets[0].map(setting => ({
            settingId: setting.SettingID,
            settingKey: setting.SettingKey,
            settingValue: setting.SettingValue,
            description: setting.Description,
            updatedAt: setting.UpdatedAt
        }))

        response.success(res, settings)
    } catch (err) {
        console.error('Error in getAllSettings:', err)
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

/**
 * Update a specific setting by ID
 */
exports.updateSetting = async (req, res) => {
    const settingId = req.params.id
    const { settingValue, BranchIDLogin, NPKLogin } = req.body

    if (!settingValue && settingValue !== '' && settingValue !== 0 && settingValue !== false) {
        return response.fail(res, 'MISSING_PARAMETER', 400, 'settingValue is required')
    }

    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('SettingID', settingId)
        request.input('SettingValue', String(settingValue))

        const result = await request.execute('sp_QueMIF_UpdateSetting')

        const affected = result.recordsets[0][0].Affected

        logActivity({
            Action: 'UPDATE_SETTING',
            Entity: 'SETTING',
            EntityID: settingId,
            BranchIDLogin,
            NPKLogin,
            Payload: { settingValue }
        })

        response.success(res, {
            affected,
            message: 'Setting updated successfully'
        })
    } catch (err) {
        console.error('Error in updateSetting:', err)
        response.fail(res, 'DB_ERROR', 500, err.message)
    }
}

// Alias for backward compatibility
exports.getSetting = exports.getAllSettings

