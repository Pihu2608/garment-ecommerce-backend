const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

exports.sendWhatsApp = async ({ to, message }) => {
  return client.messages.create({
    from: "whatsapp:" + process.env.TWILIO_WHATSAPP_NUMBER,
    to: "whatsapp:" + to,
    body: message
  });
};
