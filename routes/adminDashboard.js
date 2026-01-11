const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const Order = require("../models/Order");
const Product = require("../models/Product");   // ✅ LOW STOCK ke liye

// 🔐 Protect all admin dashboard routes
router.use(verifyAdmin);

/* ===============================
   ADMIN DASHBOARD STATS
   GET /api/admin/dashboard
================================ */
router.get("/dashboard", async (req, res) => {
  try {
    // 📦 Order counts
    const totalOrders = await Order.countDocuments();

    const paidOrders = await Order.countDocuments({ paymentStatus: "PAID" });
    const pendingPayment = await Order.countDocuments({ paymentStatus: { $ne: "PAID" } });

    const pending = await Order.countDocuments({ status: "PENDING" });
    const processing = await Order.countDocuments({ status: "PROCESSING" });
    const delivered = await Order.countDocuments({ status: "DELIVERED" });
    const cancelled = await Order.countDocuments({ status: "CANCELLED" });

    // 💰 Total revenue (only PAID orders)
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // 📅 Today revenue
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const todayAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
          createdAt: { $gte: start }
        }
      },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const todayRevenue = todayAgg[0]?.total || 0;

    // ⚠️ LOW STOCK COUNT
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ["$stock", "$lowStockLimit"] }
    });

    // 🆕 Latest 5 orders
    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName phone total status paymentStatus createdAt");

    res.json({
      success: true,
      stats: {
        totalOrders,
        paidOrders,
        pendingPayment,
        statusBreakdown: {
          pending,
          processing,
          delivered,
          cancelled
        },
        totalRevenue,
        todayRevenue,
        lowStockCount    // ✅ FINAL ADDITION
      },
      latestOrders
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({
      success: false,
      message: "Dashboard server error"
    });
  }
});

/* ===============================
   📦 PRODUCT WISE SALES
   GET /api/admin/product-sales
================================ */
router.get("/product-sales", async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.name" },
          totalQty: { $sum: "$items.qty" },
          totalRevenue: {
            $sum: { $multiply: ["$items.qty", "$items.price"] }
          }
        }
      },
      { $sort: { totalQty: -1 } }
    ]);

    res.json({ success: true, sales });

  } catch (err) {
    console.error("Product sales error:", err.message);
    res.status(500).json({ success: false, message: "Product sales failed" });
  }
});

/* ===============================
   📅 DATE WISE SALES
   GET /api/admin/date-sales
================================ */
router.get("/date-sales", async (req, res) => {
  try {
    let { from, to } = req.query;
    let filter = { paymentStatus: "PAID" };

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      totalOrders: stats[0]?.totalOrders || 0,
      totalRevenue: stats[0]?.totalRevenue || 0,
      orders
    });

  } catch (err) {
    console.log("Date sales error:", err.message);
    res.status(500).json({ success: false, message: "Date sales failed" });
  }
});

/* ===============================
   ⚠️ LOW STOCK LIST
   GET /api/admin/low-stock
================================ */
router.get("/low-stock", async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$stock", "$lowStockLimit"] }
    }).sort({ stock: 1 });

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (err) {
    console.error("Low stock error:", err.message);
    res.status(500).json({ success: false, message: "Low stock fetch failed" });
  }
});

module.exports = router;
