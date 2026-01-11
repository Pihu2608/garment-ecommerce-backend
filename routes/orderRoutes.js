const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

/* ===============================
   CREATE ORDER (PUBLIC)
   POST /api/orders
================================ */
router.post("/", async (req, res) => {
  try {

    // 🔍 Body log (debug)
    console.log("👉 ORDER BODY:", req.body);

    const { customerName, phone, email, address, items, total } = req.body;

    // 🛑 Basic validation
    if (!customerName || !phone || !address || !items || !items.length || !total) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const order = await Order.create({
      customerId: req.customerId || null,

      customerName,
      phone,
      email,
      address,
      items,
      total,

      paymentStatus: "PENDING",
      status: "PENDING",
      trackingStatus: "ORDER_PLACED",
      statusHistory: [{ status: "ORDER_PLACED" }]
    });

    res.json({ success: true, order });

  } catch (err) {
    console.log("❌❌ FULL ORDER ERROR ❌❌");
    console.log(err);          // full error object
    console.log(err.message);  // short message

    res.status(500).json({
      success:false,
      message:"Order creation failed"
    });
  }
});

module.exports = router;
