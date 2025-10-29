const Payment = require('../models/Payment');

// Add Payment
exports.addPayment = async (req, res) => {
  try {
    const { studentId, studentName, className, name, amount, paymentType } = req.body;

    const payment = await Payment.create({
      studentId,
      studentName,
      className,
      name,
      amount,
      paymentType
    });

    res.status(201).json({
      success: true,
      message: 'Payment added successfully',
      data: {
        payment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding payment',
      error: error.message
    });
  }
};

// Get Payment by Student ID
exports.getPayment = async (req, res) => {
  try {
    const { studentId } = req.body;

    const payments = await Payment.find({ studentId }).sort({ createdAt: -1 });

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No payments found for this student ID'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: {
        payments,
        count: payments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// Get All Payments (Admin only)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All payments retrieved successfully',
      data: {
        payments,
        count: payments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all payments',
      error: error.message
    });
  }
};

