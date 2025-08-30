const Joi = require('joi');

// Validation schema for creating a new category
const createCategorySchema = Joi.object({
  name: Joi.string()
    .max(30)
    .required()
    .messages({
      'string.max': 'Category name cannot exceed 30 characters',
      'any.required': 'Category name is required'
    }),
  description: Joi.string()
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Category description cannot exceed 200 characters'
    }),
  color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional()
    .messages({
      'string.pattern.base': 'Color must be a valid hex color code (e.g., #3B82F6)'
    }),
  icon: Joi.string()
    .max(10)
    .optional()
    .messages({
      'string.max': 'Icon cannot exceed 10 characters'
    }),
  isActive: Joi.boolean()
    .optional()
    .default(true),
  sortOrder: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.base': 'Sort order must be a number',
      'number.integer': 'Sort order must be an integer',
      'number.min': 'Sort order must be at least 0'
    })
});

// Validation schema for updating a category
const updateCategorySchema = Joi.object({
  name: Joi.string()
    .max(30)
    .optional()
    .messages({
      'string.max': 'Category name cannot exceed 30 characters'
    }),
  description: Joi.string()
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Category description cannot exceed 200 characters'
    }),
  color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional()
    .messages({
      'string.pattern.base': 'Color must be a valid hex color code (e.g., #3B82F6)'
    }),
  icon: Joi.string()
    .max(10)
    .optional()
    .messages({
      'string.max': 'Icon cannot exceed 10 characters'
    }),
  isActive: Joi.boolean()
    .optional(),
  sortOrder: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Sort order must be a number',
      'number.integer': 'Sort order must be an integer',
      'number.min': 'Sort order must be at least 0'
    })
});

// Validation schema for query parameters
const categoryQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  search: Joi.string()
    .max(30)
    .optional()
    .messages({
      'string.max': 'Search term cannot exceed 30 characters'
    }),
  isActive: Joi.boolean()
    .optional(),
  sortBy: Joi.string()
    .valid('name', 'sortOrder', 'createdAt', 'updatedAt', 'questionCount')
    .default('sortOrder')
    .messages({
      'any.only': 'Please select a valid sort field'
    }),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('asc')
    .messages({
      'any.only': 'Sort order must be either "asc" or "desc"'
    })
});

// Validation middleware functions
const validateCreateCategory = (req, res, next) => {
  const { error } = createCategorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.details[0].message
    });
  }
  next();
};

const validateUpdateCategory = (req, res, next) => {
  const { error } = updateCategorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.details[0].message
    });
  }
  next();
};

const validateCategoryQuery = (req, res, next) => {
  const { error } = categoryQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Query validation failed',
      error: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryQuery
};
