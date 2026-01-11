const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

/* ===============================
   CREATE RAZORPAY ORDER
   POST /api/payment/create-order
================================ */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys missing in environment"
      });
    }

    // ✅ Razorpay instance INSIDE route (CRASH FIX)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "classycrafth_" + Date.now()
    });

    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.log("❌ Razorpay error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
