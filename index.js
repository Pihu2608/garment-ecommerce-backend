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

app.use("/api/orders", orderRoutes);

// 🔥 ADMIN ROUTES (THIS WAS MISSING)
app.use("/api/admin", adminOrderRoutes);

// 🔥 ADMIN PANEL STATIC (FIXED PATH)
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
