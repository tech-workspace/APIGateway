const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: [10, 'Question title must be at least 10 characters long'],
    maxlength: [500, 'Question title cannot exceed 500 characters']
  },
  answer: {
    type: String,
    required: [true, 'Question answer is required'],
    trim: true,
    minlength: [20, 'Question answer must be at least 20 characters long'],
    maxlength: [5000, 'Question answer cannot exceed 5000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Question category is required']
  },
  level: {
    type: String,
    required: [true, 'Question level is required'],
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      message: 'Please select a valid level'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
questionSchema.index({ category: 1, level: 1 });
questionSchema.index({ title: 'text', answer: 'text' });
questionSchema.index({ createdAt: -1 });

// Virtual for formatted creation date
questionSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted updated date
questionSchema.virtual('formattedUpdatedAt').get(function() {
  return this.updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to find questions by category
questionSchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

// Static method to find questions by level
questionSchema.statics.findByLevel = function(level) {
  return this.find({ level: level });
};

// Static method to find questions by category and level
questionSchema.statics.findByCategoryAndLevel = function(category, level) {
  return this.find({ category: category, level: level });
};

// Static method to search questions
questionSchema.statics.searchQuestions = function(searchTerm) {
  return this.find({
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { answer: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } }
    ]
  });
};

module.exports = mongoose.model('Question', questionSchema);
