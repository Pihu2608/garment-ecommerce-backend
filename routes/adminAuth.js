const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

console.log("✅ adminAuth routes LOADED");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const adminEmail = String(process.env.ADMIN_EMAIL).trim();
  const adminPassword = String(process.env.ADMIN_PASSWORD).trim();

  console.log("LOGIN:", email, password);
  console.log("ENV  :", adminEmail, adminPassword);

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ success: true, token });
});

module.exports = router;
