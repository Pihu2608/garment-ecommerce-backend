const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const generateInvoice = require("../utils/invoiceGenerator");
const { buildWhatsAppLink } = require("../utils/whatsapp");
const { sendOrderMail } = require("../services/email.service");

/* ===============================
   CREATE ORDER (PUBLIC)
   + EMAIL + WhatsApp
=============================== */
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);

    const totalAmount = order.items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );

    /* ========== EMAIL ========== */

    // 📩 ADMIN EMAIL
    await sendOrderMail({
      to: process.env.ADMIN_EMAIL,
      subject: "🛒 New Order Received - ClassyCrafth",
      html: `
        <h2>New Order Received</h2>
        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Name:</b> ${order.customerName}</p>
        <p><b>Amount:</b> ₹${totalAmount}</p>
      `
    });

    // 📩 CUSTOMER EMAIL
    if (order.email) {
      await sendOrderMail({
        to: order.email,
        subject: "✅ Your Order is Confirmed - ClassyCrafth",
        html: `
          <h2>Thank you for your order</h2>
          <p>Your Order ID: ${order._id}</p>
          <p>Total: ₹${totalAmount}</p>
        `
      });
    }

    /* ========== WHATSAPP LINK ========== */

    const message = `
✅ Order Confirmed – ClassyCrafth

🧾 Order ID: ${order._id}
👤 Name: ${order.customerName}
💰 Amount: ₹${totalAmount}

📦 Track Order:
${process.env.FRONTEND_URL}/track-order.html

🧾 Download Invoice:
${process.env.BACKEND_URL}/api/orders/${order._id}/invoice
`;

    const whatsappLink = buildWhatsAppLink(order.phone, message);

    res.json({
      success: true,
      order,
      whatsappLink,
    });

  } catch (err) {
    console.error("ORDER + EMAIL ERROR:", err.message);
    res.status(500).json({ message: "Order creation failed" });
  }
});

/* ===============================
   DOWNLOAD INVOICE (PUBLIC)
=============================== */
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
    console.error(err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
});

module.exports = router;
