function buildWhatsAppLink(phone, message) {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
}

module.exports = { buildWhatsAppLink };
