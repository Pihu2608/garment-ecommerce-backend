const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

/* ===============================
   CREATE ORDER (PUBLIC)
   POST /api/orders
================================ */
router.post("/", async (req, res) => {
  try {
    console.log("👉 ORDER BODY:", req.body);

    const { customerName, phone, email, address, items, total } = req.body;

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
    console.log(err);
    console.log(err.message);

    res.status(500).json({
      success: false,
      message: "Order creation failed"
    });
  }
});

/* ===============================
   📦 GET ALL ORDERS (ADMIN)
   GET /api/orders
================================ */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   🔍 GET SINGLE ORDER (ADMIN)
   GET /api/orders/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch {
    res.status(404).json({ message: "Order not found" });
  }
});

/* ===============================
   ✏️ UPDATE ORDER (ADMIN)
   PUT /api/orders/:id
   (status, paymentStatus, tracking, notes)
================================ */
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    // status history auto add
    if (req.body.trackingStatus) {
      updateData.$push = {
        statusHistory: { status: req.body.trackingStatus }
      };
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   🗑 DELETE ORDER (ADMIN)
   DELETE /api/orders/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
