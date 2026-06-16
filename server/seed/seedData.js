const mongoose = require("mongoose");
const User = require('../models/User');
const Feature = require("../models/Feature");
const ProjectType = require("../models/ProjectType");
const TechStack = require("../models/TechStack");
const Notification = require("../models/Notification");

const defaultFeatures = [
  {
    name: "User Authentication",
    slug: "user_authentication",
    description: "Login, registration, password reset, and session management",
    category: "core",
    baseHours: 40,
    complexityWeight: 4,
    icon: "shield",
  },
  {
    name: "Payment Gateway",
    slug: "payment_gateway",
    description: "Stripe/PayPal integration for secure online payments",
    category: "integration",
    baseHours: 60,
    complexityWeight: 7,
    icon: "credit-card",
  },
  {
    name: "Real-time Chat",
    slug: "real_time_chat",
    description: "WebSocket-based live chat with message history",
    category: "communication",
    baseHours: 80,
    complexityWeight: 8,
    icon: "message-circle",
  },
  {
    name: "Email Notifications",
    slug: "email_notifications",
    description: "Transactional emails using SendGrid or SES",
    category: "communication",
    baseHours: 25,
    complexityWeight: 3,
    icon: "mail",
  },
  {
    name: "Admin Dashboard",
    slug: "admin_dashboard",
    description: "Analytics, user management, and content administration",
    category: "core",
    baseHours: 70,
    complexityWeight: 6,
    icon: "layout-dashboard",
  },
  {
    name: "File Upload & Storage",
    slug: "file_upload_storage",
    description: "Cloud storage integration with AWS S3 or equivalent",
    category: "storage",
    baseHours: 35,
    complexityWeight: 4,
    icon: "upload-cloud",
  },
  {
    name: "Search & Filtering",
    slug: "search_filtering",
    description: "Full-text search with advanced filters and sorting",
    category: "core",
    baseHours: 30,
    complexityWeight: 5,
    icon: "search",
  },
  {
    name: "AI/ML Integration",
    slug: "ai_ml_integration",
    description: "Machine learning models, chatbots, or recommendation engines",
    category: "ai",
    baseHours: 120,
    complexityWeight: 9,
    icon: "brain",
  },
  {
    name: "Multi-language Support",
    slug: "multi_language_support",
    description: "i18n framework with translation management",
    category: "localization",
    baseHours: 45,
    complexityWeight: 5,
    icon: "globe",
  },
  {
    name: "Analytics & Reporting",
    slug: "analytics_reporting",
    description: "Data visualization, charts, and exportable reports",
    category: "analytics",
    baseHours: 55,
    complexityWeight: 6,
    icon: "bar-chart-3",
  },
  {
    name: "Two-Factor Authentication",
    slug: "two_factor_auth",
    description: "TOTP/SMS-based 2FA for enhanced security",
    category: "security",
    baseHours: 30,
    complexityWeight: 5,
    icon: "lock",
  },
];

const defaultProjectTypes = [
  {
    name: "Website",
    slug: "website",
    description: "Corporate websites, portfolios, landing pages, blogs",
    icon: "Globe",
    baseProjectHours: 80,
    baseHourlyRate: 25,
    complexityMultipliers: {
      low: 1.0,
      medium: 1.3,
      high: 1.7,
      enterprise: 2.2,
    },
    minimumBudget: 1500,
    displayOrder: 1,
  },
  {
    name: "Mobile App",
    slug: "mobile_app",
    description: "iOS and Android mobile applications",
    icon: "Smartphone",
    baseProjectHours: 160,
    baseHourlyRate: 30,
    complexityMultipliers: {
      low: 1.0,
      medium: 1.4,
      high: 1.8,
      enterprise: 2.5,
    },
    minimumBudget: 4000,
    displayOrder: 2,
  },
  {
    name: "Web Application",
    slug: "web_application",
    description: "Complex web apps, SaaS platforms, dashboards",
    icon: "Monitor",
    baseProjectHours: 120,
    baseHourlyRate: 28,
    complexityMultipliers: {
      low: 1.0,
      medium: 1.35,
      high: 1.75,
      enterprise: 2.3,
    },
    minimumBudget: 3000,
    displayOrder: 3,
  },
  {
    name: "E-commerce Platform",
    slug: "ecommerce_platform",
    description: "Online stores with product catalog, cart, and payments",
    icon: "ShoppingCart",
    baseProjectHours: 140,
    baseHourlyRate: 28,
    complexityMultipliers: {
      low: 1.0,
      medium: 1.4,
      high: 1.8,
      enterprise: 2.4,
    },
    minimumBudget: 3500,
    displayOrder: 4,
  },
  {
    name: "Custom Software",
    slug: "custom_software",
    description: "Bespoke business software, ERP, CRM, automation tools",
    icon: "Code2",
    baseProjectHours: 200,
    baseHourlyRate: 35,
    complexityMultipliers: {
      low: 1.0,
      medium: 1.5,
      high: 2.0,
      enterprise: 2.8,
    },
    minimumBudget: 6000,
    displayOrder: 5,
  },
];

