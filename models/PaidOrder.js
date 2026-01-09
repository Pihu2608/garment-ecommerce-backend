const mongoose = require("mongoose");

const paidOrderSchema = new mongoose.Schema({
  orderId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  amount: Number,
  status: { type: String, default: "CREATED" }
}, { timestamps: true });

module.exports = mongoose.model("PaidOrder", paidOrderSchema);
