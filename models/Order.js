const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC DETAILS
    // ===============================
    companyName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },

    // ===============================
    // GST DETAILS (TOP LEVEL)
    // ===============================
    gstin: {
      type: String,
      default: "23ABCDE1234F1Z5", // demo GSTIN (MP)
    },

    state: {
      type: String,
      default: "MP", // intra-state → CGST + SGST
    },

    // ===============================
    // ITEMS
    // ===============================
    items: [
      {
        name: {
          type: String,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        // ✅ HSN CODE (GARMENTS)
        hsn: {
          type: String,
          default: "6109", // Garments HSN
        },

        // ✅ GST RATE PER ITEM
        gstRate: {
          type: Number,
          default: 12, // 5 / 12 / 18
        },
      },
    ],

    // ===============================
    // TOTAL (TAXABLE VALUE)
    // ===============================
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
