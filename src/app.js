const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const response = require('./utils/response')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/queue', routes)

app.get('/api/test', (req, res) => {
    response.success(res, [], 'QUEMIF API IS RUNNING')
})

module.exports = app
