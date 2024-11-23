const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');
const { isAuthenticated } = require('../middleware/auth');

router.get('/edit', isAuthenticated, profileController.renderEditProfile);
router.post('/edit', isAuthenticated, profileController.uploadAvatar, profileController.updateProfile);

module.exports = router;