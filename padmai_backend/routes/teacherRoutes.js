const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { validateGetClassStudents } = require('../middleware/validation');

/**
 * @swagger
 * /api/getClassStudents:
 *   post:
 *     summary: Get students of the class assigned to the teacher
 *     tags: [Teacher]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *             properties:
 *               teacherId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     class:
 *                       type: string
 *                     section:
 *                       type: string
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                     count:
 *                       type: number
 *       400:
 *         description: Validation error or no class assigned yet
 */
router.post('/getClassStudents', validateGetClassStudents, teacherController.getClassStudents);

module.exports = router;

