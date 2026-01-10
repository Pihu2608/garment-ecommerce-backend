const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ADD PRODUCT
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
