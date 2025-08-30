const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [30, 'Category name cannot exceed 30 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Category description cannot exceed 200 characters'],
    default: ''
  },
  color: {
    type: String,
    trim: true,
    default: '#3B82F6', // Default blue color
    validate: {
      validator: function(v) {
        // Basic hex color validation
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Color must be a valid hex color code'
    }
  },
  icon: {
    type: String,
    trim: true,
    default: '📚',
    maxlength: [10, 'Icon cannot exceed 10 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ createdAt: -1 });

// Virtual for formatted creation date
categorySchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted updated date
categorySchema.virtual('formattedUpdatedAt').get(function() {
  return this.updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to find active categories
categorySchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Static method to find categories by name (case-insensitive)
categorySchema.statics.findByName = function(name) {
  return this.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
};

// Static method to get categories with question counts
categorySchema.statics.getWithQuestionCounts = function() {
  return this.aggregate([
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
    {
      $sort: { sortOrder: 1, name: 1 }
    }
  ]);
};

// Pre-save middleware to ensure unique name
categorySchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    const existingCategory = await this.constructor.findOne({
      name: { $regex: new RegExp(`^${this.name}$`, 'i') },
      _id: { $ne: this._id }
    });
    
    if (existingCategory) {
      throw new Error('Category name already exists');
    }
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
