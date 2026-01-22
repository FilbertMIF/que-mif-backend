const { Server } = require('socket.io')

let io

exports.initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: '*' }
    })

    io.on('connection', socket => {
        socket.on('join-display', (BranchID) => {
            socket.join(`display-${BranchID}`)
        })
    })
}

exports.emitDisplayUpdate = (BranchID, payload) => {
    console.log("Updated Display at Branch:", BranchID)
    if (!io) return
    io.to(`display-${BranchID}`).emit('display-update', payload)
}
