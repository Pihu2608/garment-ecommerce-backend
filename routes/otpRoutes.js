const express = require("express");
const router = express.Router();
const Otp = require("../models/Otp");
const { sendWhatsAppTemplate } = require("../utils/whatsappCloud");

/* ===============================
   SEND OTP (WhatsApp Auto)
   POST /api/otp/send
=============================== */
router.post("/send", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old OTPs for this phone
    await Otp.deleteMany({ phone });

    // Save new OTP (valid 5 minutes)
    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 🔥 AUTO SEND OTP ON WHATSAPP
    await sendWhatsAppTemplate(
      phone,
      "otp_verification",
      [otp]
    );

    res.json({
      success: true,
      message: "OTP sent on WhatsApp",
    });
  } catch (err) {
    console.error("OTP SEND ERROR:", err);
    res.status(500).json({ message: "OTP send failed" });
  }
});

/* ===============================
   VERIFY OTP
   POST /api/otp/verify
=============================== */
router.post("/verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const record = await Otp.findOne({ phone, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Expired OTP
    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ phone });
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP verified → delete all OTPs for phone
    await Otp.deleteMany({ phone });

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.error("OTP VERIFY ERROR:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

module.exports = router;
