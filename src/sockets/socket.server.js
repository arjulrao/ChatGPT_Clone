const { Server} = require("socket.io");
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.model")
const cookie = require("cookie");    //It is not cookie-parser it is different package

function initSocketServer(httpServer) {

    const io = new Server(httpServer, {});

    /* Verify user is login or not using cookie - Middleware*/
    io.use(async (socket, next) =>{
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
        // console.log(cookies);

        if(!cookies.token){
            next(new Error("Authentication error: No token provide"));
        }

        try{
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

            const user = await userModel.findById(decoded.id);

            socket.user = user;
            next()

        } catch(err) {
            next(new Error("Authentication Error! Token Invalid Error"));
        }
    })

    io.on("connection", (socket) => {
        console.log("Socket server is connected : ",  socket.id)

        socket.on("disconnect", ()=> {
        console.log("Socket Server is Disconnect ")
        })
    })
}

module.exports = initSocketServer;