const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");

// ===============================
// CREATE ORDER (PUBLIC)
// ===============================
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// TRACK ORDER (CUSTOMER - PUBLIC)
// ===============================
// GET /api/orders/track?orderId=xxx&phone=9999999999
router.get("/track", async (req, res) => {
  const { orderId, phone } = req.query;

  if (!orderId || !phone) {
    return res.status(400).json({ message: "Missing orderId or phone" });
  }

  try {
    const order = await Order.findOne({
      _id: orderId,
      phone: phone
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      orderId: order._id,
      status: order.status,
      companyName: order.companyName,
      total: order.total,
      createdAt: order.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: "Invalid Order ID" });
  }
});

// ===============================
// GET ALL ORDERS (ADMIN - PROTECTED)
// ===============================
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// UPDATE ORDER STATUS (ADMIN - PROTECTED)
// ===============================
router.put("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
