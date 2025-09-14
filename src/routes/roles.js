const express = require('express');
const router = express.Router();
const {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getRolesWithUserCounts,
  getRoleByConst,
  bulkUpdateRoles
} = require('../controllers/roleController');

const {
  validateCreateRole,
  validateUpdateRole,
  validateRoleQuery,
  validateBulkRole
} = require('../middleware/roleValidation');

const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all role routes
router.use(authenticateToken);

// CRUD Operations
router.post('/', validateCreateRole, createRole);
router.get('/', validateRoleQuery, getRoles);
router.get('/with-counts', getRolesWithUserCounts);

// Individual role operations
router.get('/:id', getRoleById);
router.put('/:id', validateUpdateRole, updateRole);
router.delete('/:id', deleteRole);

// Special operations
router.get('/const/:roleConst', getRoleByConst);
router.put('/bulk-update', validateBulkRole, bulkUpdateRoles);

module.exports = router;
