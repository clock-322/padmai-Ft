// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://padmai-ft.vercel.app';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API functions
export const api = {
  // Payment APIs
  addPayment: async (paymentData, token) => {
    return apiCall('/api/payments/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        studentId: paymentData.studentId,
        studentName: paymentData.studentName,
        className: paymentData.class,
        name: paymentData.name || 'Payment',
        amount: parseFloat(paymentData.amount),
        paymentType: paymentData.paymentType,
      }),
    });
  },

  getPayment: async (studentId, token) => {
    return apiCall('/api/payments/get', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId }),
    });
  },

  getAllPayments: async (token) => {
    return apiCall('/api/payments/all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Auth APIs
  login: async (email, password) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name, email, password) => {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  getCurrentUser: async (token) => {
    return apiCall('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};


