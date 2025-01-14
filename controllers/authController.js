const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      // Ensure required fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Validate role
      if (role && !["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role." });
      }
  
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered." });
      }
  
      // Create and save the user
      const user = new User({ name, email, password, role });
      await user.save();
  
      // Generate JWT with role
      const token = jwt.sign(
        { id: user._id, role: user.role },
        "your_jwt_secret",
        { expiresIn: "100h" }
      );
  
      res.status(201).json({
        message: "User registered successfully.",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: "Error registering user.", error: error.message });
    }
  };
  
  

// Login
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
  
      // Generate JWT with role
      const token = jwt.sign(
        { id: user._id, role: user.role },
        "your_jwt_secret",
        { expiresIn: "100h" }
      );
  
      res.status(200).json({
        message: "Login successful.",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in.", error: error.message });
    }
  };
  
  