const express = require('express');
const cookieParser = require('cookie-parser');

/* Routes Require */
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

/* Using Middleware */
app.use(express.json());
app.use(cookieParser());

/* Using Routes */
app.use('/api/auth', authRoutes);
app.use('/auth/chat', chatRoutes);

module.exports = app;