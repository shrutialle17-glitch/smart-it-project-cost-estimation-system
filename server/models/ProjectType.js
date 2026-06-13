const mongoose = require('mongoose');

const projectTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
  },
  baseProjectHours: {
    type: Number,
    required: true,
  },
  baseHourlyRate: {
    type: Number,
    required: true,
  },
  complexityMultipliers: {
    low: { type: Number, default: 1.0 },
    medium: { type: Number, default: 1.3 },
    high: { type: Number, default: 1.7 },
    enterprise: { type: Number, default: 2.2 },
  },
  minimumBudget: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ProjectType', projectTypeSchema);
