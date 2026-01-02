// utils/invoiceGenerator.js

const PDFDocument = require("pdfkit");
const path = require("path");

function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* =========================
         COMPANY HEADER
      ========================= */

      // LOGO (optional – file ho to hi dikhega)
      const logoPath = path.join(__dirname, "../assets/logo.png");
      try {
        doc.image(logoPath, 40, 40, { width: 80 });
      } catch (e) {
        // logo optional – ignore error
      }

      doc
        .fontSize(16)
        .text("ABC GARMENTS PRIVATE LIMITED", 140, 45)
        .fontSize(10)
        .text("123, Textile Market, New Delhi - 110001", 140)
        .text("GSTIN: 07ABCDE1234F1Z5", 140)
        .text("Phone: 9876543210", 140);

      doc.moveDown(3);

      /* =========================
         INVOICE TITLE
      ========================= */
      doc
        .fontSize(18)
        .text("TAX INVOICE", { align: "center", underline: true });

      doc.moveDown();

      /* =========================
         ORDER & CUSTOMER DETAILS
      ========================= */
      doc.fontSize(11);

      doc.text(`Invoice No: INV-${order._id}`);
      doc.text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.moveDown(0.5);

      doc.text(`Bill To: ${order.companyName}`);
      doc.text(`Mobile: ${order.phone}`);
      doc.moveDown();

      /* =========================
         TABLE HEADER
      ========================= */
      const tableTop = doc.y;

      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("S.No", 40, tableTop);
      doc.text("Item (Garment)", 70, tableTop);
      doc.text("HSN", 220, tableTop);
      doc.text("Qty", 270, tableTop);
      doc.text("Rate", 310, tableTop);
      doc.text("Amount", 380, tableTop);

      doc.moveDown(0.5);
      doc.font("Helvetica");

      /* =========================
         ITEMS
      ========================= */
      let totalAmount = 0;

      order.items.forEach((item, i) => {
        const y = doc.y;

        const amount = item.qty * item.price;
        totalAmount += amount;

        doc.text(i + 1, 40, y);
        doc.text(item.name, 70, y);
        doc.text(item.hsn || "6109", 220, y); // default garment HSN
        doc.text(item.qty, 270, y);
        doc.text(`₹${item.price}`, 310, y);
        doc.text(`₹${amount}`, 380, y);

        doc.moveDown();
      });

      doc.moveDown();

      /* =========================
         GST CALCULATION (18%)
      ========================= */
      const gstRate = 18;
      const gstAmount = (totalAmount * gstRate) / 100;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      const grandTotal = totalAmount + gstAmount;

      /* =========================
         TOTALS
      ========================= */
      doc.fontSize(11);

      doc.text(`Sub Total: ₹${totalAmount}`, { align: "right" });
      doc.text(`CGST (9%): ₹${cgst.toFixed(2)}`, { align: "right" });
      doc.text(`SGST (9%): ₹${sgst.toFixed(2)}`, { align: "right" });

      doc
        .fontSize(13)
        .text(`GRAND TOTAL: ₹${grandTotal.toFixed(2)}`, {
          align: "right",
          underline: true,
        });

      doc.moveDown(2);

      /* =========================
         FOOTER
      ========================= */
      doc.fontSize(10);
      doc.text("Declaration:", { underline: true });
      doc.text(
        "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct."
      );

      doc.moveDown(2);
      doc.text("For ABC GARMENTS PRIVATE LIMITED", { align: "right" });
      doc.moveDown(2);
      doc.text("Authorised Signatory", { align: "right" });

      /* ========================= */
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;
