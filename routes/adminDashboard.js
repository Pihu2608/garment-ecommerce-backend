const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");

// ⚠️ Path apne project ke hisaab se check kar lena
const Order = require("../models/Order");


// 🔐 protects all admin dashboard routes
router.use(verifyAdmin);


/* ===============================
   ADMIN DASHBOARD STATS
   GET /api/admin/dashboard
================================ */
router.get("/dashboard", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: "PENDING" });
    const processing = await Order.countDocuments({ status: "PROCESSING" });
    const delivered = await Order.countDocuments({ status: "DELIVERED" });
    const cancelled = await Order.countDocuments({ status: "CANCELLED" });

    const revenueAgg = await Order.aggregate([
      { $match: { status: "DELIVERED" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
      success: true,
      totalOrders,
      pending,
      processing,
      delivered,
      cancelled,
      revenue
    });

  } catch (err) {
    console.log("Dashboard error:", err.message);
    res.status(500).json({ success: false, message: "Dashboard server error" });
  }
});

module.exports = router;
