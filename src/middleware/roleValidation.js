const Joi = require('joi');

// Validation schema for creating a role
const createRoleSchema = Joi.object({
  roleConst: Joi.string()
    .required()
    .trim()
    .max(50)
    .pattern(/^[A-Z0-9_]+$/)
    .messages({
      'string.empty': 'Role constant is required',
      'string.max': 'Role constant cannot exceed 50 characters',
      'string.pattern.base': 'Role constant must contain only uppercase letters, numbers, and underscores'
    })
});

// Validation schema for updating a role
const updateRoleSchema = Joi.object({
  roleConst: Joi.string()
    .trim()
    .max(50)
    .pattern(/^[A-Z0-9_]+$/)
    .messages({
      'string.max': 'Role constant cannot exceed 50 characters',
      'string.pattern.base': 'Role constant must contain only uppercase letters, numbers, and underscores'
    })
});

// Validation schema for role query parameters
const roleQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().max(100),
  sortBy: Joi.string().valid('roleConst', 'createdAt', 'updatedAt').default('roleConst'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
});

// Validation schema for bulk role operations
const bulkRoleSchema = Joi.object({
  roles: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      roleConst: Joi.string().trim().max(50).pattern(/^[A-Z0-9_]+$/)
    })
  ).min(1).max(50)
});

// Middleware to validate create role request
const validateCreateRole = (req, res, next) => {
  const { error } = createRoleSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }
  
  next();
};

// Middleware to validate update role request
const validateUpdateRole = (req, res, next) => {
  const { error } = updateRoleSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }
  
  next();
};

// Middleware to validate role query parameters
const validateRoleQuery = (req, res, next) => {
  const { error } = roleQuerySchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }
  
  next();
};

// Middleware to validate bulk role operations
const validateBulkRole = (req, res, next) => {
  const { error } = bulkRoleSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }
  
  next();
};

module.exports = {
  validateCreateRole,
  validateUpdateRole,
  validateRoleQuery,
  validateBulkRole
};
