const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Products route working ✅");
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD PRODUCT
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
