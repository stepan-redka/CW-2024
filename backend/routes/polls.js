const express = require('express');
const router = express.Router();
const pollsController = require('../controllers/polls');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, pollsController.listPolls);
router.get('/create', isAuthenticated, pollsController.renderCreatePoll);
router.post('/create', isAuthenticated, pollsController.createPoll);
router.get('/:id', isAuthenticated, pollsController.viewPoll);
router.post('/:id/vote', isAuthenticated, pollsController.vote);
router.post('/:id/comment', isAuthenticated, pollsController.addComment);
router.get('/:id/results', isAuthenticated, pollsController.viewResults);
router.get('/:id/statistics', isAuthenticated, pollsController.getStatistics);

module.exports = router;