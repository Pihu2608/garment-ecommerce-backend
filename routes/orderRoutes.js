const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");
const generateInvoice = require("../utils/invoiceGenerator");

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
// TRACK ORDER (PUBLIC)
// ===============================
router.get("/track", async (req, res) => {
  try {
    const { orderId, phone } = req.query;

    if (!orderId || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID and phone required" });
    }

    const order = await Order.findOne({ _id: orderId, phone });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      order: {
        _id: order._id,
        companyName: order.companyName,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Invalid Order ID" });
  }
});

// ===============================
// GET ALL ORDERS (ADMIN)
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
// UPDATE ORDER STATUS (ADMIN)
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
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// DOWNLOAD INVOICE PDF (PUBLIC)
// RAILWAY SAFE
// ===============================
router.get("/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const pdfBuffer = await generateInvoice(order);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${order._id}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Invoice Error:", err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
});

module.exports = router;
