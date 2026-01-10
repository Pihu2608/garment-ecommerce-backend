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

app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin/auth", require("./routes/adminAuth"));
app.use("/api/admin", require("./routes/adminOrders"));
app.use("/api/payment", require("./routes/payment.routes"));

// ✅ PRODUCTS ROUTE (FINAL ADD)
app.use("/api/products", require("./routes/productRoutes"));

/* ========== TEST ROUTE ========== */
app.get("/", (req, res) => {
  res.send("✅ ClassyCrafth backend is running...");
});

/* ========== DATABASE ========== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Mongo error:", err.message));

/* ========== SERVER ========== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 ClassyCrafth server running on port", PORT);
});
