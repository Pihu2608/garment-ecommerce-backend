const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ✅ CORS */
app.use(cors());
app.use(express.json());

/* ROUTES */
const orderRoutes = require("./routes/orderRoutes");
const adminAuthRoutes = require("./routes/adminAuth");
const adminOrderRoutes = require("./routes/adminOrders");

/* ✅ PUBLIC */
app.use("/api/orders", orderRoutes);

/* 🔐 ADMIN ONLY */
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminOrderRoutes);

/* DB */
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB Connected");
});

/* SERVER */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
