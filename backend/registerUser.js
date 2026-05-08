const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function registerUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "akanksha@gmail.com";
    const password = "123456";
    const name = "Akanksha";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists, updating password...");
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();
      console.log("Password updated successfully!");
    } else {
      const hashed = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashed,
        role: "user"
      });
      await user.save();
      console.log("User registered successfully!");
    }

    console.log("You can now login with:");
    console.log("Email: akanksha@gmail.com");
    console.log("Password: 123456");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

registerUser();