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
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrders");

// 🔍 PROOF LOG – ye console me aana hi chahiye
console.log("✅ adminOrders routes REGISTERED");

// Customer / Public routes
app.use("/api/orders", orderRoutes);

// 🔥 Admin routes
app.use("/api/admin", adminOrderRoutes);

// 🔥 Admin panel static files
app.use("/admin", express.static(path.join(__dirname, "admin")));

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
