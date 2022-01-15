const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../auth-service/auth.controller')
const NewsListSchema = require('../../models/newslist.model');

// Add news api
router.post('/add', isAuthenticated, (req, res) => {
    NewsListSchema.create(req.body, (err, data) => {
        if (err) {
            const error = encodeURIComponent('Error on adding news. Please try again.')
            return res.redirect('/dashboard?newsValid=' + error);
        }
        const success = encodeURIComponent('News Successfully Added.');
        return res.redirect('/dashboard?newsMsg=' + success);
    })
})

// update news api
router.post('/edit', isAuthenticated, (req, res) => {
    NewsListSchema.findOneAndUpdate(
        { _id: req.body.id },
        { ...req.body, createdAt: Date.now() },
        { upsert: true },
        (err, data) => {
            if (err) {
                const error = encodeURIComponent('Error on saving news. Please try again.')
                return res.redirect('/dashboard?newsValid=' + error);
            }
            const success = encodeURIComponent('News Successfully edited.');
            return res.redirect('/dashboard?newsMsg=' + success);
        })
})

// Delete news api
router.post('/delete', isAuthenticated, (req, res) => {
    NewsListSchema.findOneAndRemove({ _id: req.body.id }, (err, data) => {
        if (err) {
            const error = encodeURIComponent('Error on deleting news. Please try again.')
            return res.redirect('/dashboard?newsValid=' + error);
        }
        const success = encodeURIComponent('News Successfully deleted.');
        return res.redirect('/dashboard?newsMsg=' + success);
    })
})

module.exports = router;