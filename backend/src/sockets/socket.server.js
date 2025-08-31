const { Server} = require("socket.io");
const jwt = require('jsonwebtoken');
const cookie = require("cookie");    //It is not cookie-parser it is different package
/* Models */
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");

const aiService = require("../services/ai.service");

/* Vector Database */
const { createMemory, queryMemory} = require("../services/vector.service");


/*
function initSocketServer(httpServer) {

    const io = new Server(httpServer, {});

    // Verify user is login or not using cookie - Middleware
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
            //  MessagePayload : {chatId : chatId, content: message text} 
            // console.log(messagePayload.content)

        // Save chat history - User 
            const message = await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: messagePayload.content,
                role: "user"
            })

        //  Long Term Memory save 
        const vectors = await aiService.generateVector(messagePayload.content);

        // console.log("Vectors generated", vectors);
        const memory = await queryMemory({
            queryVector:  vectors,
            limit: 3,
            metadata: {
            //    user: socket.user._id   
            }
        })

        // console.log(memory);

        await createMemory({
            vectors,
            messageId: message._id,   // Always unique
            metadata: {
                chat: messagePayload.chat,
                user: socket.user._id,
                text: messagePayload.content
            }

        })


        // Chat History || Short term Memory 

        const chatHistory = (await messageModel.find({
            chat: messagePayload.chat
        }).sort({ createdAt: -1}).limit(20).lean()).reverse()
        // Limit How many message it remember

        //  STM we give when we call AI to response  
        const stm = chatHistory.map(item => {
            return { //The syntax is as par GEMINI docs
                role: item.role,
                parts: [{ text: item.content }]
            }
        })

        // LTM we give with STM 
        const ltm = [{
            role: "user",
            parts: [ {text: `
                these are some previous messages from the chat, use them to generate a response

                ${memory.map(item => item.metadata.text).join("\n")}

                `}]
        }]

        // console.log(chatHistory)

        // We can not pass short term history directly AI dot't read it 

        // console.log('Chat History:', chatHistory.map(item => {
        //     return { //The syntax is as par GEMINI docs
        //         role: item.role,
        //         parts: [{ text: item.content }]
        //     }
        // }))

        // const response = await aiService.generateResponse(messagePayload.content);

       console.log(ltm[0])
       console.log(stm)
  
        // Now are provide chat history to AI 

        const response = await aiService.generateResponse([...ltm, ...stm]);

        // Save model response
        const responseMessage = await messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: response,
            role: "model"
        })

        // Save response of in vectors - LTM
        const responseVectors = await aiService.generateVector(response)

        await createMemory({
            vectors: responseVectors,
            messageId: responseMessage._id,
            metadata : {
                chat: messagePayload.chat,
                user: socket.user._id,
                text: response
            }
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

module.exports = initSocketServer
*/



function initSocketServer(httpServer) {

    const io = new Server(httpServer, {
        // cors: {
        //     origin: "http://localhost:5173",
        //     allowedHeaders: [ "Content-Type", "Authorization" ],
        //     credentials: true
        // }
    })

    io.use(async (socket, next) => {

        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            next(new Error("Authentication error: No token provided"));
        }

        try {

            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

            const user = await userModel.findById(decoded.id);

            socket.user = user

            next()

        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }

    })

    io.on("connection", (socket) => {

        console.log("Socket server is connected : ",  socket.id)

        socket.on("ai-message", async (messagePayload) => {
            /* messagePayload = { chat:chatId,content:message text } */
            const [ message, vectors ] = await Promise.all([
                messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: messagePayload.content,
                    role: "user"
                }),
                aiService.generateVector(messagePayload.content),
            ])

            await createMemory({
                vectors,
                messageId: message._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                }
            })


            const [ memory, chatHistory ] = await Promise.all([

                queryMemory({
                    queryVector: vectors,
                    limit: 3,
                    metadata: {
                        user: socket.user._id
                    }
                }),

                messageModel.find({
                    chat: messagePayload.chat
                }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse())
            ])

            const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [ { text: item.content } ]
                }
            })

            const ltm = [
                {
                    role: "user",
                    parts: [ {
                        text: `

                        these are some previous messages from the chat, use them to generate a response

                        ${memory.map(item => item.metadata.text).join("\n")}
                        
                        ` } ]
                }
            ]


            const response = await aiService.generateResponse([ ...ltm, ...stm ])

            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })

            const [ responseMessage, responseVectors ] = await Promise.all([
                messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: response,
                    role: "model"
                }),
                aiService.generateVector(response)
            ])

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                }
            })

        })

        socket.on("disconnect", ()=> {
        console.log("Socket Server is Disconnect ")
        })
    })
}


module.exports = initSocketServer;