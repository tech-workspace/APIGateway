require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');
const { 
  applySecurityMiddleware, 
  requestLogger, 
  errorHandler, 
  notFoundHandler 
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB with timeout
const initDatabase = async () => {
  try {
    await connectDB();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('⚠️ Database initialization failed:', error.message);
    console.log('🔄 Server will continue without database connection');
    console.log('🔄 Database operations will fail until connection is restored');
  }
};

// Initialize database (non-blocking)
initDatabase().catch(err => {
  console.error('❌ Database initialization error:', err.message);
});

// Security and utility middleware
const { authLimiter, apiLimiter } = applySecurityMiddleware(app);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to auth routes
app.use('/v1/auth', authLimiter);

// Apply general rate limiting to all other routes
app.use(apiLimiter);

// Routes
app.use('/', routes);

// 404 handler (must be after routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/v1/auth`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
