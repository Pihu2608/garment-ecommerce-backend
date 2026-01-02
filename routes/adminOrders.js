const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");
const generateInvoice = require("../utils/invoiceGenerator");
const { Parser } = require("json2csv");

// ===================================================
// 1️⃣ RESEND / DOWNLOAD INVOICE (ADMIN ONLY)
// GET /api/admin/orders/:id/invoice
// ===================================================
router.get("/orders/:id/invoice", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const pdfBuffer = await generateInvoice(order);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${order.invoiceNumber}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Admin Invoice Error:", err);
    res.status(500).json({ message: "Invoice failed" });
  }
});

// ===================================================
// 2️⃣ MONTHLY GST REPORT (ADMIN ONLY)
// GET /api/admin/gst-report?month=8&year=2026
// ===================================================
router.get("/gst-report", adminAuth, async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: "Month and year required" });
    }

    // Month date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Only FINAL invoices
    const orders = await Order.find({
      isInvoiceFinal: true,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const rows = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const taxable = item.qty * item.price;
        const gstRate = item.gstRate || 12;
        const gstAmount = (taxable * gstRate) / 100;

        const isInterState =
          order.state &&
          order.customerState &&
          order.state !== order.customerState;

        rows.push({
          invoiceNumber: order.invoiceNumber,
          date: order.createdAt.toLocaleDateString(),
          hsn: item.hsn,
          taxable: taxable.toFixed(2),
          cgst: isInterState ? "0.00" : (gstAmount / 2).toFixed(2),
          sgst: isInterState ? "0.00" : (gstAmount / 2).toFixed(2),
          igst: isInterState ? gstAmount.toFixed(2) : "0.00",
          totalGST: gstAmount.toFixed(2),
        });
      });
    });

    const parser = new Parser({
      fields: [
        "invoiceNumber",
        "date",
        "hsn",
        "taxable",
        "cgst",
        "sgst",
        "igst",
        "totalGST",
      ],
    });

    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment(`GST-Report-${month}-${year}.csv`);
    res.send(csv);
  } catch (err) {
    console.error("GST Report Error:", err);
    res.status(500).json({ message: "GST report failed" });
  }
});

module.exports = router;
