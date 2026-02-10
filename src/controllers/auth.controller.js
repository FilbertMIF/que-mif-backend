const axios = require('axios');
const response = require('../utils/response');

const login = async (req, res) => {
    try {
        const { Username, Password } = req.body;

        if (!Username || !Password) {
            return response.fail(res, 'Username and Password are required', 400);
        }

        const loginUrl = 'https://apim.maybankfinance.co.id:8282/sandbox/api/Login/Login';
        const body = {
            Username: Username,
            Password: Password,
            SubSystemID: 'App1011180013319'
        };

        const apiResponse = await axios.post(loginUrl, body, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'rDZiAOJOVc2oyAQutOzHvi1R4jMDXokuDRkK1od5'
            },
            // Disable SSL verification if needed for sandbox/internal URLs
            // httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        const data = apiResponse.data;

        if (data.Login === 'IsValid' && data.Retval === 'Success') {
            // Check Local User Table
            try {
                const { poolPromise } = require('../config/db')
                const pool = await poolPromise
                const request = pool.request()
                request.input('Username', Username)

                const userResult = await request.execute('sp_QueMIF_GetUserByUsername')
                const localUser = userResult.recordsets[0][0]

                if (localUser) {
                    // Combine External Data with Local Role/Permissions
                    const combinedData = {
                        ...data,
                        User: {
                            Username: localUser.Username,
                            FullName: localUser.FullName || data.FullName, // Prefer local or external?
                            Role: localUser.Role,
                            BranchID: localUser.BranchID,
                            NPK: localUser.NPK
                        }
                    }
                    return response.success(res, combinedData, 'Login Successful');
                } else {
                    return response.fail(res, 'User not registered in Queue System', 403);
                }

            } catch (dbErr) {
                console.error('DB Error Checking User:', dbErr);
                return response.fail(res, 'Database Error', 500);
            }
        } else {
            return response.fail(res, data.Message || 'Invalid Credentials', 401);
        }

    } catch (error) {
        console.error('Login Proxy Error:', error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response ? (error.response.data.Message || error.response.data) : 'Internal Server Error';
        return response.fail(res, message, status);
    }
};

module.exports = {
    login
};
