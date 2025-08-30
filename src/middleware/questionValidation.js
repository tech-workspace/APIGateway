const Joi = require('joi');

// Validation schema for creating a new question
const createQuestionSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Question title must be at least 10 characters long',
      'string.max': 'Question title cannot exceed 500 characters',
      'any.required': 'Question title is required'
    }),
  answer: Joi.string()
    .min(20)
    .max(5000)
    .required()
    .messages({
      'string.min': 'Question answer must be at least 20 characters long',
      'string.max': 'Question answer cannot exceed 5000 characters',
      'any.required': 'Question answer is required'
    }),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Category must be a valid MongoDB ObjectId',
      'any.required': 'Question category is required'
    }),
  level: Joi.string()
    .valid('Beginner', 'Intermediate', 'Advanced', 'Expert')
    .required()
    .messages({
      'any.only': 'Please select a valid level',
      'any.required': 'Question level is required'
    })
});

// Validation schema for updating a question
const updateQuestionSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(500)
    .optional()
    .messages({
      'string.min': 'Question title must be at least 10 characters long',
      'string.max': 'Question title cannot exceed 500 characters'
    }),
  answer: Joi.string()
    .min(20)
    .max(5000)
    .optional()
    .messages({
      'string.min': 'Question answer must be at least 20 characters long',
      'string.max': 'Question answer cannot exceed 5000 characters'
    }),
  category: Joi.string()
    .valid('JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Database', 'DevOps', 'System Design', 'Algorithms', 'Data Structures', 'Other')
    .optional()
    .messages({
      'any.only': 'Please select a valid category'
    }),
  level: Joi.string()
    .valid('Beginner', 'Intermediate', 'Advanced', 'Expert')
    .optional()
    .messages({
      'any.only': 'Please select a valid level'
    })
});

// Validation schema for query parameters
const questionQuerySchema = Joi.object({
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
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Search term must be at least 2 characters long',
      'string.max': 'Search term cannot exceed 100 characters'
    }),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Category must be a valid MongoDB ObjectId'
    }),
  level: Joi.string()
    .valid('Beginner', 'Intermediate', 'Advanced', 'Expert')
    .optional()
    .messages({
      'any.only': 'Please select a valid level'
    }),
  sortBy: Joi.string()
    .valid('title', 'category', 'level', 'createdAt', 'updatedAt')
    .default('createdAt')
    .messages({
      'any.only': 'Please select a valid sort field'
    }),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either "asc" or "desc"'
    })
});

// Validation middleware functions
const validateCreateQuestion = (req, res, next) => {
  const { error } = createQuestionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.details[0].message
    });
  }
  next();
};

const validateUpdateQuestion = (req, res, next) => {
  const { error } = updateQuestionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.details[0].message
    });
  }
  next();
};

const validateQuestionQuery = (req, res, next) => {
  const { error } = questionQuerySchema.validate(req.query);
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
  validateCreateQuestion,
  validateUpdateQuestion,
  validateQuestionQuery
};
