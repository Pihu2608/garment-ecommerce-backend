const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS (FINAL)
app.use(cors());
app.use(express.json());

// ROUTES
const orderRoutes = require("./routes/orderRoutes");

// ❌ यहाँ adminAuth मत लगाना
app.use("/api/orders", orderRoutes);

// DB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB Connected");
});

// SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
