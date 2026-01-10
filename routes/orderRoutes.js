const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

// 🔥 VERY IMPORTANT DEBUG (isse pata chalega backend kaunsa Order.js use kar raha)
console.log("🔥 ORDER MODEL REAL PATH =>", require.resolve("../models/Order"));

const generateInvoice = require("../utils/invoiceGenerator");
const { buildWhatsAppLink } = require("../utils/whatsapp");
const { sendOrderMail } = require("../services/email.service");

/* ===============================
   CREATE ORDER (PUBLIC)
   FINAL PRODUCTION SAFE
=============================== */
router.post("/", async (req, res) => {
  try {

    // 🔒 FORCE MAPPING (frontend mismatch safe)
    if (!req.body.companyName && req.body.name) {
      req.body.companyName = req.body.name;
    }

    if (req.body.mobile && !req.body.phone) {
      req.body.phone = req.body.mobile;
    }

    if (req.body.items) {
      req.body.items = req.body.items.map(i => ({
        name: i.name || i.title || "Item",
        qty: Number(i.qty) || 1,
        price: Number(i.price) || 0
      }));
    }

    if (!req.body.total && req.body.items) {
      req.body.total = req.body.items.reduce(
        (s, i) => s + i.price * i.qty, 0
      );
    }

    // ✅ CREATE ORDER (core)
    const order = await Order.create(req.body);

    const customerName = order.companyName || "Customer";
    const totalAmount = order.total;

    /* ========== EMAIL (BACKGROUND) ========== */

    sendOrderMail({
      to: process.env.ADMIN_EMAIL,
      subject: "🛒 New Order - ClassyCrafth",
      html: `
        <h2>New Order Received</h2>
        <p><b>ID:</b> ${order._id}</p>
        <p><b>Company:</b> ${customerName}</p>
        <p><b>Amount:</b> ₹${totalAmount}</p>
      `
    }).catch(() => {});

    if (order.email) {
      sendOrderMail({
        to: order.email,
        subject: "✅ Order Confirmed - ClassyCrafth",
        html: `
          <h2>Thank you for your order</h2>
          <p>Order ID: ${order._id}</p>
          <p>Total: ₹${totalAmount}</p>
        `
      }).catch(() => {});
    }

    /* ========== WHATSAPP LINK ========== */

    const message = `
✅ Order Confirmed – ClassyCrafth

🧾 Order ID: ${order._id}
🏢 Company: ${customerName}
💰 Amount: ₹${totalAmount}

🧾 Invoice:
${process.env.BACKEND_URL}/api/orders/${order._id}/invoice
`;

    const whatsappLink = buildWhatsAppLink(order.phone, message);

    return res.json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
      whatsappLink
    });

  } catch (err) {
    console.error("❌ FINAL ORDER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Order failed",
      error: err.message
    });
  }
});

/* ===============================
   DOWNLOAD INVOICE
=============================== */
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
