const { Server} = require("socket.io");
const jwt = require('jsonwebtoken');
const cookie = require("cookie");    //It is not cookie-parser it is different package
/* Models */
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");

const aiService = require("../services/ai.service");



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
        // console.log("User Connected: ", socket.user)
        console.log("Socket server is connected : ",  socket.id)

        socket.on("ai-message", async(messagePayload)=>{
            // console.log(messagePayload.content)

        /* Save chat history - User */
        if(messagePayload.content !== undefined || null){
            await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: messagePayload.content,
                role: "user"
            })
        }

        const response = await aiService.generateResponse(messagePayload.content);

        /* Save model response */
        await messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: response,
            role: "model"
        })

        socket.emit('ai-response', {
            content : response,
            chat : messagePayload.chat
            })
        })
        socket.on("disconnect", ()=> {
        console.log("Socket Server is Disconnect ")
        })
    })
}

module.exports = initSocketServer;