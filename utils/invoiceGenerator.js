const PDFDocument = require("pdfkit");

module.exports = async function generateInvoice(order, res) {
  // HTTP headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${order._id}.pdf`
  );

  const doc = new PDFDocument({ margin: 40 });

  // 🔴 VERY IMPORTANT (Railway safe)
  doc.pipe(res);

  // ===== HEADER =====
  doc
    .fontSize(20)
    .text("CorporateMart", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .text("GST Invoice", { align: "center" })
    .moveDown(1);

  // ===== ORDER INFO =====
  doc.fontSize(10);
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Company: ${order.companyName || "-"}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();

  // ===== ITEMS =====
  doc.fontSize(12).text("Items", { underline: true });
  doc.moveDown(0.5);

  let subtotal = 0;

  (order.items || []).forEach((item) => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;

    doc
      .fontSize(10)
      .text(`${item.name}  x${item.qty}  ₹${lineTotal}`);
  });

  doc.moveDown();

  // ===== GST BREAKUP =====
  const cgst = order.cgst || 0;
  const sgst = order.sgst || 0;
  const total = order.total || subtotal + cgst + sgst;

  doc.fontSize(11);
  doc.text(`Subtotal: ₹${subtotal}`);
  doc.text(`CGST: ₹${cgst}`);
  doc.text(`SGST: ₹${sgst}`);
  doc.moveDown();
  doc.fontSize(13).text(`Grand Total: ₹${total}`, {
    underline: true,
  });

  doc.moveDown(2);

  doc
    .fontSize(10)
    .text("Thank you for shopping with CorporateMart!", {
      align: "center",
    });

  // 🔴 VERY IMPORTANT
  doc.end();
};
