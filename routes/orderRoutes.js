const express = require("express");
const router = express.Router();

console.log("🔥 ORDER MODEL PATH =>", require.resolve("../models/Order"));

const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {

    if (!req.body.items || !req.body.items.length) {
      return res.status(400).json({ message: "Items required" });
    }

    req.body.items = req.body.items.map(i => ({
      name: i.name || "Item",
      qty: Number(i.qty) || 1,
      price: Number(i.price) || 0
    }));

    // ✅ AUTO TOTAL
    req.body.total = req.body.items.reduce(
      (s, i) => s + i.price * i.qty, 0
    );

    const order = await Order.create(req.body);

    res.json({
      success: true,
      message: "Order created successfully",
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
