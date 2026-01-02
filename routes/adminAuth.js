const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

/**
 * ADMIN LOGIN (ENV BASED - SIMPLE & SAFE)
 * POST /api/admin/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Read from ENV (trim to avoid hidden space issues)
    const envEmail = process.env.ADMIN_EMAIL?.trim();
    const envPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!envEmail || !envPassword) {
      console.error("❌ ADMIN ENV NOT SET");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Credential check
    if (email.trim() !== envEmail || password.trim() !== envPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { role: "admin", email: envEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Success
    res.json({ token });
  } catch (err) {
    console.error("❌ ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
