const express = require('express');

const authMiddleware = require("../middlewares/auth.middlewares");
const chatController = require("../controllers/chat.controller");

const routes = express.Router();

/* POST /api/chat/ */
routes.post('/', authMiddleware.authUser, chatController.createChat)


module.exports = routes;