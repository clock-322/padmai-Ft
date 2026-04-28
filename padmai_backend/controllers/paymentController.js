const Payment = require('../models/Payment');

// Add Payment
exports.addPayment = async (req, res) => {
  try {
    const { studentId, studentName, className, name, amount, paymentType, dueDate, status } = req.body;
    console.log('💰 Add Payment API called for student:', studentId);

    const payment = await Payment.create({
      studentId,
      studentName,
      className,
      name,
      amount,
      paymentType,
      ...(dueDate && { dueDate }),
      ...(status && { status }),
    });

    console.log('✅ Payment added successfully:', payment._id);
    res.status(201).json({
      success: true,
      message: 'Payment added successfully',
      data: {
        payment
      }
    });
  } catch (error) {
    console.error('❌ Add payment error:', error.message);
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
    console.log('💰 Get Payment API called for student:', studentId);

    const payments = await Payment.findWithSort({ studentId });

    if (payments.length === 0) {
      console.log('❌ No payments found for student:', studentId);
      return res.status(404).json({
        success: false,
        message: 'No payments found for this student ID'
      });
    }

    console.log('✅ Payments retrieved for student:', studentId, 'Count:', payments.length);
    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: {
        payments,
        count: payments.length
      }
    });
  } catch (error) {
    console.error('❌ Get payment error:', error.message);
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
    console.log('💰 Get All Payments API called by:', req.user?.email);
    const payments = await Payment.findWithSort();

    console.log('✅ All payments retrieved. Count:', payments.length);
    res.status(200).json({
      success: true,
      message: 'All payments retrieved successfully',
      data: {
        payments,
        count: payments.length
      }
    });
  } catch (error) {
    console.error('❌ Get all payments error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching all payments',
      error: error.message
    });
  }
};

