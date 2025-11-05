const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { validateAddStudent, validateGetParentStudent } = require('../middleware/validation');

/**
 * @swagger
 * /api/addStudent:
 *   post:
 *     summary: Add a student (child) by parent
 *     tags: [Students]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentId
 *               - firstName
 *               - lastName
 *               - class
 *               - section
 *               - registrationNo
 *               - classRollNo
 *             properties:
 *               parentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               class:
 *                 type: string
 *                 example: "10"
 *               section:
 *                 type: string
 *                 example: "A"
 *               registrationNo:
 *                 type: string
 *                 example: "REG2024001"
 *               classRollNo:
 *                 type: string
 *                 example: "15"
 *     responses:
 *       201:
 *         description: Student added successfully
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
 *                     student:
 *                       type: object
 *       400:
 *         description: Validation error or student already exists
 */
router.post('/addStudent', validateAddStudent, studentController.addStudent);

/**
 * @swagger
 * /api/getParentStudent:
 *   post:
 *     summary: Get all students added by a parent
 *     tags: [Students]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentId
 *             properties:
 *               parentId:
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
 *                     students:
 *                       type: array
 *                     count:
 *                       type: number
 *       400:
 *         description: Validation error
 */
router.post('/getParentStudent', validateGetParentStudent, studentController.getParentStudent);

/**
 * @swagger
 * /api/getAllStudents:
 *   get:
 *     summary: Get all students in the system
 *     tags: [Students]
 *     security: []
 *     responses:
 *       200:
 *         description: All students retrieved successfully
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
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           parentId:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           class:
 *                             type: string
 *                           section:
 *                             type: string
 *                           registrationNo:
 *                             type: string
 *                           classRollNo:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *                     count:
 *                       type: number
 */
router.get('/getAllStudents', studentController.getAllStudents);

module.exports = router;

