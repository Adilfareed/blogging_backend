const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// CORS Middleware for this route
router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Change * to specific domains if needed
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
});

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

module.exports = router;
