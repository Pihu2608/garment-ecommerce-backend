const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

async function sendOrderWhatsApp(order) {
  const msg = `
🛒 New Paid Order - ClassyCrafth
Order: ${order._id}
Name: ${order.customerName}
Phone: ${order.phone}
Total: ₹${order.total}
`;

  // Admin WhatsApp
  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${process.env.ADMIN_MOBILE}`,
    body: msg
  });
}

module.exports = { sendOrderWhatsApp };
