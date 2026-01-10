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
console.log("🔥🔥 USING ORDER ROUTE FILE 🔥🔥");
app.use("/api/orders", require("./routes/orderRoutes"));       // ✅ orderRoutes.js
app.use("/api/admin/auth", require("./routes/adminAuth"));     // ✅ adminAuth.js
app.use("/api/admin", require("./routes/adminOrders"));        // ✅ adminOrders.js
app.use("/api/payment", require("./routes/payment.routes"));   // ✅ payment.routes.js

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

app.post("/api/test", (req, res) => {
  console.log("🧪 TEST ROUTE BODY 👉", req.body);
  res.json({ success: true, received: req.body, time: new Date() });
});
