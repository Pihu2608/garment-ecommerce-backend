const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 👤 CUSTOMER ACCOUNT LINK (for login + order history)
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // 👤 Customer info (snapshot)
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    address: {
      type: String,
      required: true
    },

    // 🛍️ Items
    items: [
      {
        name: String,
        price: Number,
        qty: Number,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        }
      }
    ],

    // 💰 Amount
    total: {
      type: Number,
      required: true
    },

    // 💳 Payment
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING"
    },
    paymentId: String,
    razorpayOrderId: String,

    // 📦 Order lifecycle (admin)
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"],
      default: "PENDING"
    },

    // 🚚 DELIVERY TRACKING
    courierName: {
      type: String
    },

    trackingNumber: {
      type: String
    },

    trackingStatus: {
      type: String,
      enum: ["ORDER_PLACED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"],
      default: "ORDER_PLACED"
    },

    statusHistory: [
      {
        status: String,
        time: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // 🧾 Extra
    notes: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
