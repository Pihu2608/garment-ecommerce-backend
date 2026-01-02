const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // ✅ SAFE ENV READ (trim added)
  const envEmail = process.env.ADMIN_EMAIL?.trim();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();

  // DEBUG LOGS (temporary – test ke baad hata sakte ho)
  console.log("LOGIN TRY:", email, password);
  console.log("ENV EMAIL:", envEmail);
  console.log("ENV PASSWORD:", envPassword);

  if (email !== envEmail || password !== envPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

module.exports = router;
