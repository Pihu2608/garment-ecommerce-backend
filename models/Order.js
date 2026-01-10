const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  hsn: { type: String, default: "6109" },
  gstRate: { type: Number, default: 12 }
});

const orderSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
    },

    items: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],

    // 🔥🔥 VERY IMPORTANT FIX
    // ❌ required हटाया
    // ✅ default दिया
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
=======
    companyName: { type: String, required: true },
    phone: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending"
    },

    invoiceNumber: { type: String, unique: true, sparse: true },
    isInvoiceFinal: { type: Boolean, default: false },

    gstin: { type: String, default: "23ABCDE1234F1Z5" },
    state: { type: String, default: "MP" },

    items: { type: [itemSchema], required: true },

    // ❌ total REQUIRED HATA DIYA
    total: { type: Number, default: 0 }
>>>>>>> 11bea2d (final order route fix)
  },
  { timestamps: true }
);

// ✅ AUTO TOTAL (DB level)
orderSchema.pre("validate", function (next) {
  if (!this.total || this.total === 0) {
    this.total = this.items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
