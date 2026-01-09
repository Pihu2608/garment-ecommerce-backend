const axios = require("axios");

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

async function sendWhatsAppTemplate(to, templateName, params) {
  return axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: `91${to}`,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: params.map((p) => ({
              type: "text",
              text: String(p),
            })),
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

module.exports = { sendWhatsAppTemplate };
