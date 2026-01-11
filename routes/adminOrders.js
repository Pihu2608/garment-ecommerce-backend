const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const Order = require("../models/Order");
const generateInvoice = require("../utils/invoiceGenerator");

// 🔐 Protect all admin order routes
router.use(verifyAdmin);

/* ===============================
   GET ALL ORDERS
   GET /api/admin/orders
================================ */
router.get("/orders", async (req, res) => {
  try {
    const { status, paymentStatus, q } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (q) {
      filter.$or = [
        { phone: { $regex: q, $options: "i" } },
        { customerName: { $regex: q, $options: "i" } },
        { _id: q.match(/^[0-9a-fA-F]{24}$/) ? q : null }
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ success: false, message: "Fetch orders failed" });
  }
});

/* ===============================
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id/status
================================ */
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ success: false, message: "Status update failed" });
  }
});

/* ===============================
   🚚 UPDATE DELIVERY TRACKING
   PUT /api/admin/orders/:id/tracking
================================ */
router.put("/orders/:id/tracking", async (req, res) => {
  try {
    const { courierName, trackingNumber, trackingStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    if (trackingStatus && trackingStatus !== order.trackingStatus) {
      order.trackingStatus = trackingStatus;
      order.statusHistory.push({ status: trackingStatus });
    }

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("Tracking update error:", err.message);
    res.status(500).json({ success: false, message: "Tracking update failed" });
  }
});

/* ===============================
   DOWNLOAD INVOICE (ADMIN)
   GET /api/admin/orders/:id/invoice
================================ */
router.get("/orders/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    // 📄 Generate invoice PDF
    const invoicePath = await generateInvoice(order);

    // ⬇️ Download file
    res.download(invoicePath, `invoice-${order._id}.pdf`);
  } catch (err) {
    console.error("Invoice download error:", err);
    res.status(500).send("Invoice download failed");
  }
});

module.exports = router;
