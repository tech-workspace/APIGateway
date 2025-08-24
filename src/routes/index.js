const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

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

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to API Gateway',
    version: '1.0.0',
    endpoints: {
      auth: '/v1/auth',
      health: '/health'
    },
    documentation: 'API documentation coming soon'
  });
});

module.exports = router;
