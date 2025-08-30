const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getActiveCategories,
  getCategoriesWithQuestionCounts,
  updateCategorySortOrder,
  toggleCategoryStatus
} = require('../controllers/categoryController');

const {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryQuery
} = require('../middleware/categoryValidation');

const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all category routes
router.use(authenticateToken);

// CRUD Operations
router.post('/', validateCreateCategory, createCategory);
router.get('/', validateCategoryQuery, getCategories);
router.get('/active', getActiveCategories);
router.get('/with-counts', getCategoriesWithQuestionCounts);

// Individual category operations
router.get('/:id', getCategoryById);
router.put('/:id', validateUpdateCategory, updateCategory);
router.delete('/:id', deleteCategory);

// Special operations
router.patch('/:id/toggle-status', toggleCategoryStatus);
router.put('/sort-order', updateCategorySortOrder);

module.exports = router;
