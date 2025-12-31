const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // 🏢 Company Details
  companyName: {
    type: String,
    required: true
  },
  gstNumber: {
    type: String
  },
  contactName: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },

  // 📦 Order Items
  items: [
    {
      id: String,
      name: String,
      price: Number,
      qty: Number
    }
  ],

  // 💰 Amounts
  subtotal: Number,
  cgst: Number,
  sgst: Number,
  total: {
    type: Number,
    required: true
  },

  // 🚚 Order Status (UPGRADE 9)
  status: {
    type: String,
    enum: [
      "Order Received",
      "Processing",
      "Shipped",
      "Delivered"
    ],
    default: "Order Received"
  },

  // 🕒 Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
