const User = require("./models/user");

const initAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if admin email and password are set in .env
    if (!adminEmail || !adminPassword) {
      console.error("Admin email or password is not set in .env file.");
      return;
    }

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail, role: "admin" });
    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    // Create the admin user
    const admin = new User({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Error initializing admin account:", error.message);
  }
};

module.exports = initAdmin;
