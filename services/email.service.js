const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===============================
   SEND ORDER CONFIRMATION EMAILS
================================ */

async function sendOrderEmails(order, invoicePath) {
  // 📧 CUSTOMER EMAIL
  await transporter.sendMail({
    from: `"ClassyCrafth" <${process.env.EMAIL_USER}>`,
    to: order.email || process.env.ADMIN_EMAIL,
    subject: "✅ Order Confirmed - ClassyCrafth",
    html: `
      <h2>Thank you for your order!</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Name:</b> ${order.customerName}</p>
      <p><b>Total:</b> ₹${order.total}</p>
      <p><b>Status:</b> Paid & Processing</p>
      <br/>
      <p>We will contact you soon.</p>
      <p><b>Team ClassyCrafth</b></p>
    `,
    attachments: invoicePath
      ? [
          {
            filename: `invoice-${order._id}.pdf`,
            path: invoicePath,
          },
        ]
      : [],
  });

  // 📧 ADMIN EMAIL
  await transporter.sendMail({
    from: `"ClassyCrafth System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🛒 New Paid Order Received",
    html: `
      <h2>New Order Received</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Name:</b> ${order.customerName}</p>
      <p><b>Phone:</b> ${order.phone}</p>
      <p><b>Total:</b> ₹${order.total}</p>
    `,
  });
}

module.exports = { sendOrderEmails };
