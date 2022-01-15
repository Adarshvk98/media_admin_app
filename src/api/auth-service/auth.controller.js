const express = require('express');
const router = express.Router();
const LocalStorage = require('node-localstorage').LocalStorage;
let localStorage = new LocalStorage('src/storage');
// For generating Token
const jwt = require('jsonwebtoken');
// For encrypting Password
const bcrypt = require('bcryptjs');

const config = require('../../config/config');

const UserSchema = require('../../models/user.model');
// Register User
router.post('/register', (req, res) => {

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    UserSchema.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    },
        (err, user) => {
            if (err) {
                const error = encodeURIComponent('There was a problem while registering. Please try again later.')
                return res.redirect('/signup?valid=' + error);
            }
            const success = encodeURIComponent('Successfully Registered. Please Login');
            res.redirect('/?msg=' + success);
        });
});

// Login User
router.post('/login', (req, res) => {
    UserSchema.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            const error = encodeURIComponent('Error on the server. Please try again.')
            return res.redirect('/?valid=' + error);
        }
        const invalid = encodeURIComponent('Username or Password is invalid !! Please try again.');
        if (!user) {
            return res.redirect('/?valid=' + invalid);
        } else {
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return res.redirect('/?valid=' + invalid);
            }
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            localStorage.setItem('name', user.name);
            localStorage.setItem('email', user.email);
            localStorage.setItem('authtoken', token);
            res.redirect(`/dashboard`);
        }
    });
});

// Logout user
router.get('/logout', (req, res) => {
    localStorage.removeItem('authtoken');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    res.redirect('/');
});

const isAuthenticated = (req, res, next) => {
    let token = localStorage.getItem('authtoken');
    if (!token) {
        return res.redirect('/?valid=' + encodeURIComponent('Token Not Found'));
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.redirect('/?valid=' + encodeURIComponent('Token verification failed'));
        };
        next();
    });
}


module.exports = { router, isAuthenticated };