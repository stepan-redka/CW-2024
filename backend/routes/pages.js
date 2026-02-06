const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const chatController = require('../controllers/chat'); // Import chatController

router.get('/polls', isAuthenticated, chatController.renderListPollsWithChat);

router.get('/', (req, res) => {
    db.query('SELECT * FROM polls', (error, results) => {
        if (error) {
            console.log(error);
            return res.render('error', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        res.render('index', {
            polls: results
        });
    });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;