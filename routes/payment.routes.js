const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

/* ===========================
   🔐 Razorpay Init (SAFE)
=========================== */

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.log("❌ Razorpay keys missing in env");
} else {
  console.log("✅ Razorpay keys loaded");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ===========================
   CREATE ORDER
   POST /api/payment/create-order
=========================== */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount required" });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.log("❌ Razorpay error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
