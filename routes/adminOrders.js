const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// 🔥 PROOF LOG — server start hote hi ye print hona chahiye
console.log("✅ adminOrders routes file LOADED");

// ===============================
// GET ALL ORDERS (ADMIN)
// ===============================
// URL: GET /api/admin/orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
});

// ===============================
// UPDATE ORDER STATUS (ADMIN)
// ===============================
// URL: PUT /api/admin/orders/:id/status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Processing",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🚫 Invoice final hone ke baad status change allow nahi
    if (order.isInvoiceFinal && status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Final invoice order cannot be changed",
      });
    }

    order.status = status;

    // ✅ Delivered → invoice final
    if (status === "Delivered") {
      order.isInvoiceFinal = true;
    }

    // ❌ Cancelled → invoice final false
    if (status === "Cancelled") {
      order.isInvoiceFinal = false;
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Status update failed",
      error: err.message,
    });
  }
});

module.exports = router;
