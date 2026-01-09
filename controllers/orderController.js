const Order = require("../models/Order");
const { sendOrderMail } = require("../services/email.service");
const { sendWhatsApp } = require("../services/whatsapp.service");

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // ================= EMAIL =================

    // Admin email
    await sendOrderMail({
      to: process.env.ADMIN_EMAIL,
      subject: "🛒 New Order Received - ClassyCrafth",
      html: `
        <h2>New Order Received</h2>
        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Amount:</b> ₹${order.totalAmount}</p>
      `
    });

    // Customer email (agar email field hai)
    if (order.email) {
      await sendOrderMail({
        to: order.email,
        subject: "✅ Your Order is Confirmed - ClassyCrafth",
        html: `
          <h2>Thank you for your order</h2>
          <p>Your Order ID: ${order._id}</p>
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
Amount: ₹${order.totalAmount}`
    });

    // Customer WhatsApp (agar phone field hai)
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
    console.log("Order error:", err.message);
    res.status(500).json({ success: false, message: "Order failed" });
  }
};
