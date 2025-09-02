const express = require('express');

const authMiddleware = require("../middlewares/auth.middlewares");
const chatController = require("../controllers/chat.controller");

const routes = express.Router();

/* POST /api/chat/ */
routes.post('/', authMiddleware.authUser, chatController.createChat)

/* GET /api/chat */
routes.get('/', authMiddleware.authUser, chatController.getChats)

/* GET /api/chat/messages/:id */
routes.get('/messages/:id', authMiddleware.authUser, chatController.getMessages)


module.exports = routes;