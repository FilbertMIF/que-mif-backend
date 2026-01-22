const { poolPromise } = require('../config/db')

exports.logActivity = async ({
    Action,
    Entity,
    EntityID = null,
    BranchIDLogin = null,
    NPKLogin = null,
    Payload = null
}) => {
    try {
        const pool = await poolPromise
        const request = pool.request()

        request.input('Action', Action)
        request.input('Entity', Entity)
        request.input('EntityID', EntityID)
        request.input('BranchID', BranchIDLogin)
        request.input('NPK', NPKLogin)
        request.input('Payload', Payload ? JSON.stringify(Payload) : null)

        await request.execute('sp_QueMIF_InsertActivityLog')
    } catch (err) {
        console.error('Activity log failed:', err.message)
    }
}