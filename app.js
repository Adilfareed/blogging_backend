const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const authRoutes = require("./routes/auth");
const initAdmin = require("./initAdmin");

const app = express();

// CORS Configuration - Allow specific frontend
const corsOptions = {
  origin: 'https://blogging-frontend-inky.vercel.app', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies or credentials
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();
initAdmin();

// Routes
app.use('/api', blogRoutes);
app.use("/api/auth", authRoutes);

// Handle undefined routes (Optional, but good practice)
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
