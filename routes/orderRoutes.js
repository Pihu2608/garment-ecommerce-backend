const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

/* ===============================
   CREATE ORDER (100% SAFE)
=============================== */
router.post("/", async (req, res) => {
  try {

    // ✅ force fields
    if (!req.body.companyName && req.body.name) {
      req.body.companyName = req.body.name;
    }

    if (!req.body.phone && req.body.mobile) {
      req.body.phone = req.body.mobile;
    }

    if (!req.body.items || !req.body.items.length) {
      return res.status(400).json({ message: "Items required" });
    }

    // ✅ clean items
    req.body.items = req.body.items.map(i => ({
      name: i.name || "Item",
      qty: Number(i.qty) || 1,
      price: Number(i.price) || 0
    }));

    // ✅ FORCE TOTAL (THIS FIXES YOUR BUG)
    req.body.total = req.body.items.reduce(
      (s, i) => s + i.price * i.qty, 0
    );

    console.log("🔥 FINAL ORDER BODY =>", req.body);

    const order = await Order.create(req.body);

    res.json({
      success: true,
      message: "Order created",
      order
    });

  } catch (err) {
    console.error("❌ ORDER CREATE ERROR =>", err);
    res.status(500).json({
      message: "Order creation failed",
      error: err.message
    });
  }
});

module.exports = router;
