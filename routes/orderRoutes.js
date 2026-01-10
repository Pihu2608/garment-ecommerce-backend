const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const generateInvoice = require("../utils/invoiceGenerator");
const { buildWhatsAppLink } = require("../utils/whatsapp");
const { sendOrderMail } = require("../services/email.service");

router.post("/", async (req, res) => {
  try {
    console.log("🔥 ORDER BODY =>", req.body);

    if (!req.body.companyName && req.body.name) {
      req.body.companyName = req.body.name;
    }

    if (req.body.mobile && !req.body.phone) {
      req.body.phone = req.body.mobile;
    }

    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ message: "Items required" });
    }

    req.body.items = req.body.items.map(i => ({
      name: i.name || "Item",
      qty: Number(i.qty) || 1,
      price: Number(i.price) || 0
    }));

    // 🔥 FORCE TOTAL (no chance to fail)
    req.body.total = req.body.items.reduce(
      (s, i) => s + i.price * i.qty, 0
    );

    console.log("🔥 FINAL TOTAL =>", req.body.total);

    const order = await Order.create(req.body);

    const message = `✅ Order Confirmed – ClassyCrafth
Order ID: ${order._id}
Company: ${order.companyName}
Amount: ₹${order.total}`;

    const whatsappLink = buildWhatsAppLink(order.phone, message);

    res.json({
      success: true,
      orderId: order._id,
      whatsappLink
    });

  } catch (err) {
    console.error("❌ ORDER ERROR =>", err);
    res.status(500).json({
      message: "Order creation failed",
      error: err.message
    });
  }
});

router.get("/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    const pdfBuffer = await generateInvoice(order);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${order._id}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).send("Invoice generation failed");
  }
});

module.exports = router;
