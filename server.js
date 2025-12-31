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
  res.send("✅ CorporateMart Backend Running");
});

// ================= ROUTES =================
// ⚠️ IMPORTANT: sab routes Express Router export kar rahe hone chahiye

const orderRoutes = require("./routes/orderRoutes");
const adminAuthRoutes = require("./routes/adminAuth");
const adminOrderRoutes = require("./routes/adminOrders");

app.use("/api/orders", orderRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminOrderRoutes);

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
