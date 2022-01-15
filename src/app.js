const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const config = require('./config/config');
const LocalStorage = require('node-localstorage').LocalStorage;
let localStorage = new LocalStorage('src/storage');
const { isAuthenticated } = require('./api/auth-service/auth.controller');

const NewsListSchema = require('./models/newslist.model');

//create object of express to handle routes
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect database
mongoose.connect(config.database);

// Succeccfull connection
mongoose.connection.on('connected', () => {
    console.log("connected to database " + config.database);
});

// Connection error
mongoose.connection.on('error', (err) => {
    console.log("error occur while connecting to database " + err);
});

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

app.locals.moment = require('moment');
app.locals.localStorage = localStorage;
let sess;

app.get('/', (req, res) => {
    sess = req.session;
    sess.email = " "
    res.render('index', {
        error: req.query.valid ? req.query.valid : '',
        msg: req.query.msg ? req.query.msg : ''
    })
});

app.get('/signup', (req, res) => {
    res.render('signup', {
        error: req.query.valid ? req.query.valid : '',
        msg: req.query.msg ? req.query.msg : ''
    })
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    NewsListSchema.find({}, (err, data) => {
        if (err) {
            return res.render('admin/dashboard', { error: err });
        }
        return res.render('admin/dashboard', {
            newslist: data,
            error: req.query.newsValid ? req.query.newsValid : '',
            msg: req.query.newsMsg ? req.query.newsMsg : ''
        });
    })
});

app.post('/editView', isAuthenticated, (req, res) => {
    return res.render('admin/edit-news', {
        data: req.body, error: req.query.newsValid ? req.query.newsValid : '',
        msg: req.query.newsMsg ? req.query.newsMsg : ''
    })
})

const apis = require('./api/index');
app.use('/api', apis);

module.exports = app;