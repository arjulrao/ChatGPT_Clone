const express = require('express');
const authControllers = require("../controllers/auth.controller")

const routes = express.Router();

routes.post("/register", authControllers.registerUser);
routes.post("/login", authControllers.loginUser);


module.exports = routes;