require('dotenv').config()

const http = require('http')
const app = require('./src/app')
const db = require('./src/config/db')
const { initSocket } = require('./src/socket')

db.poolPromise
  .then(pool => pool.request().query('select 1'))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

const server = http.createServer(app)

initSocket(server)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
