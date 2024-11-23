const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/reset-password/:token', authController.updatePassword);
router.get('/logout', authController.logout); // Add this line for logout

module.exports = router;