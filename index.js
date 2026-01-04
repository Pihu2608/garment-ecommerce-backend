const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================

// 🔐 Admin Auth (Login)
app.use("/api/admin/auth", require("./routes/adminAuth"));

// 📦 Admin Orders (List + Status Update)
app.use("/api/admin", require("./routes/adminOrders"));

// 📊 Admin Dashboard (Stats)
app.use("/api/admin", require("./routes/adminDashboard"));

// 🛒 Public Orders (Create / Track)
app.use("/api/orders", require("./routes/orderRoutes"));

// ================= ADMIN PANEL (STATIC) =================
app.use("/admin", express.static(path.join(__dirname, "admin")));

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ================= SERVER =================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
