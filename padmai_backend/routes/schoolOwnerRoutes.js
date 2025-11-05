const express = require('express');
const router = express.Router();
const schoolOwnerController = require('../controllers/schoolOwnerController');
const { validateAssignTeacher } = require('../middleware/validation');

/**
 * @swagger
 * /api/getTeachers:
 *   get:
 *     summary: Get list of all registered teachers
 *     tags: [School Owner]
 *     security: []
 *     responses:
 *       200:
 *         description: Teachers retrieved successfully
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
 *                     teachers:
 *                       type: array
 *                       items:
 *                         type: object
 *                     count:
 *                       type: number
 */
router.get('/getTeachers', schoolOwnerController.getTeachers);

/**
 * @swagger
 * /api/assignTeacher:
 *   post:
 *     summary: Assign a class and section to a teacher
 *     tags: [School Owner]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - class
 *               - section
 *             properties:
 *               teacherId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               class:
 *                 type: string
 *                 example: "10"
 *               section:
 *                 type: string
 *                 example: "A"
 *     responses:
 *       200:
 *         description: Teacher assigned successfully
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
 *                     assignment:
 *                       type: object
 *       400:
 *         description: Validation error or user is not a teacher
 *       404:
 *         description: Teacher not found
 */
router.post('/assignTeacher', validateAssignTeacher, schoolOwnerController.assignTeacher);

module.exports = router;

