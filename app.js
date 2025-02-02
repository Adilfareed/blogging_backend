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

// CORS Configuration - Allow all arignas for cors
const corsOptions = {
  origin: ["http://localhost:3000", "https://your-frontend-domain.com"], // Replace with your frontend domains
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
