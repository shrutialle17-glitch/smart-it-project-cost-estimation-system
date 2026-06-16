const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Feature name is required'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Feature slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['core', 'security', 'integration', 'ai', 'communication', 'analytics', 'storage', 'localization'],
    required: [true, 'Category is required'],
  },
  baseHours: {
    type: Number,
    required: [true, 'Base hours are required'],
    min: [1, 'Base hours must be at least 1'],
  },
  complexityWeight: {
    type: Number,
    required: [true, 'Complexity weight is required'],
    min: [1, 'Complexity weight must be at least 1'],
    max: [10, 'Complexity weight cannot exceed 10'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: 'box',
  },
}, {
  timestamps: true,
});

// Auto-generate slug from name before validation
featureSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
  }
  next();
});

featureSchema.index({ category: 1 });
featureSchema.index({ isActive: 1 });

module.exports = mongoose.model('Feature', featureSchema);
