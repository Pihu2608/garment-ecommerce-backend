const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const upload = require("../middleware/upload");

console.log("🔥 productRoutes FILE LOADED");


// ➕ ADD PRODUCT (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
console.log("BODY:", req.body);
console.log("FILE:", req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = req.file.path; // ✅ Cloudinary URL

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: imageUrl,
    });

    res.json({ success: true, product });
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
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
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
});


// ✏️ UPDATE PRODUCT (optional image update)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path; // new Cloudinary image
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

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
