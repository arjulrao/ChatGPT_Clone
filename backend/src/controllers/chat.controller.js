const { chat } = require('@pinecone-database/pinecone/dist/assistant/data/chat');
const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');
const { json } = require('express');

async function createChat(req, res){
    const {title} = req.body;

    const user = req.user;

    const chat = await chatModel.create({
        user: user._id,
        title
    });

    res.status(201).json({
        Message: "Chat created successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user   // user id show
        }
    });
}

async function getChats(req, res){
    const user = req.user;

    const chats = await chatModel.find({ user: user._id});

    res.status(200).json({
        Message : "Chats retrieved successfully",
        chats: chats.map(chat => ({
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }))
    });
}

async function getMessages(req, res) {
    const chatId = req.params.id;

    const message = await messageModel.find({
        chat : chatId
    }).sort({ createdAt: 1})

    res.status(200).json({
        Message: "Message Retrived succesfully",
        message: message
    })
}


module.exports = {
    createChat,
    getChats,
    getMessages
}