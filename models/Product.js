const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    category: String,
    description: String,

    // 📦 INVENTORY
    stock: {
      type: Number,
      required: true,
      default: 0
    },

    lowStockLimit: {
      type: Number,
      default: 5
    }
  },
  { timestamps: true }   // ✅ ADD THIS
);

module.exports = mongoose.model("Product", productSchema);
