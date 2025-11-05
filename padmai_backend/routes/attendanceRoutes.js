const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { validateSetAttendance, validateGetAttendanceHistory, validateGetClassAttendance } = require('../middleware/validation');

/**
 * @swagger
 * /api/setAttendance:
 *   post:
 *     summary: Set attendance for a student (Teacher only)
 *     tags: [Attendance]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - studentId
 *               - status
 *             properties:
 *               teacherId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               studentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               status:
 *                 type: string
 *                 enum: [present, absent]
 *                 example: present
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *                 description: Optional. Defaults to today if not provided
 *     responses:
 *       200:
 *         description: Attendance set successfully
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
 *                     attendance:
 *                       type: object
 *       400:
 *         description: Validation error, no class assigned, or student doesn't belong to teacher's class
 *       403:
 *         description: Student does not belong to teacher's assigned class
 *       404:
 *         description: Student not found
 */
router.post('/setAttendance', validateSetAttendance, attendanceController.setAttendance);

/**
 * @swagger
 * /api/getAttendanceHistory:
 *   post:
 *     summary: Get attendance history for a student (past 10 days)
 *     tags: [Attendance]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Attendance history retrieved successfully
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
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           studentId:
 *                             type: string
 *                           teacherId:
 *                             type: string
 *                           date:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [present, absent]
 *                     count:
 *                       type: number
 *       400:
 *         description: Validation error
 *       404:
 *         description: Student not found
 */
router.post('/getAttendanceHistory', validateGetAttendanceHistory, attendanceController.getAttendanceHistory);

/**
 * @swagger
 * /api/getClassAttendance:
 *   post:
 *     summary: Get attendance for all students in teacher's assigned class for a specific date
 *     tags: [Attendance]
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
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *                 description: Optional. Defaults to today if not provided
 *     responses:
 *       200:
 *         description: Class attendance retrieved successfully
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
 *                     date:
 *                       type: string
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         present:
 *                           type: number
 *                         absent:
 *                           type: number
 *                         notMarked:
 *                           type: number
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           student:
 *                             type: object
 *                           attendanceStatus:
 *                             type: string
 *                             nullable: true
 *                             enum: [present, absent]
 *                             description: Direct attendance status (null if not marked)
 *                           attendance:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               status:
 *                                 type: string
 *                                 enum: [present, absent]
 *                               date:
 *                                 type: string
 *                     count:
 *                       type: number
 *       400:
 *         description: Validation error or no class assigned yet
 */
router.post('/getClassAttendance', validateGetClassAttendance, attendanceController.getClassAttendance);

module.exports = router;

