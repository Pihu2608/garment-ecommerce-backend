const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

console.log("✅ adminAuth routes LOADED");

/* ===============================
   ADMIN LOGIN (ENV BASED)
   POST /api/admin/auth/login
================================ */
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = String(process.env.ADMIN_EMAIL).trim();
    const adminPassword = String(process.env.ADMIN_PASSWORD).trim();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    // 🔐 check from .env
    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ✅ create token
    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
