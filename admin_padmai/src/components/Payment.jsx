import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './Payment.css';

const Payment = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    class: '',
    amount: '',
    paymentType: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Student ID validation
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }

    // Student Name validation
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student Name is required';
    } else if (formData.studentName.trim().length < 2) {
      newErrors.studentName = 'Student Name must be at least 2 characters';
    }

    // Class validation
    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }

    // Amount validation
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount)) {
      newErrors.amount = 'Amount must be a valid number (e.g., 100 or 100.50)';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Payment Type validation
    if (!formData.paymentType) {
      newErrors.paymentType = 'Payment Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setErrorMessage('');
    setLoading(true);

    if (validateForm()) {
      try {
        // Call the API to add payment
        const response = await api.addPayment(formData, token || 'dummy-token');
        
        if (response.success) {
          console.log('Payment submitted successfully:', response);
          setSubmitted(true);
          
          // Reset form after 3 seconds
          setTimeout(() => {
            setFormData({
              studentId: '',
              studentName: '',
              class: '',
              amount: '',
              paymentType: ''
            });
            setSubmitted(false);
          }, 3000);
        } else {
          setErrorMessage(response.message || 'Failed to submit payment');
        }
      } catch (error) {
        console.error('Payment submission error:', error);
        setErrorMessage(error.message || 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Payment Form</h2>
        
        {submitted && (
          <div className="success-message">
            Payment submitted successfully!
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="studentId">Student ID *</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              className={`form-input ${errors.studentId ? 'error' : ''}`}
            />
            {errors.studentId && (
              <span className="error-text">{errors.studentId}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="studentName">Student Name *</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student name"
              className={`form-input ${errors.studentName ? 'error' : ''}`}
            />
            {errors.studentName && (
              <span className="error-text">{errors.studentName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="class">Class *</label>
            <input
              type="text"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              placeholder="Enter class"
              className={`form-input ${errors.class ? 'error' : ''}`}
            />
            {errors.class && (
              <span className="error-text">{errors.class}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className={`form-input ${errors.amount ? 'error' : ''}`}
            />
            {errors.amount && (
              <span className="error-text">{errors.amount}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="paymentType">Payment Type *</label>
            <select
              id="paymentType"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className={`form-input ${errors.paymentType ? 'error' : ''}`}
            >
              <option value="">Select payment type</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
            </select>
            {errors.paymentType && (
              <span className="error-text">{errors.paymentType}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
