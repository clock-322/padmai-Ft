const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateAddPayment, validateGetPayment } = require('../middleware/validation');

/**
 * @swagger
 * /api/payments/add:
 *   post:
 *     summary: Add a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - studentName
 *               - className
 *               - name
 *               - amount
 *               - paymentType
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: STU001
 *               studentName:
 *                 type: string
 *                 example: John Doe
 *               className:
 *                 type: string
 *                 example: Class 10A
 *               name:
 *                 type: string
 *                 example: Tuition Fee
 *               amount:
 *                 type: number
 *                 example: 5000
 *               paymentType:
 *                 type: string
 *                 example: Monthly
 *     responses:
 *       201:
 *         description: Payment added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/add', authenticateToken, validateAddPayment, paymentController.addPayment);

/**
 * @swagger
 * /api/payments/get:
 *   post:
 *     summary: Get payments by student ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
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
 *                 example: STU001
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       404:
 *         description: No payments found
 *       401:
 *         description: Unauthorized
 */
router.post('/get', authenticateToken, validateGetPayment, paymentController.getPayment);

/**
 * @swagger
 * /api/payments/all:
 *   get:
 *     summary: Get all payments (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Admin role required
 */
router.get('/all', authenticateToken, authorizeRoles('admin'), paymentController.getAllPayments);

module.exports = router;

