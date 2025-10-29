require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Initialize Express app
const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Swagger Docs =====
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Padmai API Documentation'
  })
);

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// ===== Root & Health Routes =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Padmai Backend API',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      payments: '/api/payments'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error'
  });
});

// ====== DB Connection Logic ======
async function initializeDB() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
}

// ===== Local vs Serverless Handling =====
if (require.main === module) {
  // Running locally
  initializeDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📘 Swagger Docs: http://localhost:${PORT}/api-docs`);
  });
} else {
  // Running on Vercel (serverless)
  initializeDB();
}
//test
module.exports = app;