const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// 🔥 PROOF LOG
console.log("✅ adminAuth routes LOADED");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // ENV se credentials
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // 🔎 DEBUG LOG (temporary – Railway logs me dikhega)
  console.log("LOGIN ATTEMPT:", email, password);
  console.log("EXPECTED:", adminEmail, adminPassword);

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // 🔐 JWT generate
  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    token,
  });
});

module.exports = router;
