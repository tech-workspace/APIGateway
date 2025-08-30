const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByCategory,
  getQuestionsByLevel,
  getCategories,
  getLevels,
  getQuestionStats
} = require('../controllers/questionController');

const {
  validateCreateQuestion,
  validateUpdateQuestion,
  validateQuestionQuery
} = require('../middleware/questionValidation');

const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all question routes
router.use(authenticateToken);

// CRUD Operations
router.post('/', validateCreateQuestion, createQuestion);
router.get('/', validateQuestionQuery, getQuestions);
router.get('/stats', getQuestionStats);
router.get('/categories', getCategories);
router.get('/levels', getLevels);

// Get questions by category
router.get('/category/:category', validateQuestionQuery, getQuestionsByCategory);

// Get questions by level
router.get('/level/:level', validateQuestionQuery, getQuestionsByLevel);

// Individual question operations
router.get('/:id', getQuestionById);
router.put('/:id', validateUpdateQuestion, updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;
