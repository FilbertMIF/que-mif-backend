const express = require('express')
const routes = require('./routes')
const response = require('./utils/response')

const app = express()
app.use(express.json())

app.use('/api/queue', routes)

app.get('/api/test', (req, res) => {
    response.success(res, [], 'API IS RUNNING')
})

module.exports = app
