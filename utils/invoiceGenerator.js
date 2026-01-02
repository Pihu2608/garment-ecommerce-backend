const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    const invoicesDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(
      invoicesDir,
      `invoice-${order._id}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // HEADER
    doc
      .fontSize(20)
      .text("CorporateMart Invoice", { align: "center" })
      .moveDown();

    // COMPANY INFO
    doc
      .fontSize(12)
      .text(`Order ID: ${order._id}`)
      .text(`Company: ${order.companyName}`)
      .text(`Phone: ${order.phone}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .moveDown();

    // ITEMS
    doc.text("Items:", { underline: true });
    order.items.forEach(item => {
      doc.text(
        `${item.name}  x${item.qty}  ₹${item.price * item.qty}`
      );
    });

    doc.moveDown();

    // TOTAL
    doc
      .fontSize(14)
      .text(`Total Amount: ₹${order.total}`, {
        align: "right",
      });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};
