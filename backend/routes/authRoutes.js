const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Registration attempt:", { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailNormalized = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      console.log("User already exists:", emailNormalized);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const role = emailNormalized === "admin@warana.com" ? "admin" : "user";

    const user = new User({
      name,
      email: emailNormalized,
      password: hashed,
      role,
    });

    await user.save();
    console.log("User registered successfully:", emailNormalized);

    res.status(201).json({ message: "User Registered Successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailTrimmed = (email || "").trim();
    const emailRegex = new RegExp("^" + emailTrimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");

    const user = await User.findOne({ email: emailRegex });

    if (!user) {
      console.log("User not found in DB");
      return res.status(400).json({ message: "User not found" });
    }

    console.log("Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      name: user.name,
      role: user.role || "user",
      phone: user.phone || "",
      address: user.address || ""
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Google Login
router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        name,
        email,
        password: await bcrypt.hash(email + Date.now(), 10), // Placeholder password
        role: "user",
        profilePicture: picture,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token: jwtToken,
      name: user.name,
      role: user.role,
      profilePicture: user.profilePicture,
      phone: user.phone || "",
      address: user.address || ""
    });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google Login Failed", error: error.message });
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // In a real app, send email here. For now, we return it in response for demonstration.
    // console.log(`Reset Token for ${email}: ${resetToken}`);
    
    res.json({ 
      message: "Reset token generated successfully", 
      resetToken: resetToken // Returning token for convenience in this environment
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;