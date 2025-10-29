// Vercel serverless function entry point
const app = require('../server');
const connectDB = require('../config/database');

// Connect to MongoDB (with caching for serverless)
connectDB().catch(console.error);

module.exports = app;

