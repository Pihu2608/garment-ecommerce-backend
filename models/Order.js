const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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

        // ✅ YAHI HSN ADD KARNA HAI
        hsn: {
          type: String,
          default: "6109", // garments default HSN
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
