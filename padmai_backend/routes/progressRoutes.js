const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/auth');

// Save progress (teacher saves marks)
router.post('/', authenticateToken, progressController.saveProgress);

// Get progress by teacher
router.get('/', authenticateToken, progressController.getProgressByTeacher);

// Get progress by student (for parent)
router.get('/student', authenticateToken, progressController.getProgressByStudent);

module.exports = router;
