const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const questionRoutes = require('./questions');
const categoryRoutes = require('./categories');
const roleRoutes = require('./roles');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API versioning
router.use('/v1/auth', authRoutes);
router.use('/v1/questions', questionRoutes);
router.use('/v1/categories', categoryRoutes);
router.use('/v1/roles', roleRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to API Gateway',
    version: '1.0.0',
    endpoints: {
      auth: '/v1/auth',
      questions: '/v1/questions',
      categories: '/v1/categories',
      roles: '/v1/roles',
      health: '/health'
    },
    documentation: 'API documentation coming soon'
  });
});

module.exports = router;
