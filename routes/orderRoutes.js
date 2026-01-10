const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    console.log("📥 BODY:", req.body);

    if (!req.body.items || !req.body.items.length) {
      return res.status(400).json({ message: "Items required" });
    }

    const items = req.body.items.map(i => ({
      name: i.name,
      qty: Number(i.qty),
      price: Number(i.price)
    }));

    const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0);

    console.log("🧮 ITEMS:", items);
    console.log("💰 TOTAL:", total);

    const order = await Order.create({
      companyName: req.body.companyName,
      phone: req.body.phone,
      items,
      total
    });

    res.json({ success: true, order });

  } catch (err) {
    console.error("❌ ORDER ERROR FULL:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
