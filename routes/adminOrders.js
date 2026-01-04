const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");

console.log("✅ adminOrders routes file LOADED");

// 🔐 GET ALL ORDERS
router.get("/orders", adminAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// 🔐 UPDATE STATUS
router.put("/orders/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Processing", "Delivered", "Cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.isInvoiceFinal && status !== "Delivered") {
    return res.status(400).json({ message: "Invoice already final" });
  }

  order.status = status;
  order.isInvoiceFinal = status === "Delivered";
  await order.save();

  res.json({ success: true, order });
});

module.exports = router;
