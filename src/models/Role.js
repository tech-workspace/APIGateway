const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleConst: {
    type: String,
    required: [true, 'Role constant is required'],
    trim: true,
    unique: true,
    uppercase: true,
    maxlength: [50, 'Role constant cannot exceed 50 characters'],
    validate: {
      validator: function(v) {
        // Only allow alphanumeric characters and underscores
        return /^[A-Z0-9_]+$/.test(v);
      },
      message: 'Role constant must contain only uppercase letters, numbers, and underscores'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
roleSchema.index({ roleConst: 1 });
roleSchema.index({ createdAt: -1 });

// Virtual for formatted creation date
roleSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt ? this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
});

// Virtual for formatted updated date
roleSchema.virtual('formattedUpdatedAt').get(function() {
  return this.updatedAt ? this.updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
});

// Static method to find role by constant
roleSchema.statics.findByRoleConst = function(roleConst) {
  return this.findOne({ roleConst: roleConst.toUpperCase() });
};

// Static method to get roles with user counts
roleSchema.statics.getWithUserCounts = function() {
  return this.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'roleId',
        as: 'users'
      }
    },
    {
      $addFields: {
        userCount: { $size: '$users' }
      }
    },
    {
      $project: {
        users: 0
      }
    },
    {
      $sort: { roleConst: 1 }
    }
  ]);
};

// Pre-save middleware to ensure unique roleConst
roleSchema.pre('save', async function(next) {
  if (this.isModified('roleConst')) {
    const existingRole = await this.constructor.findOne({
      roleConst: this.roleConst,
      _id: { $ne: this._id }
    });
    
    if (existingRole) {
      throw new Error('Role constant already exists');
    }
  }
  next();
});

module.exports = mongoose.model('Role', roleSchema);
