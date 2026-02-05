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
            // Success! We can return the data to the frontend
            // You might want to wrap this in your own JWT or just forward the relevant info
            return response.success(res, data, 'Login Successful');
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
