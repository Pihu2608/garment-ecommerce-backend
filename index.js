const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrders");

// Customer / Public Orders
app.use("/api/orders", orderRoutes);

// 🔥 Admin Orders (VERY IMPORTANT)
app.use("/api/admin", adminOrderRoutes);

// ================= ADMIN PANEL STATIC =================
// admin/orders.html serve karne ke liye
app.use("/admin", express.static("admin"));

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err.message));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
