const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

console.log("🔥 ADMIN AUTH CONTROLLER LOADED");

/* =========================
   🔐 ADMIN LOGIN (FINAL)
========================= */
exports.adminLogin = async (req, res) => {
  return res.status(200).json({
    force: true,
    msg: "🔥 THIS FILE IS EXECUTING 🔥"
  });
};



    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH || !process.env.JWT_SECRET) {
      console.error("❌ Admin ENV missing");
      return res.status(500).json({
        success: false,
        message: "Server misconfiguration"
      });
    }

    // ✅ Email check
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ✅ Password check
    const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token
    });

  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
