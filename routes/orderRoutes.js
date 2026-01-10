const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    if (!req.body.items || !req.body.items.length) {
      return res.status(400).json({ message: "Items required" });
    }

    // items clean
    req.body.items = req.body.items.map(i => ({
      name: i.name || "Item",
      qty: Number(i.qty) || 1,
      price: Number(i.price) || 0
    }));

    // ✅ AUTO TOTAL (MAIN FIX)
    req.body.total = req.body.items.reduce(
      (s, i) => s + i.price * i.qty,
      0
    );

    const order = await Order.create(req.body);

    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.log("ORDER ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
