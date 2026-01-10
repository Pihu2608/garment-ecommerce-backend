const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

/* ===============================
   CREATE ORDER (PUBLIC)
=============================== */
router.post("/", async (req, res) => {
  try {
    if (!req.body.items || !req.body.items.length) {
      return res.status(400).json({ message: "Items required" });
    }

    // ✅ items clean
    const items = req.body.items.map(i => ({
      name: i.name || "Item",
      qty: Number(i.qty) || 1,
      price: Number(i.price) || 0
    }));

    // ✅ AUTO TOTAL (MAIN FIX)
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

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
    console.log("❌ ORDER ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Order failed",
      error: err.message
    });
  }
});

module.exports = router;
