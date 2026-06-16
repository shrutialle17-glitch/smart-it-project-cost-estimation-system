const mongoose = require('mongoose');

const estimationSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client is required'],
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters'],
  },
  projectType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectType',
    required: [true, 'Project type is required'],
  },
  selectedFeatures: [{
    feature: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature' },
    name: String,
    hours: Number,
    cost: Number,
  }],
  calculation: {
    totalHours: Number,
    baseHours: Number,
    featureHours: Number,
    hourlyRate: Number,
    baseCost: Number,
    featureCost: Number,
    complexityMultiplier: Number,
    subtotal: Number,
    taxRate: { type: Number, default: 0.18 },
    taxAmount: Number,
    totalCost: Number,
    currency: { type: String, default: 'INR' },
  },
  complexity: {
    level: {
      type: String,
      enum: ['low', 'medium', 'high', 'enterprise'],
    },
    score: Number,
    breakdown: String,
  },
  timeline: {
    totalWeeks: Number,
    phases: [{
      name: String,
      weeks: Number,
      description: String,
    }],
  },
  recommendedTechStack: {
    frontend: [String],
    backend: [String],
    database: [String],
    mobile: [String],
    devops: [String],
  },
  status: {
    type: String,
    enum: ['draft', 'saved', 'sent', 'accepted', 'rejected'],
    default: 'saved',
  },
  notes: {
    type: String,
    trim: true,
  },
  pdfPath: {
    type: String,
  },
}, {
  timestamps: true,
});

estimationSchema.index({ client: 1, createdAt: -1 });
estimationSchema.index({ status: 1 });
estimationSchema.index({ projectType: 1 });

module.exports = mongoose.model('Estimation', estimationSchema);
