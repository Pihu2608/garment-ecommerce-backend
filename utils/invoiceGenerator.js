const PDFDocument = require("pdfkit");

module.exports = async function generateInvoice(order, res) {
  const doc = new PDFDocument({ margin: 50 });

  // ✅ IMPORTANT HEADERS
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${order._id}.pdf`
  );

  // STREAM PDF TO RESPONSE
  doc.pipe(res);

  // ================= HEADER =================
  doc.fontSize(20).text("CorporateMart", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  // ================= CUSTOMER =================
  doc.text(`Company: ${order.companyName}`);
  doc.text(`Phone: ${order.phone || "-"}`);
  doc.text(`Address: ${order.address || "-"}`);
  doc.moveDown();

  // ================= ITEMS =================
  doc.text("Items:");
  doc.moveDown(0.5);

  order.items.forEach((item, i) => {
    doc.text(
      `${i + 1}. ${item.name}  x${item.qty}  = ₹${item.price * item.qty}`
    );
  });

  doc.moveDown();

  // ================= GST =================
  const subtotal = order.subtotal || order.total;
  const cgst = order.cgst || 0;
  const sgst = order.sgst || 0;

  doc.text(`Subtotal: ₹${subtotal}`);
  doc.text(`CGST: ₹${cgst}`);
  doc.text(`SGST: ₹${sgst}`);
  doc.text(`Total: ₹${order.total}`, { bold: true });

  // ================= FOOTER =================
  doc.moveDown(2);
  doc.text("Thank you for shopping with CorporateMart", {
    align: "center",
  });

  // ✅ VERY IMPORTANT (WITHOUT THIS → CRASH)
  doc.end();
};
