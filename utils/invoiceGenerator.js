// utils/invoiceGenerator.js
const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* ================= HEADER ================= */
      doc
        .fontSize(20)
        .text("CORPORATEMART", { align: "left" })
        .fontSize(10)
        .text("Corporate Garment Solutions")
        .text("Bhopal, Madhya Pradesh")
        .text("Phone: 9516135516")
        .moveDown();

      doc
        .fontSize(16)
        .text("TAX INVOICE", { align: "center" })
        .moveDown();

      /* ================= ORDER INFO ================= */
      doc.fontSize(11);
      doc.text(`Invoice No: INV-${order._id}`);
      doc.text(`Order ID: ${order._id}`);
      doc.text(`Company Name: ${order.companyName}`);
      doc.text(`Phone: ${order.phone}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.moveDown();

      /* ================= TABLE HEADER ================= */
      doc.fontSize(11).text(
        "Item            HSN     Qty     Price     GST     Total",
        { underline: true }
      );
      doc.moveDown(0.5);

      let subTotal = 0;
      let totalGST = 0;

      order.items.forEach((item) => {
        const itemTotal = item.qty * item.price;
        const gstRate = 18; // Garments GST
        const gstAmount = (itemTotal * gstRate) / 100;

        subTotal += itemTotal;
        totalGST += gstAmount;

        doc.text(
          `${item.name}   ${item.hsn}     ${item.qty}     ₹${item.price}     18%     ₹${itemTotal}`
        );
      });

      doc.moveDown();

      /* ================= TOTALS ================= */
      doc.fontSize(12);
      doc.text(`Subtotal: ₹${subTotal}`, { align: "right" });
      doc.text(`CGST (9%): ₹${(totalGST / 2).toFixed(2)}`, {
        align: "right",
      });
      doc.text(`SGST (9%): ₹${(totalGST / 2).toFixed(2)}`, {
        align: "right",
      });
      doc.moveDown(0.5);

      doc
        .fontSize(14)
        .text(`GRAND TOTAL: ₹${(subTotal + totalGST).toFixed(2)}`, {
          align: "right",
        });

      doc.moveDown(2);
      doc.fontSize(10).text("This is a computer generated invoice.");

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;
