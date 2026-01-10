const Order = require("../models/Order");
const { sendOrderMail } = require("../services/email.service");
const { sendWhatsApp } = require("../services/whatsapp.service");

exports.createOrder = async (req, res) => {
  try {
    const { companyName, phone, email, items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: "Items required" });
    }

    // ✅ Calculate total on backend
    const total = items.reduce(
      (sum, i) => sum + Number(i.price) * Number(i.qty),
      0
    );

    // ✅ Create & save order
    const order = await Order.create({
      companyName,
      phone,
      email,
      items,
      total
    });

    // ================= EMAIL =================

    // Admin email
    await sendOrderMail({
      to: process.env.ADMIN_EMAIL,
      subject: "🛒 New Order Received - ClassyCrafth",
      html: `
        <h2>New Order Received</h2>
        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Amount:</b> ₹${order.total}</p>
      `
    });

    // Customer email (optional)
    if (order.email) {
      await sendOrderMail({
        to: order.email,
        subject: "✅ Your Order is Confirmed - ClassyCrafth",
        html: `
          <h2>Thank you for your order</h2>
          <p><b>Order ID:</b> ${order._id}</p>
          <p><b>Amount:</b> ₹${order.total}</p>
          <p>We will contact you soon.</p>
        `
      });
    }

    // ================= WHATSAPP =================

    // Admin WhatsApp
    await sendWhatsApp({
      to: process.env.ADMIN_MOBILE,
      message: `🛒 New Order Received
Order ID: ${order._id}
Amount: ₹${order.total}`
    });

    // Customer WhatsApp
    if (order.phone) {
      await sendWhatsApp({
        to: order.phone,
        message: `✅ Your order is confirmed.
Order ID: ${order._id}
ClassyCrafth`
      });
    }

    res.json({ success: true, order });

  } catch (err) {
    console.error("❌ ORDER + EMAIL ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
