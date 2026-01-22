const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

console.log("🔥🔥 CLASSYCRAFTH PRODUCTION SERVER STARTING 🔥🔥");

const app = express();

app.set("trust proxy", 1); // ✅ VERY IMPORTANT FOR RAILWAY / PRODUCTION

/* =========================
   🔐 SECURITY HARDENING
========================= */

// Hide x-powered-by
app.disable("x-powered-by");

// Helmet (security headers)
app.use(helmet());

// Rate limiter (anti brute-force / bot)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300, // max 300 requests per IP
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});
app.use(limiter);

// CORS lock
const allowedOrigins = [
  "https://classycrafth.com",
  "https://www.classycrafth.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server calls
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

/* =========================
   🧠 BODY PARSERS
========================= */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   📂 STATIC (ADMIN PANEL)
========================= */
app.use("/admin", express.static(path.join(__dirname, "admin")));

/* =========================
   🚏 ROUTES
========================= */
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin/auth", require("./routes/adminAuth"));
app.use("/api/admin", require("./routes/adminOrders"));
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/customer", require("./routes/customerProfile"));
app.use("/api/admin", require("./routes/adminDashboard"));

/* =========================
   ✅ TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("✅ ClassyCrafth backend is running securely...");
});

/* =========================
   ❌ GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

/* =========================
   🗄️ DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

/* =========================
   🚀 SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 ClassyCrafth server running securely on port", PORT);
});
