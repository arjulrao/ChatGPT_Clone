const { Server} = require("socket.io");

function initSocketServer(httpServer) {

    const io = new Server(httpServer, {});

    io.on("connection", (socket) => {
        console.log("Socket server is connected : ",  socket.id)

        socket.on("disconnect", ()=> {
        console.log("Socket Server is Disconnect ")
        })
    })
}

module.exports = initSocketServer;