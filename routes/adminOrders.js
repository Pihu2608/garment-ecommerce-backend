const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");

// UPDATE ORDER STATUS (Admin Only)
router.put("/order/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Allowed statuses (safety)
    const allowedStatus = [
      "Order Received",
      "Processing",
      "Shipped",
      "Delivered"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

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

    res.json({
      success: true,
      message: "Order status updated",
      order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
