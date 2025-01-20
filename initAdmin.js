const User = require("./models/user");
const bcrypt = require("bcrypt");

const initAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("Admin email or password not set in .env file.");
      return;
    }

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      const isPasswordMatch = await bcrypt.compare(adminPassword, existingAdmin.password);
      if (!isPasswordMatch) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log("Admin password updated.");
      } else {
        console.log("Admin user already exists with matching credentials.");
      }
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create a new admin user
    const adminUser = new User({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

module.exports = initAdmin;
