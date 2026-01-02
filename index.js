// backend/index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("✅ Garment Ecommerce Backend Running");
});

// ================= ROUTES =================
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
  });

// ================= SERVER =================
// ⚠️ IMPORTANT:
// - Railway gives its own PORT (process.env.PORT)
// - Local fallback = 3000 (NOT 5000)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
