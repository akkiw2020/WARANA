const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "admin@warana.com";
    const password = "123456";
    const name = "Admin";

    const existingUser = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      console.log("Admin user already exists, updating password and role...");
      existingUser.password = hashedPassword;
      existingUser.role = "admin";
      existingUser.name = name;
      await existingUser.save();
      console.log("Admin user updated successfully!");
    } else {
      console.log("Creating new admin user...");
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: "admin"
      });
      await user.save();
      console.log("Admin user created successfully!");
    }

    console.log("Admin Login Details:");
    console.log("Email: " + email);
    console.log("Password: " + password);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedAdmin();
