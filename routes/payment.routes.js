const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");

// ✅ FINAL SERVICES (sirf ye use honge)
const { sendOrderEmails } = require("../services/email.service");
const { sendOrderWhatsApp } = require("../services/whatsapp.service");

// ✅ utils
const generateInvoice = require("../utils/invoiceGenerator");

const router = express.Router();

/* ===============================
   RAZORPAY INSTANCE
================================ */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ===============================
   CREATE RAZORPAY ORDER
================================ */
router.post("/create-order", async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // paise
      currency: "INR",
      receipt: "order_" + order._id,
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Razorpay order create failed" });
  }
});

/* ===============================
   VERIFY PAYMENT (FINAL CORE)
================================ */
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // 🔐 Signature verify
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // 📦 Order find
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Update order
    order.paymentStatus = "PAID";
    order.paymentId = razorpay_payment_id;
    order.razorpayOrderId = razorpay_order_id;
    order.status = "PROCESSING";
    await order.save();

    // 📄 Generate invoice
    const invoicePath = await generateInvoice(order);

    // 📧 Send emails
    await sendOrderEmails(order, invoicePath);

    // 📲 Send WhatsApp
    await sendOrderWhatsApp(order);

    res.json({
      success: true,
      message: "Payment verified, order confirmed, invoice sent",
    });

  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

module.exports = router;
