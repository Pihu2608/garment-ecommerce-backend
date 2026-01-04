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

    // ===============================
    // ORDER STATUS (ADMIN CONTROLLED)
    // ===============================
    status: {
      type: String,
      enum: [
        "Pending",     // Order received
        "Processing",  // Admin confirmed
        "Delivered",   // Order delivered
        "Cancelled",   // Order cancelled
      ],
      default: "Pending",
    },

    // ===============================
    // INVOICE DETAILS
    // ===============================
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true, // old orders safe
    },

    // 🔥 Invoice final hone ka flag
    // (Delivered hone par true)
    isInvoiceFinal: {
      type: Boolean,
      default: false,
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

        // HSN CODE (Garments)
        hsn: {
          type: String,
          default: "6109",
        },

        // GST RATE PER ITEM
        gstRate: {
          type: Number,
          default: 12, // 5 | 12 | 18
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
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);
