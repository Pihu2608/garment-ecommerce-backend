const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true
  },

  phone: {
    type: String,
    trim: true
  },

  items: [
    {
      name: { type: String, required: true, trim: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],

  // ✅ Auto calculated total (must exist)
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

/* =================================
   ✅ SAFETY NET: AUTO TOTAL
   (kahin bhi bhool ho to bhi error nahi aayega)
================================= */
orderSchema.pre("validate", function (next) {
  if ((this.total === undefined || this.total === null) && this.items?.length) {
    this.total = this.items.reduce(
      (sum, i) => sum + Number(i.price) * Number(i.qty),
      0
    );
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
