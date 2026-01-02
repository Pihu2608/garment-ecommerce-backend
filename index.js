const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS FIX (VERY IMPORTANT)
app.use(
  cors({
    origin: "*", // production ke liye OK (single admin app)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ROUTES
const orderRoutes = require("./routes/orderRoutes");
const adminAuthRoutes = require("./routes/adminAuth");
const adminOrderRoutes = require("./routes/adminOrders");

app.use("/api/orders", orderRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminOrderRoutes);

// DB + SERVER
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB Connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
