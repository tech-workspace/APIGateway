const User = require('../models/User');
const Role = require('../models/Role');
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
    const { fullName, mobile, password, roleId } = req.body;

    // Check if user already exists
    const existingUser = await User.mobileExists(mobile);
    if (existingUser) {
      return res.status(409).json(
        createResponse(false, 'User with this mobile number already exists')
      );
    }

    // Validate roleId if provided
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json(
          createResponse(false, 'Invalid role ID')
        );
      }
    }

    // Create new user
    const user = new User({
      fullName,
      mobile,
      password,
      roleId: roleId || null
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
    const { fullName, mobile, password, roleId } = req.body;
    const userId = req.user._id;

    // Validate roleId if provided
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json(
          createResponse(false, 'Invalid role ID')
        );
      }
    }

    // Build update object
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (password !== undefined) updateData.password = password;
    if (roleId !== undefined) updateData.roleId = roleId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('roleId', 'roleConst');

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
    const {
      page = 1,
      limit = 10,
      search,
      roleId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build search query
    let searchQuery = {};
    
    // Add search functionality
    if (search) {
      searchQuery.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add role filter
    if (roleId) {
      searchQuery.roleId = roleId;
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    
    // Get users with pagination, search, and role information
    const users = await User.find(searchQuery)
      .select('-password') // Exclude password from response
      .populate('roleId', 'roleConst') // Include role information
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;
    
    res.status(200).json(
      createResponse(true, 'Users retrieved successfully', {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          limit: parseInt(limit),
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

// Create a new user (admin function)
const createUser = async (req, res) => {
  try {
    const { fullName, mobile, password, roleId } = req.body;

    // Check if user already exists
    const existingUser = await User.mobileExists(mobile);
    if (existingUser) {
      return res.status(409).json(
        createResponse(false, 'User with this mobile number already exists')
      );
    }

    // Validate roleId if provided
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json(
          createResponse(false, 'Invalid role ID')
        );
      }
    }

    // Create new user
    const user = new User({
      fullName,
      mobile,
      password,
      roleId: roleId || null
    });

    await user.save();

    // Get user with role information
    const userWithRole = await User.findById(user._id)
      .select('-password')
      .populate('roleId', 'roleConst');

    res.status(201).json(
      createResponse(true, 'User created successfully', { user: userWithRole })
    );

  } catch (error) {
    console.error('Create user error:', error);

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

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password')
      .populate('roleId', 'roleConst');

    if (!user) {
      return res.status(404).json(
        createResponse(false, 'User not found')
      );
    }

    res.status(200).json(
      createResponse(true, 'User retrieved successfully', { user })
    );

  } catch (error) {
    console.error('Get user by ID error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json(
        createResponse(false, 'Invalid user ID format')
      );
    }

    res.status(500).json(
      createResponse(false, 'Internal server error')
    );
  }
};

// Update user by ID (admin function)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, mobile, password, roleId } = req.body;

    // Validate roleId if provided
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json(
          createResponse(false, 'Invalid role ID')
        );
      }
    }

    // Build update object
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (password !== undefined) updateData.password = password;
    if (roleId !== undefined) updateData.roleId = roleId;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('roleId', 'roleConst');

    if (!updatedUser) {
      return res.status(404).json(
        createResponse(false, 'User not found')
      );
    }

    res.status(200).json(
      createResponse(true, 'User updated successfully', { user: updatedUser })
    );

  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json(
        createResponse(false, 'Invalid user ID format')
      );
    }
    
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

// Delete user by ID (admin function)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user._id.toString() === id) {
      return res.status(400).json(
        createResponse(false, 'Cannot delete your own account')
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json(
        createResponse(false, 'User not found')
      );
    }

    res.status(200).json(
      createResponse(true, 'User deleted successfully', { id: user._id })
    );

  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json(
        createResponse(false, 'Invalid user ID format')
      );
    }

    res.status(500).json(
      createResponse(false, 'Internal server error')
    );
  }
};

// Get users by role
const getUsersByRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Validate role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json(
        createResponse(false, 'Role not found')
      );
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build search query
    let searchQuery = { roleId };
    
    // Add search functionality
    if (search) {
      searchQuery.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    
    // Get users with pagination and role information
    const users = await User.find(searchQuery)
      .select('-password')
      .populate('roleId', 'roleConst')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;
    
    res.status(200).json(
      createResponse(true, 'Users retrieved successfully', {
        users,
        role: {
          _id: role._id,
          roleConst: role.roleConst
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      })
    );

  } catch (error) {
    console.error('Get users by role error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json(
        createResponse(false, 'Invalid role ID format')
      );
    }

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
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole
};
