const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

console.log("🔥 ADMIN AUTH ROUTE LOADED (BYPASS)");

router.post("/login", (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET missing"
      });
    }

    const token = jwt.sign(
      { role: "admin", bypass: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin bypass login successful",
      token
    });

  } catch (err) {
    console.error("ADMIN ROUTE BYPASS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
