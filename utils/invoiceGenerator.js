const PDFDocument = require("pdfkit");
const path = require("path");
const { calculateGST } = require("./gstUtils");

// ===============================
// ASSETS (Railway Safe)
// ===============================
const logoPath = path.join(__dirname, "../assets/logo.png");
const stampPath = path.join(__dirname, "../assets/stamp.png");

// ===============================
// HELPERS (POLISH)
// ===============================
function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function amountInWords(amount) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function inWords(num) {
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + " " + a[num % 10];
    if (num < 1000)
      return a[Math.floor(num / 100)] + " Hundred " + inWords(num % 100);
    if (num < 100000)
      return inWords(Math.floor(num / 1000)) + " Thousand " + inWords(num % 1000);
    if (num < 10000000)
      return inWords(Math.floor(num / 100000)) + " Lakh " + inWords(num % 100000);
    return (
      inWords(Math.floor(num / 10000000)) +
      " Crore " +
      inWords(num % 10000000)
    );
  }

  return inWords(Math.floor(amount)) + " Rupees Only";
}

function checkPageBreak(doc) {
  if (doc.y > 720) {
    doc.addPage();
    doc.moveDown();
  }
}

// ===============================
// MAIN INVOICE
// ===============================
function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* ================= HEADER ================= */
      doc.image(logoPath, 40, 40, { width: 120 });

      doc.fontSize(20).text("CORPORATEMART", 200, 45);
      doc
        .fontSize(10)
        .text(`GSTIN: ${order.gstin}`, 200, 70)
        .text("Bhopal, Madhya Pradesh", 200, 85);

      doc.moveDown(4);

      /* ================= INVOICE INFO ================= */
      doc.fontSize(12).text(`Invoice No: ${order.invoiceNumber}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.moveDown();

      /* ================= CUSTOMER ================= */
      doc.text(`Customer Name: ${order.companyName}`);
      doc.text(`Phone: ${order.phone}`);
      doc.moveDown();

      /* ================= ITEMS HEADER ================= */
      doc.fontSize(11);
      doc.text("Item", 40, doc.y, { width: 150 });
      doc.text("Qty", 200, doc.y);
      doc.text("Rate", 240, doc.y);
      doc.text("HSN", 290, doc.y);
      doc.text("GST%", 340, doc.y);
      doc.text("Total", 400, doc.y);
      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      /* ================= ITEMS ================= */
      let subTotal = 0;
      let totalGST = 0;
      const hsnSummary = {};

      order.items.forEach((item) => {
        checkPageBreak(doc);

        const baseAmount = item.qty * item.price;
        const gstRate = item.gstRate || (item.price >= 1000 ? 12 : 5);
        const gst = calculateGST(baseAmount, gstRate);

        subTotal += baseAmount;
        totalGST += gst.gstAmount;

        if (!hsnSummary[item.hsn]) {
          hsnSummary[item.hsn] = { taxable: 0, cgst: 0, sgst: 0, gst: 0 };
        }

        hsnSummary[item.hsn].taxable += baseAmount;
        hsnSummary[item.hsn].cgst += gst.cgst;
        hsnSummary[item.hsn].sgst += gst.sgst;
        hsnSummary[item.hsn].gst += gst.gstAmount;

        doc.text(item.name, 40, doc.y, { width: 150 });
        doc.text(item.qty, 200, doc.y);
        doc.text(formatINR(item.price), 240, doc.y);
        doc.text(item.hsn, 290, doc.y);
        doc.text(`${gstRate}%`, 340, doc.y);
        doc.text(formatINR(gst.total), 400, doc.y);
        doc.moveDown();
      });

      /* ================= HSN SUMMARY ================= */
      doc.moveDown();
      doc.fontSize(13).text("HSN Summary", { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(10);
      doc.text("HSN", 40);
      doc.text("Taxable", 120);
      doc.text("CGST", 220);
      doc.text("SGST", 300);
      doc.text("Total GST", 380);
      doc.moveDown(0.3);
      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);

      Object.keys(hsnSummary).forEach((hsn) => {
        const r = hsnSummary[hsn];
        doc.text(hsn, 40);
        doc.text(formatINR(r.taxable), 120);
        doc.text(formatINR(r.cgst), 220);
        doc.text(formatINR(r.sgst), 300);
        doc.text(formatINR(r.gst), 380);
        doc.moveDown();
      });

      /* ================= TOTALS ================= */
      const grandTotal = subTotal + totalGST;

      doc.moveDown();
      doc.fontSize(12).text(`Subtotal: ${formatINR(subTotal)}`, { align: "right" });
      doc.text(`GST: ${formatINR(totalGST)}`, { align: "right" });
      doc.fontSize(14).text(`Grand Total: ${formatINR(grandTotal)}`, {
        align: "right",
      });

      doc.moveDown();
      doc.fontSize(10).text(`Amount in Words: ${amountInWords(grandTotal)}`);

      /* ================= FOOTER ================= */
      doc.moveDown(3);
      doc.image(stampPath, 380, doc.y, { width: 120 });
      doc.fontSize(10)
        .text("For CORPORATEMART", 380, doc.y + 90)
        .text("Authorized Signatory", 380, doc.y + 105);

      doc.moveDown(5);
      doc.fontSize(9).text(
        "This is a computer-generated GST invoice.",
        { align: "center" }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;
