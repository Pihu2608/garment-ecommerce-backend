const express = require("express");
const router = express.Router();

/* 🔥 VERY IMPORTANT DEBUG (Railway kis Order.js ko use kar raha hai) */
console.log("🔥 ORDER MODEL FILE =>", require.resolve("../models/Order"));

const Order = require("../models/Order");

/* ===============================
   CREATE ORDER (PUBLIC)
=============================== */
router.post("/", async (req, res) => {
  try {

    if (!req.body.items || !req.body.items.length) {
      return res.status(400).json({ message: "Items required" });
    }

    // ✅ SAFE ITEMS
    req.body.items = req.body.items.map(i => ({
      name: i.name || i.title || "Item",
      qty: Number(i.qty) || 1,
      price: Number(i.price) || 0
    }));

    // ✅ AUTO TOTAL (MAIN FIX)
    req.body.total = req.body.items.reduce(
      (sum, i) => sum + (i.price * i.qty), 0
    );

    const order = await Order.create(req.body);

    res.json({
      success: true,
      message: "Order created",
      order
    });

  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    res.status(500).json({
      message: "Order failed",
      error: err.message
    });
  }
});

module.exports = router;
