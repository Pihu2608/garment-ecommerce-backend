const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/admin/auth", require("./routes/adminAuth"));
app.use("/api/admin", require("./routes/adminOrders"));
app.use("/api/orders", require("./routes/orderRoutes"));

// ADMIN PANEL
app.use("/admin", express.static(path.join(__dirname, "admin")));

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"));

// SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
