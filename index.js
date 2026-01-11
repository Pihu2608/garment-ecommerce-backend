const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

console.log("🔥🔥 MAIN INDEX FILE RUNNING 🔥🔥");

const app = express();

/* ========== MIDDLEWARE ========== */
app.use(cors());
app.use(express.json());

/* ========== STATIC (ADMIN PANEL) ========== */
app.use("/admin", express.static(path.join(__dirname, "admin")));

/* ========== ROUTES ========== */
console.log("🔥🔥 USING ROUTE FILES 🔥🔥");

// Orders
app.use("/api/orders", require("./routes/orderRoutes"));
console.log("✅ order routes LOADED");

// Admin auth
app.use("/api/admin/auth", require("./routes/adminAuth"));
console.log("✅ adminAuth routes LOADED");

// Admin orders / dashboard
app.use("/api/admin", require("./routes/adminOrders"));
console.log("✅ adminOrders routes LOADED");

// Payment
app.use("/api/payment", require("./routes/payment.routes"));
console.log("✅ payment routes LOADED");

// ✅ PRODUCTS (NEW – FINAL)
app.use("/api/products", require("./routes/productRoutes"));
console.log("✅ products routes LOADED");

/* ========== TEST ROUTE ========== */
app.get("/", (req, res) => {
  res.send("✅ ClassyCrafth backend is running...");
});

app.use("/api/customer", require("./routes/customerProfile"));
app.use("/api/admin", require("./routes/adminDashboard"));



/* ========== DATABASE ========== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Mongo error:", err.message));

/* ========== SERVER ========== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 ClassyCrafth server running on port", PORT);
});
