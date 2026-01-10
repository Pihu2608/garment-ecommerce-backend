const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

/* ===============================
   CREATE ORDER (PUBLIC) ✅ FINAL
================================ */
router.post("/", async (req, res) => {
  try {
    console.log("🔥 INCOMING BODY:", req.body);

    if (!req.body.items || !req.body.items.length) {
      return res.status(400).json({ message: "Items required" });
    }

    // ✅ items normalize
    const cleanItems = req.body.items.map(i => ({
      name: i.name || "Item",
      qty: Number(i.qty) || 1,
      price: Number(i.price) || 0
    }));

    // ✅ FORCE TOTAL (this fixes your error)
    const total = cleanItems.reduce(
      (s, i) => s + i.price * i.qty,
      0
    );

    // ✅ FORCE SAFE BODY
    const orderData = {
      companyName: req.body.companyName || req.body.name || "Customer",
      phone: req.body.phone || req.body.mobile || "0000000000",
      items: cleanItems,
      total: total
    };

    console.log("✅ FINAL ORDER DATA:", orderData);

    const order = await Order.create(orderData);

    return res.json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
