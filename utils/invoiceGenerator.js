// utils/invoiceGenerator.js

const PDFDocument = require("pdfkit");
const calculateGST = require("./gstUtils");

function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      // ===============================
      // HEADER
      // ===============================
      doc.fontSize(18).text("TAX INVOICE", { align: "center" });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Order ID: ${order._id}`);
      doc.text(`Company: ${order.companyName || "-"}`);
      doc.text(`Phone: ${order.phone || "-"}`);
      doc.text(`GSTIN: ${order.gstin || "-"}`);
      doc.text(`Status: ${order.status}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);

      doc.moveDown();

      // ===============================
      // ITEMS TABLE (SIMPLE)
      // ===============================
      doc.text("Items:");
      doc.moveDown(0.5);

      if (order.items && order.items.length > 0) {
        order.items.forEach((item, i) => {
          doc.text(
            `${i + 1}. ${item.name} | HSN: ${item.hsn} | Qty: ${item.qty} | ₹${item.price}`
          );
        });
      } else {
        doc.text("No items found");
      }

      // ===============================
      // GST CALCULATION
      // ===============================
      const gstRate =
        order.items && order.items.length > 0
          ? order.items[0].gstRate
          : 12;

      const gst = calculateGST(order.total, gstRate);

      doc.moveDown();
      doc.text("GST Details:");
      doc.text(`Taxable Value: ₹${gst.taxable}`);
      doc.text(`GST Rate: ${gst.gstRate}%`);
      doc.text(`CGST (${gst.gstRate / 2}%): ₹${gst.cgst}`);
      doc.text(`SGST (${gst.gstRate / 2}%): ₹${gst.sgst}`);

      doc.moveDown();

      // ===============================
      // GRAND TOTAL
      // ===============================
      doc.fontSize(14).text(
        `GRAND TOTAL: ₹${gst.totalWithGST}`,
        { align: "right" }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;
