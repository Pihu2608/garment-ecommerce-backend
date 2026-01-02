const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC DETAILS
    // ===============================
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
      default: "Pending", // Pending | Processing | Delivered
    },

    // ===============================
    // INVOICE DETAILS
    // ===============================
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true, // existing orders safe
    },

    // 🔥 INVOICE FINAL FLAG
    isInvoiceFinal: {
      type: Boolean,
      default: false, // Delivered hone par true
    },

    // ===============================
    // GST DETAILS (SELLER)
    // ===============================
    gstin: {
      type: String,
      default: "23ABCDE1234F1Z5", // Demo GSTIN (MP)
    },

    state: {
      type: String,
      default: "MP", // Intra-state → CGST + SGST
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
          min: 1,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        // ✅ HSN CODE (GARMENTS)
        hsn: {
          type: String,
          default: "6109",
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
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
