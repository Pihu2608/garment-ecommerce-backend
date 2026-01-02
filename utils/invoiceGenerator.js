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

    // ===============================
    // HEADER
    // ===============================
    doc
      .fontSize(20)
      .text("TAX INVOICE", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text("CorporateMart", { align: "center" })
      .text("GSTIN: 23ABCDE1234F1Z5", { align: "center" }) // 🔴 replace GSTIN
      .moveDown();

    // ===============================
    // ORDER DETAILS
    // ===============================
    doc
      .fontSize(11)
      .text(`Invoice No: CM-${order._id}`)
      .text(`Order ID: ${order._id}`)
      .text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .moveDown();

    doc
      .text(`Billed To: ${order.companyName}`)
      .text(`Phone: ${order.phone}`)
      .moveDown();

    // ===============================
    // ITEMS TABLE
    // ===============================
    doc.fontSize(12).text("Items", { underline: true });
    doc.moveDown(0.5);

    order.items.forEach(item => {
      doc
        .fontSize(10)
        .text(
          `${item.name}  |  Qty: ${item.qty}  |  Rate: ₹${item.price}  |  Amount: ₹${item.price * item.qty}`
        );
    });

    doc.moveDown();

    // ===============================
    // GST CALCULATION
    // ===============================
    const subtotal = order.subtotal || order.total;
    const gstRate = 18;

    let cgst = order.cgst;
    let sgst = order.sgst;
    let igst = order.igst || 0;

    // Auto calculate if not present
    if (!cgst && !sgst && !igst) {
      const gstAmount = (subtotal * gstRate) / 100;
      cgst = gstAmount / 2;
      sgst = gstAmount / 2;
    }

    const grandTotal = subtotal + cgst + sgst + igst;

    // ===============================
    // TOTALS
    // ===============================
    doc.moveDown();
    doc.fontSize(11);

    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, { align: "right" });

    if (igst > 0) {
      doc.text(`IGST (18%): ₹${igst.toFixed(2)}`, { align: "right" });
    } else {
      doc.text(`CGST (9%): ₹${cgst.toFixed(2)}`, { align: "right" });
      doc.text(`SGST (9%): ₹${sgst.toFixed(2)}`, { align: "right" });
    }

    doc
      .fontSize(13)
      .text(`Grand Total: ₹${grandTotal.toFixed(2)}`, {
        align: "right",
        underline: true,
      });

    doc.moveDown(2);

    // ===============================
    // FOOTER
    // ===============================
    doc
      .fontSize(10)
      .text(
        "This is a computer-generated invoice and does not require a signature.",
        { align: "center" }
      );

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};
