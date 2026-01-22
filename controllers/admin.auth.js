const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* =========================
   🔐 ADMIN LOGIN (SUPER FINAL + DEBUG)
========================= */
exports.adminLogin = async (req, res) => {
  try {

    console.log("====== 🔍 ADMIN LOGIN DEBUG ======");
    console.log("EMAIL FROM ENV:", process.env.ADMIN_EMAIL);
    console.log("EMAIL FROM BODY:", req.body.email);
    console.log("HASH PRESENT:", !!process.env.ADMIN_PASSWORD_HASH);
    console.log("JWT PRESENT:", !!process.env.JWT_SECRET);

    if (process.env.ADMIN_PASSWORD_HASH) {
      const test = await bcrypt.compare(
        req.body.password || "",
        process.env.ADMIN_PASSWORD_HASH
      );
      console.log("BCRYPT MATCH RESULT:", test);
    }
    console.log("=================================");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password required"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in env");
      return res.status(500).json({
        success: false,
        msg: "Server misconfiguration"
      });
    }

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
      console.error("❌ ADMIN ENV missing");
      return res.status(500).json({
        success: false,
        msg: "Admin credentials not configured"
      });
    }

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    const match = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      msg: "Admin login successful",
      token
    });

  } catch (err) {
    console.error("❌ ADMIN LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};
