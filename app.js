const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();
const path= require('path')
const cors = require('cors');


const app = express();
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();

// Routes
app.use('/api', blogRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
