const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    if (email !== process.env.ADMIN_EMAIL)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });

  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
