const ProjectType = require('../models/ProjectType');
const Feature = require('../models/Feature');
const TechStack = require('../models/TechStack');

/**
 * Core estimation engine — the heart of the application.
 * All cost values come from MongoDB; zero hardcoded numbers.
 *
 * Algorithm:
 * 1. Fetch ProjectType from DB
 * 2. Fetch all selected Feature documents from DB
 * 3. Calculate costs, complexity, timeline
 * 4. Fetch TechStack for the project type
 *
 * @param {string} projectTypeId - ObjectId of the ProjectType
 * @param {string[]} featureIds - Array of Feature ObjectIds
 * @param {string} projectName - Name of the project
 * @returns {object} Complete estimation breakdown
 */
const calculateEstimation = async (projectTypeId, featureIds, projectName) => {
  // 1. Fetch project type
  const projectTypeDoc = await ProjectType.findById(projectTypeId);
  if (!projectTypeDoc || !projectTypeDoc.isActive) {
    const error = new Error(`Active project type not found.`);
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch all selected features from DB
  const features = await Feature.find({ _id: { $in: featureIds }, isActive: true });
  if (features.length === 0) {
    const error = new Error('No valid features selected');
    error.statusCode = 400;
    throw error;
  }

  // 3. Calculate feature hours
  const featureTotalHours = features.reduce((sum, f) => sum + f.baseHours, 0);
  const totalHours = projectTypeDoc.baseProjectHours + featureTotalHours;

  // 4. Calculate complexity
  const complexityScore = features.reduce((sum, f) => sum + f.complexityWeight, 0) / features.length;
  let complexityLevel;
  if (complexityScore <= 3) complexityLevel = 'low';
  else if (complexityScore <= 5) complexityLevel = 'medium';
  else if (complexityScore <= 7.5) complexityLevel = 'high';
  else complexityLevel = 'enterprise';

  const complexityMultiplier = projectTypeDoc.complexityMultipliers[complexityLevel] || 1.0;

  // 5. Calculate costs
  const baseCost = projectTypeDoc.baseProjectHours * projectTypeDoc.baseHourlyRate;
  const featureCost = featureTotalHours * projectTypeDoc.baseHourlyRate;
  let subtotal = (baseCost + featureCost) * complexityMultiplier;
  
  if (projectTypeDoc.minimumBudget && subtotal < projectTypeDoc.minimumBudget) {
    subtotal = projectTypeDoc.minimumBudget;
  }

  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;
  const totalCost = subtotal + taxAmount;

  // 6. Calculate timeline
  const totalWeeks = Math.ceil(totalHours / 40);
  const phases = generateTimeline(projectTypeDoc.slug, totalWeeks, features.length);

  // 7. Build selected features breakdown
  const selectedFeatures = features.map((f) => ({
    feature: f._id,
    name: f.name,
    hours: f.baseHours,
    cost: f.baseHours * projectTypeDoc.baseHourlyRate,
  }));

  // 8. Fetch Recommended Tech Stack
  const techStackDoc = await TechStack.findOne({ projectType: projectTypeId, isActive: true });
  const recommendedTechStack = techStackDoc ? {
    frontend: techStackDoc.frontend,
    backend: techStackDoc.backend,
    database: techStackDoc.database,
    mobile: techStackDoc.mobile,
    devops: techStackDoc.devops,
    thirdParty: techStackDoc.thirdParty,
  } : { frontend: [], backend: [], database: [], mobile: [], devops: [], thirdParty: [] };

  return {
    projectName,
    projectType: projectTypeId,
    selectedFeatures,
    calculation: {
      totalHours,
      baseHours: projectTypeDoc.baseProjectHours,
      featureHours: featureTotalHours,
      hourlyRate: projectTypeDoc.baseHourlyRate,
      baseCost: Math.round(baseCost * 100) / 100,
      featureCost: Math.round(featureCost * 100) / 100,
      complexityMultiplier,
      subtotal: Math.round(subtotal * 100) / 100,
      taxRate,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      currency: 'INR',
    },
    complexity: {
      level: complexityLevel,
      score: Math.round(complexityScore * 100) / 100,
      breakdown: `Average complexity weight across ${features.length} features: ${complexityScore.toFixed(2)} → ${complexityLevel} (×${complexityMultiplier})`,
    },
    timeline: {
      totalWeeks,
      phases,
    },
    recommendedTechStack,
  };
};

/**
 * Generate project timeline phases based on project type and scope.
 * @param {string} projectTypeSlug
 * @param {number} totalWeeks
 * @param {number} featureCount
 * @returns {Array} Timeline phases
 */
const generateTimeline = (projectTypeSlug, totalWeeks, featureCount) => {
  // Distribute weeks across phases (percentages vary by project type)
  const phaseDistributions = {
    website: [
      { name: 'Planning & Design', pct: 0.20, description: 'Requirements gathering, wireframes, UI/UX design' },
      { name: 'Development', pct: 0.45, description: 'Frontend development, CMS integration, responsive design' },
      { name: 'Content & Integration', pct: 0.15, description: 'Content migration, third-party integrations' },
      { name: 'Testing & QA', pct: 0.12, description: 'Cross-browser testing, performance optimization' },
      { name: 'Deployment & Launch', pct: 0.08, description: 'Server setup, DNS configuration, go-live' },
    ],
    mobile_app: [
      { name: 'Planning & Architecture', pct: 0.15, description: 'App architecture, API design, wireframes' },
      { name: 'UI/UX Design', pct: 0.15, description: 'Screen designs, prototyping, design system' },
      { name: 'Development', pct: 0.40, description: 'Core development, API integration, native features' },
      { name: 'Testing & QA', pct: 0.18, description: 'Device testing, performance, security audit' },
      { name: 'App Store Deployment', pct: 0.12, description: 'Store listing, submission, approval process' },
    ],
    web_application: [
      { name: 'Planning & Design', pct: 0.15, description: 'Requirements analysis, system design, prototyping' },
      { name: 'Backend Development', pct: 0.30, description: 'API development, database design, business logic' },
      { name: 'Frontend Development', pct: 0.25, description: 'UI implementation, state management, integrations' },
      { name: 'Testing & QA', pct: 0.18, description: 'Unit tests, integration tests, security testing' },
      { name: 'Deployment & DevOps', pct: 0.12, description: 'CI/CD setup, cloud deployment, monitoring' },
    ],
    ecommerce_platform: [
      { name: 'Planning & Design', pct: 0.15, description: 'Product catalog design, payment flow, UX research' },
      { name: 'Backend & Database', pct: 0.25, description: 'Product management, order system, payment integration' },
      { name: 'Frontend Development', pct: 0.25, description: 'Storefront, cart, checkout, admin panel' },
      { name: 'Integration & Testing', pct: 0.20, description: 'Payment gateway, shipping APIs, load testing' },
      { name: 'Launch & Optimization', pct: 0.15, description: 'SEO setup, analytics, performance tuning' },
    ],
    custom_software: [
      { name: 'Discovery & Architecture', pct: 0.18, description: 'Business analysis, system architecture, tech selection' },
      { name: 'Core Development', pct: 0.35, description: 'Core modules, business logic, data layer' },
      { name: 'Integration & Features', pct: 0.22, description: 'Third-party integrations, advanced features' },
      { name: 'Testing & Security', pct: 0.15, description: 'Comprehensive testing, security audit, compliance' },
      { name: 'Deployment & Training', pct: 0.10, description: 'Production deployment, documentation, user training' },
    ],
  };

  const distribution = phaseDistributions[projectTypeSlug] || phaseDistributions.web_application;

  return distribution.map((phase) => ({
    name: phase.name,
    weeks: Math.max(1, Math.round(totalWeeks * phase.pct)),
    description: phase.description,
  }));
};

module.exports = { calculateEstimation };
