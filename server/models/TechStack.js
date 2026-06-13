const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema({
  projectType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectType',
    required: true,
    unique: true,
  },
  frontend: {
    type: [String],
    default: [],
  },
  backend: {
    type: [String],
    default: [],
  },
  database: {
    type: [String],
    default: [],
  },
  mobile: {
    type: [String],
    default: [],
  },
  devops: {
    type: [String],
    default: [],
  },
  thirdParty: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('TechStack', techStackSchema);
