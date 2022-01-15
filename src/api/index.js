const express = require('express');

const app = express();

// Authentication controller
const AuthController = require('./auth-service/auth.controller');
app.use('/auth', AuthController.router);

// News controller
const NewsController = require('./news-service/news.controller');
app.use('/news', NewsController);

module.exports = app;