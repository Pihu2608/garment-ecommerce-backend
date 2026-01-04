const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const generateInvoice = require("../utils/invoiceGenerator");

/* ===============================
   GET ALL ORDERS (PUBLIC / ADMIN VIEW)
   =============================== */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ===============================
   DOWNLOAD INVOICE (PUBLIC)
   =============================== */
router.get("/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const pdfBuffer = await generateInvoice(order);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${order._id}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: "Invoice generation failed" });
  }
});

module.exports = router;
