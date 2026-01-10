const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  companyName: String,
  phone: String,

  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],

  total: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    default: "PENDING"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
