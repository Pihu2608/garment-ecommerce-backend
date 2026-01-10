const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    phone: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending"
    },

    items: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],

    // 🔥 VERY IMPORTANT FIX
    total: {
      type: Number,
      default: 0   // ❌ required हटाया
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
