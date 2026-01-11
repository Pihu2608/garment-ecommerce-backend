const express = require("express");
const router = express.Router();
const Product = require("../models/product");

console.log("🔥 productRoutes FILE LOADED");


// ➕ ADD PRODUCT
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📦 GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔍 GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
});

// ✏️ UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🗑️ DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
