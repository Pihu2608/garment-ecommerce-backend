const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

console.log("🔥🔥🔥 LIVE ORDER ROUTE FILE LOADED");

/* ===============================
   CREATE ORDER (PUBLIC)
=============================== */
router.post("/", async (req, res) => {
  try {
    console.log("🔥🔥🔥 LIVE ORDER ROUTE HIT");
    console.log("🔥 BODY:", req.body);

    if (!req.body.items || !req.body.items.length) {
      return res.status(400).json({ message: "Items required" });
    }

    // ✅ items clean
    const items = req.body.items.map(i => ({
      name: i.name || "Item",
      qty: Number(i.qty) || 1,
      price: Number(i.price) || 0
    }));

    // ✅ AUTO TOTAL
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    console.log("🔥 ITEMS CLEANED:", items);
    console.log("🔥 TOTAL CALCULATED:", total);

    // ✅ ORDER CREATE
    const order = await Order.create({
      companyName: req.body.companyName,
      phone: req.body.phone,
      items,
      total
    });

    return res.json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    console.log("❌ FINAL ORDER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Order failed",
      error: err.message
    });
  }
});

module.exports = router;
