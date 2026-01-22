const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

console.log("✅ adminAuth routes LOADED");

/* ===============================
   🔐 ADMIN LOGIN (ENV + BCRYPT)
   POST /api/admin/auth/login
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing credentials"
      });
    }

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
      console.error("❌ ADMIN env not configured");
      return res.status(500).json({
        success: false,
        message: "Admin login not configured"
      });
    }

    // ✅ Email check
    if (email !== String(process.env.ADMIN_EMAIL).trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ✅ Password check (bcrypt)
    const match = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!match) {
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
      message: "Admin login successful",
      token
    });

  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
