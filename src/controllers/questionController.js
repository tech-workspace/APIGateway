const Question = require('../models/Question');

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { title, answer, category, level } = req.body;

    const question = new Question({
      title,
      answer,
      category,
      level
    });

    await question.save();

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (error) {
    console.error('Create question error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create question',
      error: error.message
    });
  }
};

// Get all questions with pagination, search, and filtering
const getQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      level,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    const query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add level filter
    if (level) {
      query.level = level;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalQuestions = await Question.countDocuments(query);
    const totalPages = Math.ceil(totalQuestions / parseInt(limit));

    // Execute query
    const questions = await Question.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      message: 'Questions retrieved successfully',
      data: {
        questions,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalQuestions,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get questions error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve questions',
      error: error.message
    });
  }
};

// Get a single question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id).select('-__v');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question retrieved successfully',
      data: question
    });
  } catch (error) {
    console.error('Get question by ID error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve question',
      error: error.message
    });
  }
};

// Update a question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const question = await Question.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    console.error('Update question error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message
    });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
      data: { id: question._id }
    });
  } catch (error) {
    console.error('Delete question error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message
    });
  }
};

// Get questions by category
const getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = { category };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalQuestions = await Question.countDocuments(query);
    const totalPages = Math.ceil(totalQuestions / parseInt(limit));

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      message: `Questions in ${category} category retrieved successfully`,
      data: {
        questions,
        category,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalQuestions,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get questions by category error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve questions by category',
      error: error.message
    });
  }
};

// Get questions by level
const getQuestionsByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = { level };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalQuestions = await Question.countDocuments(query);
    const totalPages = Math.ceil(totalQuestions / parseInt(limit));

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      message: `${level} level questions retrieved successfully`,
      data: {
        questions,
        level,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalQuestions,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get questions by level error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve questions by level',
      error: error.message
    });
  }
};

// Get available categories
const getCategories = async (req, res) => {
  try {
    const categories = await Question.distinct('category');
    
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message
    });
  }
};

// Get available levels
const getLevels = async (req, res) => {
  try {
    const levels = await Question.distinct('level');
    
    res.status(200).json({
      success: true,
      message: 'Levels retrieved successfully',
      data: levels
    });
  } catch (error) {
    console.error('Get levels error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve levels',
      error: error.message
    });
  }
};

// Get question statistics
const getQuestionStats = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const categoryStats = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const levelStats = await Question.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Question statistics retrieved successfully',
      data: {
        totalQuestions,
        categoryStats,
        levelStats
      }
    });
  } catch (error) {
    console.error('Get question stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve question statistics',
      error: error.message
    });
  }
};

module.exports = {
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
};
