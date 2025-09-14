const Role = require('../models/Role');
const User = require('../models/User');

// Create a new role
const createRole = async (req, res) => {
  try {
    const { roleConst } = req.body;

    const role = new Role({
      roleConst: roleConst.toUpperCase()
    });

    await role.save();

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    console.error('Create role error:', error.message);
    
    if (error.message === 'Role constant already exists') {
      return res.status(400).json({
        success: false,
        message: 'Role constant already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message
    });
  }
};

// Get all roles with pagination, search, and filtering
const getRoles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'roleConst',
      sortOrder = 'asc'
    } = req.query;

    // Build query object
    const query = {};

    // Add search functionality
    if (search) {
      query.roleConst = { $regex: search, $options: 'i' };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRoles = await Role.countDocuments(query);
    const totalPages = Math.ceil(totalRoles / parseInt(limit));

    // Execute query
    const roles = await Role.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      message: 'Roles retrieved successfully',
      data: {
        roles,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRoles,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get roles error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve roles',
      error: error.message
    });
  }
};

// Get a single role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id).select('-__v');

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role retrieved successfully',
      data: role
    });
  } catch (error) {
    console.error('Get role by ID error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve role',
      error: error.message
    });
  }
};

// Update a role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Convert roleConst to uppercase if provided
    if (updateData.roleConst) {
      updateData.roleConst = updateData.roleConst.toUpperCase();
    }

    const role = await Role.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    console.error('Update role error:', error.message);
    
    if (error.message === 'Role constant already exists') {
      return res.status(400).json({
        success: false,
        message: 'Role constant already exists'
      });
    }
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: error.message
    });
  }
};

// Delete a role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if role has users
    const userCount = await User.countDocuments({ roleId: id });
    
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. It has ${userCount} user(s) associated with it.`
      });
    }

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
      data: { id: role._id }
    });
  } catch (error) {
    console.error('Delete role error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete role',
      error: error.message
    });
  }
};

// Get roles with user counts
const getRolesWithUserCounts = async (req, res) => {
  try {
    const roles = await Role.getWithUserCounts();

    res.status(200).json({
      success: true,
      message: 'Roles with user counts retrieved successfully',
      data: roles
    });
  } catch (error) {
    console.error('Get roles with user counts error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve roles with user counts',
      error: error.message
    });
  }
};

// Get role by constant
const getRoleByConst = async (req, res) => {
  try {
    const { roleConst } = req.params;

    const role = await Role.findByRoleConst(roleConst);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role retrieved successfully',
      data: role
    });
  } catch (error) {
    console.error('Get role by constant error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve role',
      error: error.message
    });
  }
};

// Bulk update roles
const bulkUpdateRoles = async (req, res) => {
  try {
    const { roles } = req.body;

    if (!Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        message: 'Roles must be an array'
      });
    }

    const updatePromises = roles.map(({ id, roleConst }) => {
      const updateData = {};
      if (roleConst) {
        updateData.roleConst = roleConst.toUpperCase();
      }
      return Role.findByIdAndUpdate(id, updateData, { new: true });
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Roles updated successfully'
    });
  } catch (error) {
    console.error('Bulk update roles error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update roles',
      error: error.message
    });
  }
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getRolesWithUserCounts,
  getRoleByConst,
  bulkUpdateRoles
};
