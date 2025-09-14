const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  validateSignup, 
  validateLogin, 
  validateUpdateProfile, 
  validateCreateUser, 
  validateUpdateUser, 
  validateUserQuery 
} = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);

// Protected routes (authentication required)
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, validateUpdateProfile, authController.updateProfile);
router.get('/users', authenticateToken, validateUserQuery, authController.getUsers);

// User management routes (admin functions)
router.post('/users', authenticateToken, validateCreateUser, authController.createUser);
router.get('/users/:id', authenticateToken, authController.getUserById);
router.put('/users/:id', authenticateToken, validateUpdateUser, authController.updateUser);
router.delete('/users/:id', authenticateToken, authController.deleteUser);
router.get('/users/role/:roleId', authenticateToken, validateUserQuery, authController.getUsersByRole);

module.exports = router;
