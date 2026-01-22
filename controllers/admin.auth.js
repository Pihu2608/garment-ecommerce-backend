const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

console.log("🔥🔥🔥 ADMIN AUTH FILE LOADED 🔥🔥🔥");


/* =========================
   🔐 ADMIN LOGIN (SUPER DEBUG)
========================= */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const envEmail = process.env.ADMIN_EMAIL;
    const hasHash = !!process.env.ADMIN_PASSWORD_HASH;
    const hasJwt = !!process.env.JWT_SECRET;

    let bcryptResult = null;
    if (hasHash) {
      bcryptResult = await bcrypt.compare(
        password || "",
        process.env.ADMIN_PASSWORD_HASH
      );
    }

    // 🔍 TEMP DEBUG RESPONSE (FIRST RETURN)
    return res.status(200).json({
      debug: true,
      fromBody: email,
      fromEnv: envEmail,
      hashPresent: hasHash,
      jwtPresent: hasJwt,
      bcryptMatch: bcryptResult
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
