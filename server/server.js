require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require('fs');
const path = require('path');

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");


const app = express();

// Route imports
const estimationRoutes = require('./routes/estimationRoutes');
const featureRoutes = require('./routes/featureRoutes');
const projectTypeRoutes = require('./routes/projectTypeRoutes');
const techStackRoutes = require('./routes/techStackRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const { seedDatabase } = require('./seed/seedData');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use('/api/pdf', pdfRoutes);

app.get("/", (req,res)=>{
  res.send("API Running");
});

// --------------- Ensure PDF directory exists ---------------
const pdfDir = process.env.PDF_OUTPUT_DIR || './pdfs';
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

// API Routes
app.use('/api/estimations', estimationRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/project-types", projectTypeRoutes);
app.use("/api/tech-stacks", techStackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

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
