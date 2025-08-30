const Category = require('../models/Category');
const Question = require('../models/Question');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description, color, icon, isActive, sortOrder } = req.body;

    const category = new Category({
      name,
      description: description || '',
      color: color || '#3B82F6',
      icon: icon || '📚',
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error.message);
    
    if (error.message === 'Category name already exists') {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Get all categories with pagination, search, and filtering
const getCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = req.query;

    // Build query object
    const query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Add active filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / parseInt(limit));

    // Execute query
    let categories;
    if (sortBy === 'questionCount') {
      // Use aggregation for question count sorting
      categories = await Category.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'questions',
            localField: '_id',
            foreignField: 'category',
            as: 'questions'
          }
        },
        {
          $addFields: {
            questionCount: { $size: '$questions' }
          }
        },
        {
          $project: {
            questions: 0
          }
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);
    } else {
      // Regular query for other sort fields
      categories = await Category.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');
    }

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: {
        categories,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCategories,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit)
        }
      }
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

// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).select('-__v');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: category
    });
  } catch (error) {
    console.error('Get category by ID error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve category',
      error: error.message
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error.message);
    
    if (error.message === 'Category name already exists') {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has questions
    const questionCount = await Question.countDocuments({ category: id });
    
    if (questionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${questionCount} question(s) associated with it.`
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: { id: category._id }
    });
  } catch (error) {
    console.error('Delete category error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

// Get active categories (for dropdowns, etc.)
const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.findActive().select('name description color icon');

    res.status(200).json({
      success: true,
      message: 'Active categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('Get active categories error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active categories',
      error: error.message
    });
  }
};

// Get categories with question counts
const getCategoriesWithQuestionCounts = async (req, res) => {
  try {
    const categories = await Category.getWithQuestionCounts();

    res.status(200).json({
      success: true,
      message: 'Categories with question counts retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('Get categories with question counts error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories with question counts',
      error: error.message
    });
  }
};

// Bulk update category sort order
const updateCategorySortOrder = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Categories must be an array'
      });
    }

    const updatePromises = categories.map(({ id, sortOrder }) => {
      return Category.findByIdAndUpdate(id, { sortOrder }, { new: true });
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Category sort order updated successfully'
    });
  } catch (error) {
    console.error('Update category sort order error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update category sort order',
      error: error.message
    });
  }
};

// Toggle category active status
const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      data: category
    });
  } catch (error) {
    console.error('Toggle category status error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to toggle category status',
      error: error.message
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getActiveCategories,
  getCategoriesWithQuestionCounts,
  updateCategorySortOrder,
  toggleCategoryStatus
};
