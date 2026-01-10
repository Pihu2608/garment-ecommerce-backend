const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  category: String,
  description: String,
  stock: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
