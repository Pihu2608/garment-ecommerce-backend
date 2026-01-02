// utils/invoiceGenerator.js

const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      // ===== HEADER =====
      doc.fontSize(18).text("GARMENT STORE INVOICE", { align: "center" });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Order ID: ${order._id}`);
      doc.text(`Company: ${order.companyName || "-"}`);
      doc.text(`Phone: ${order.phone || "-"}`);
      doc.text(`Status: ${order.status}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);

      doc.moveDown();
      doc.text("Items:");
      doc.moveDown(0.5);

      if (order.items && order.items.length > 0) {
        order.items.forEach((item, i) => {
          doc.text(
            `${i + 1}. ${item.name} | Qty: ${item.qty} | ₹${item.price}`
          );
        });
      } else {
        doc.text("No items found");
      }

      doc.moveDown();
      doc.fontSize(14).text(`TOTAL: ₹${order.total}`, {
        align: "right",
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;
