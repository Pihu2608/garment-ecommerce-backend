const jwt = require("jsonwebtoken");

/* =========================
   🔐 VERIFY ADMIN JWT
========================= */
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in env");
      return res.status(500).json({
        success: false,
        message: "Server misconfiguration"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Only admin allowed
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    // attach admin info to request
    req.admin = decoded;

    next();

  } catch (err) {
    console.error("❌ ADMIN AUTH ERROR:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
