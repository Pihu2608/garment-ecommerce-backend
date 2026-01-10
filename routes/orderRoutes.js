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

    // ✅ Clean items
    const items = req.body.items.map(i => ({
      name: i.name || "Item",
      qty: Number(i.qty) || 1,
      price: Number(i.price) || 0
    }));

    // ✅ AUTO TOTAL (IMPORTANT)
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    // ✅ Create order
    const order = await Order.create({
      companyName: req.body.companyName,
      phone: req.body.phone,
      items,
      total   // 👈 yahi se error fix hota hai
    });

    res.json({ success: true, order });

  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
