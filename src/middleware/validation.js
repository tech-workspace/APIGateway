const Joi = require('joi');

// Validation schemas
const schemas = {
  signup: Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name cannot exceed 100 characters',
        'any.required': 'Full name is required'
      }),
    mobile: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid mobile number',
        'any.required': 'Mobile number is required'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
      })
  }),

  login: Joi.object({
    mobile: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid mobile number',
        'any.required': 'Mobile number is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  updateProfile: Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name cannot exceed 100 characters'
      }),
    mobile: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .messages({
        'string.pattern.base': 'Please enter a valid mobile number'
      }),
    password: Joi.string()
      .min(6)
      .messages({
        'string.min': 'Password must be at least 6 characters long'
      }),
    roleId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .messages({
        'string.pattern.base': 'Invalid role ID format'
      })
  }),

  createUser: Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name cannot exceed 100 characters',
        'any.required': 'Full name is required'
      }),
    mobile: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid mobile number',
        'any.required': 'Mobile number is required'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
      }),
    roleId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .messages({
        'string.pattern.base': 'Invalid role ID format'
      })
  }),

  updateUser: Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name cannot exceed 100 characters'
      }),
    mobile: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .messages({
        'string.pattern.base': 'Please enter a valid mobile number'
      }),
    password: Joi.string()
      .min(6)
      .messages({
        'string.min': 'Password must be at least 6 characters long'
      }),
    roleId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .messages({
        'string.pattern.base': 'Invalid role ID format'
      })
  }),

  userQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().max(100),
    roleId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    sortBy: Joi.string().valid('fullName', 'mobile', 'createdAt', 'updatedAt').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};

// Validation middleware factory
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Validation schema not found'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }

    // Sanitize and set validated data
    req.body = value;
    next();
  };
};

// Export validation functions
module.exports = {
  validateSignup: validate('signup'),
  validateLogin: validate('login'),
  validateUpdateProfile: validate('updateProfile'),
  validateCreateUser: validate('createUser'),
  validateUpdateUser: validate('updateUser'),
  validateUserQuery: validate('userQuery'),
  schemas
};
