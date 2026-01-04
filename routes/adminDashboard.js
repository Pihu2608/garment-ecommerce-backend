const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");

// 🔥 PROOF LOG
console.log("✅ adminDashboard routes file LOADED");

/*
=====================================
ADMIN DASHBOARD STATS
GET /api/admin/dashboard
=====================================
Protected Route (JWT required)
*/
router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const processingOrders = await Order.countDocuments({
      status: "Processing",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      status: "Cancelled",
    });

    // 💰 Total Revenue (Delivered only)
    const revenueAgg = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const totalRevenue =
      revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
      error: err.message,
    });
  }
});

module.exports = router;
