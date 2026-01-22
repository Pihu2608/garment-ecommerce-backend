const jwt = require("jsonwebtoken");

console.log("🔥 ADMIN AUTH CONTROLLER LOADED (BYPASS MODE)");

/* =========================
   🔐 ADMIN LOGIN (TEMP BYPASS)
========================= */
exports.adminLogin = async (req, res) => {
  try {

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET missing"
      });
    }

    // 🔓 DIRECT ADMIN TOKEN (NO CHECK)
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
    console.error("ADMIN BYPASS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
