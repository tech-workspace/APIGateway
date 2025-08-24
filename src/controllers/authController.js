const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Helper function to create standardized response
const createResponse = (success, message, data = null, errors = null) => {
  const response = { success, message };
  if (data) response.data = data;
  if (errors) response.errors = errors;
  return response;
};

// Signup controller
const signup = async (req, res) => {
  try {
    const { fullName, mobile, password } = req.body;

    // Check if user already exists
    const existingUser = await User.mobileExists(mobile);
    if (existingUser) {
      return res.status(409).json(
        createResponse(false, 'User with this mobile number already exists')
      );
    }

    // Create new user
    const user = new User({
      fullName,
      mobile,
      password
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(
      createResponse(true, 'User created successfully', {
        user: userResponse,
        token
      })
    );

  } catch (error) {
    console.error('Signup error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json(
        createResponse(false, 'User with this mobile number already exists')
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json(
        createResponse(false, 'Validation failed', null, errors)
      );
    }

    res.status(500).json(
      createResponse(false, 'Internal server error')
    );
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Find user by mobile and include password for comparison
    const user = await User.findOne({ mobile }).select('+password');
    
    if (!user) {
      return res.status(401).json(
        createResponse(false, 'Invalid mobile number or password')
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json(
        createResponse(false, 'Invalid mobile number or password')
      );
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json(
      createResponse(true, 'Login successful', {
        user: userResponse,
        token
      })
    );

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error')
    );
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    res.status(200).json(
      createResponse(true, 'Profile retrieved successfully', { user })
    );

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error')
    );
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;
    const userId = req.user._id;

    // Only allow updating fullName for now
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json(
        createResponse(false, 'User not found')
      );
    }

    res.status(200).json(
      createResponse(true, 'Profile updated successfully', { user: updatedUser })
    );

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json(
        createResponse(false, 'Validation failed', null, errors)
      );
    }

    res.status(500).json(
      createResponse(false, 'Internal server error')
    );
  }
};

// Get all users list
const getUsers = async (req, res) => {
  try {
    // Get query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    
    // Get users with pagination and search
    const users = await User.find(searchQuery)
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json(
      createResponse(true, 'Users retrieved successfully', {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit,
          hasNextPage,
          hasPrevPage
        }
      })
    );

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json(
      createResponse(false, 'Internal server error')
    );
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  getUsers
};
