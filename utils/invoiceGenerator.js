const PDFDocument = require("pdfkit");
const path = require("path");

/* ===============================
   CONFIG
=============================== */
const SELLER_STATE = "MP"; // Madhya Pradesh

/* ===============================
   ASSETS (Railway Safe)
=============================== */
const logoPath = path.join(__dirname, "../assets/logo.png");
const stampPath = path.join(__dirname, "../assets/stamp.png");

/* ===============================
   HELPERS
=============================== */
function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function amountInWords(amount) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(num) {
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + " " + a[num % 10];
    if (num < 1000) return a[Math.floor(num / 100)] + " Hundred " + inWords(num % 100);
    if (num < 100000) return inWords(Math.floor(num / 1000)) + " Thousand " + inWords(num % 1000);
    if (num < 10000000)
      return inWords(Math.floor(num / 100000)) + " Lakh " + inWords(num % 100000);
    return inWords(Math.floor(num / 10000000)) + " Crore " + inWords(num % 10000000);
  }

  return inWords(Math.floor(amount)) + " Rupees Only";
}

function checkPageBreak(doc) {
  if (doc.y > 720) {
    doc.addPage();
    doc.moveDown();
  }
}

/* ===============================
   MAIN FUNCTION
=============================== */
function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const isIGST = order.placeOfSupply !== SELLER_STATE;

      /* ========= HEADER ========= */
      if (logoPath) doc.image(logoPath, 40, 40, { width: 110 });

      doc
        .fontSize(20)
        .text("CORPORATEMART", 180, 45)
        .fontSize(10)
        .text(`GSTIN: ${order.gstin || "NA"}`, 180, 72)
        .text("Bhopal, Madhya Pradesh", 180, 87)
        .text(
          isIGST
            ? "Inter-State Supply (IGST Applicable)"
            : "Intra-State Supply (CGST + SGST Applicable)",
          180,
          102
        );

      doc.moveDown(4);

      /* ========= INVOICE INFO ========= */
      doc
        .fontSize(11)
        .text(`Invoice No: ${order.invoiceNumber || order._id}`, 40)
        .text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString()}`)
        .moveDown();

      /* ========= CUSTOMER ========= */
      doc
        .text(`Customer Name: ${order.customerName || order.companyName}`)
        .text(`Phone: ${order.phone}`)
        .text(`Address: ${order.address || "NA"}`)
        .text(`Place of Supply: ${order.placeOfSupply || "NA"}`)
        .moveDown();

      /* ========= TABLE HEADER ========= */
      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("Item", 40);
      doc.text("Qty", 200);
      doc.text("Rate", 240);
      doc.text("HSN", 300);
      doc.text("GST%", 350);
      doc.text("Total", 420);
      doc.moveDown(0.3);
      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);
      doc.font("Helvetica");

      /* ========= ITEMS ========= */
      let subTotal = 0;
      let totalCGST = 0;
      let totalSGST = 0;
      let totalIGST = 0;

      const hsnSummary = {};

      order.items.forEach((item) => {
        checkPageBreak(doc);

        const baseAmount = item.qty * item.price;
        const gstRate = item.gstRate || 18;
        subTotal += baseAmount;

        if (!hsnSummary[item.hsn]) {
          hsnSummary[item.hsn] = {
            taxable: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
          };
        }

        if (isIGST) {
          const igst = (baseAmount * gstRate) / 100;
          totalIGST += igst;

          hsnSummary[item.hsn].taxable += baseAmount;
          hsnSummary[item.hsn].igst += igst;

          doc.text(item.name, 40, doc.y, { width: 150 });
          doc.text(item.qty, 200);
          doc.text(formatINR(item.price), 240);
          doc.text(item.hsn || "-", 300);
          doc.text(`${gstRate}%`, 350);
          doc.text(formatINR(baseAmount + igst), 420);
        } else {
          const cgst = (baseAmount * gstRate) / 200;
          const sgst = cgst;

          totalCGST += cgst;
          totalSGST += sgst;

          hsnSummary[item.hsn].taxable += baseAmount;
          hsnSummary[item.hsn].cgst += cgst;
          hsnSummary[item.hsn].sgst += sgst;

          doc.text(item.name, 40, doc.y, { width: 150 });
          doc.text(item.qty, 200);
          doc.text(formatINR(item.price), 240);
          doc.text(item.hsn || "-", 300);
          doc.text(`${gstRate / 2}%+${gstRate / 2}%`, 350);
          doc.text(formatINR(baseAmount + cgst + sgst), 420);
        }

        doc.moveDown();
      });

      /* ========= HSN SUMMARY ========= */
      doc.addPage();
      doc.fontSize(14).text("HSN Wise GST Summary", { underline: true });
      doc.moveDown(1);

      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("HSN", 40);
      doc.text("Taxable", 120);
      doc.text("CGST", 220);
      doc.text("SGST", 300);
      doc.text("IGST", 380);
      doc.text("Total GST", 460);
      doc.moveDown(0.3);
      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);
      doc.font("Helvetica");

      Object.keys(hsnSummary).forEach((hsn) => {
        const r = hsnSummary[hsn];
        const totalGST = r.cgst + r.sgst + r.igst;

        doc.text(hsn, 40);
        doc.text(formatINR(r.taxable), 120);
        doc.text(formatINR(r.cgst), 220);
        doc.text(formatINR(r.sgst), 300);
        doc.text(formatINR(r.igst), 380);
        doc.text(formatINR(totalGST), 460);
        doc.moveDown();
      });

      /* ========= TOTALS ========= */
      const totalGST = totalCGST + totalSGST + totalIGST;
      const grandTotal = subTotal + totalGST;

      doc.moveDown();
      doc.fontSize(11).text(`Taxable Amount: ${formatINR(subTotal)}`, { align: "right" });

      if (isIGST) {
        doc.text(`IGST: ${formatINR(totalIGST)}`, { align: "right" });
      } else {
        doc.text(`CGST: ${formatINR(totalCGST)}`, { align: "right" });
        doc.text(`SGST: ${formatINR(totalSGST)}`, { align: "right" });
      }

      doc.fontSize(14).text(`Grand Total: ${formatINR(grandTotal)}`, { align: "right" });
      doc.moveDown();
      doc.fontSize(10).text(`Amount in Words: ${amountInWords(grandTotal)}`);

      /* ========= FOOTER ========= */
      doc.moveDown(3);
      if (stampPath) doc.image(stampPath, 380, doc.y, { width: 120 });

      doc
        .fontSize(10)
        .text("For CORPORATEMART", 380, doc.y + 90)
        .text("Authorized Signatory", 380, doc.y + 105);

      doc.moveDown(5);
      doc.fontSize(9).text(
        "This is a computer-generated GST invoice. No signature required.",
        { align: "center" }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;
