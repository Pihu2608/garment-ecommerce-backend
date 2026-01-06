const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    app: "ClassyCrafth Backend",
    environment: "Production",
    time: new Date().toISOString(),
  });
});

// ================= ROUTES =================

// 🔐 Admin Auth API
app.use("/api/admin/auth", require("./routes/adminAuth"));

// 📦 Admin Orders
app.use("/api/admin", require("./routes/adminOrders"));

// 📊 Admin Dashboard
app.use("/api/admin", require("./routes/adminDashboard"));

// 🛒 Public Orders
app.use("/api/orders", require("./routes/orderRoutes"));

// ================= ADMIN PANEL (STATIC) =================
app.use("/admin", express.static(path.join(__dirname, "admin")));

// ✅ fallback for admin refresh (NO wildcard)
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "login.html"));
});

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
