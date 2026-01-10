const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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

    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    isInvoiceFinal: {
      type: Boolean,
      default: false,
    },

    gstin: {
      type: String,
      default: "23ABCDE1234F1Z5",
    },

    state: {
      type: String,
      default: "MP",
    },

    items: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        hsn: { type: String, default: "6109" },
        gstRate: { type: Number, default: 12 },
      },
    ],

    // ❌ NOT REQUIRED ANYMORE
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
