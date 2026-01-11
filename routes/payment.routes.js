const express = require("express");
const router = express.Router();

// ⚠️ VERY IMPORTANT – filename aur path EXACT same hona chahiye
const Product = require("../models/Product");  

console.log("🔥 productRoutes FILE LOADED");

/* =========================
   ADD PRODUCT
========================= */
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   GET ALL PRODUCTS
========================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET SINGLE PRODUCT
========================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID" });
  }
});

module.exports = router;
