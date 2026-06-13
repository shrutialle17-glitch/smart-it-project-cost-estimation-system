require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Route imports
const featureRoutes = require('./routes/featureRoutes');
const projectTypeRoutes = require('./routes/projectTypeRoutes');
const techStackRoutes = require('./routes/techStackRoutes');

const { seedDatabase } = require('./seed/seedData');

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Smart IT Estimation API Running");
});

// API Routes
app.use("/api/features", featureRoutes);
app.use("/api/project-types", projectTypeRoutes);
app.use("/api/tech-stacks", techStackRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server Started on Port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();