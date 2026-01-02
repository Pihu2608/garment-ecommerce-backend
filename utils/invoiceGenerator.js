const PDFDocument = require("pdfkit");

module.exports = function generateInvoice(order, res) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // Headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${order._id}.pdf`
  );

  // Pipe
  doc.pipe(res);

  // ---------- CONTENT ----------
  doc.fontSize(20).text("CorporateMart", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(12).text("GST Invoice", { align: "center" });
  doc.moveDown(1);

  doc.fontSize(10);
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Company: ${order.companyName}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  doc.fontSize(11).text("Items", { underline: true });
  doc.moveDown(0.5);

  let subtotal = 0;

  (order.items || []).forEach((item, i) => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    doc.text(
      `${i + 1}. ${item.name} | Qty: ${item.qty} | ₹${lineTotal}`
    );
  });

  doc.moveDown();

  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;

  doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`);
  doc.text(`CGST (9%): ₹${cgst.toFixed(2)}`);
  doc.text(`SGST (9%): ₹${sgst.toFixed(2)}`);
  doc.moveDown();
  doc.fontSize(12).text(`Grand Total: ₹${total.toFixed(2)}`, {
    underline: true,
  });

  doc.moveDown(2);
  doc.fontSize(9).text("Thank you for shopping with CorporateMart");

  // ---------- VERY IMPORTANT ----------
  doc.end(); // 🔚 closes stream properly
};