const getTechStackData = (slug) => {
  switch (slug) {
    case "website":
      return {
        frontend: ["React", "Next.js", "Tailwind CSS"],
        backend: ["Node.js", "Express"],
        database: ["MongoDB", "PostgreSQL"],
        mobile: [],
        devops: ["Vercel", "Netlify"],
      };
    case "mobile_app":
      return {
        frontend: ["React Native", "Flutter"],
        backend: ["Node.js", "Firebase"],
        database: ["MongoDB", "Firebase Firestore"],
        mobile: ["iOS", "Android"],
        devops: ["App Store", "Play Store", "CI/CD"],
      };
    case "web_application":
      return {
        frontend: ["React", "Vue.js", "Angular"],
        backend: ["Node.js", "Express", "NestJS"],
        database: ["MongoDB", "PostgreSQL", "Redis"],
        mobile: [],
        devops: ["Docker", "AWS", "CI/CD"],
      };
    case "ecommerce_platform":
      return {
        frontend: ["React", "Next.js"],
        backend: ["Node.js", "Express"],
        database: ["MongoDB", "PostgreSQL", "Redis"],
        mobile: ["React Native"],
        devops: ["AWS", "Stripe", "Docker"],
      };
    case "custom_software":
      return {
        frontend: ["React", "Angular"],
        backend: ["Node.js", "Python", "Java"],
        database: ["PostgreSQL", "MongoDB", "Redis"],
        mobile: [],
        devops: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      };
    default:
      return {};
  }
};

const seedDatabase = async () => {
  try {
    //const userCount = await User.countDocuments();
    const featureCount = await Feature.countDocuments();
    const projectTypeCount = await ProjectType.countDocuments();
    const techStackCount = await TechStack.countDocuments();

    if (featureCount === 0) {
      await Feature.insertMany(defaultFeatures);
      console.log(`✅ ${defaultFeatures.length} features seeded`);
    }
    /*
    if (userCount > 0 && featureCount > 0 && projectTypeCount > 0 && techStackCount > 0) {
      console.log('📦 Database already seeded — skipping');
      return;
    }
    
    if (userCount === 0) {
      await User.create({
        name: 'System Admin',
        email: 'admin@smartestimate.com',
        password: 'Admin@123456',
        role: 'admin',
        company: 'Smart Estimate Pro',
      });
      console.log('✅ Admin user seeded');
    }*/
    if (projectTypeCount === 0) {
      const createdProjectTypes =
        await ProjectType.insertMany(defaultProjectTypes);
      console.log(`✅ ${defaultProjectTypes.length} project types seeded`);

      if (techStackCount === 0) {
        const techStacksToInsert = createdProjectTypes.map((pt) => ({
          projectType: pt._id,
          ...getTechStackData(pt.slug),
        }));
        await TechStack.insertMany(techStacksToInsert);
        console.log(`✅ ${techStacksToInsert.length} tech stacks seeded`);
      }
    }

    console.log("🌱 Database seeding complete");
    const notificationCount = await Notification.countDocuments();

    if (notificationCount === 0) {
      await Notification.create({
        recipient: new mongoose.Types.ObjectId("6a30258799bc77ed9f55278c"),
        type: "system",
        title: "Test Notification",
        message: "Notification system is working correctly",
      });

      console.log("✅ Test notification seeded");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { seedDatabase };
