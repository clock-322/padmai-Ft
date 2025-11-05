require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const studentRoutes = require('./routes/studentRoutes');
const schoolOwnerRoutes = require('./routes/schoolOwnerRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Initialize Express app
const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (Object.keys(req.body).length > 0) {
    console.log('📥 Request Body:', JSON.stringify(req.body, null, 2));
  }
  if (Object.keys(req.query).length > 0) {
    console.log('📥 Query Params:', JSON.stringify(req.query, null, 2));
  }
  if (req.params && Object.keys(req.params).length > 0) {
    console.log('📥 Params:', JSON.stringify(req.params, null, 2));
  }
  next();
});

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
app.use('/api', studentRoutes); // /addStudent, /getParentStudent, /getAllStudents
app.use('/api', schoolOwnerRoutes); // /getTeachers, /assignTeacher
app.use('/api', teacherRoutes); // /getClassStudents
app.use('/api', attendanceRoutes); // /setAttendance, /getAttendanceHistory, /getClassAttendance

// ===== Root & Health Routes =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Padmai Backend API',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      payments: '/api/payments',
      students: '/api/students',
      schoolOwner: '/api/school-owner',
      teacher: '/api/teacher'
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
//testasdfd
module.exports = app;