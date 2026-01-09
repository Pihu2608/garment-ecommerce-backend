const crypto = require("crypto");
const PaidOrder = require("../models/PaidOrder");
const { createOrder } = require("../services/razorpay.service");

/* =========================
   CREATE PAYMENT ORDER
   POST /api/payment/create-order
========================= */
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId)
      return res.status(400).json({ message: "orderId required" });

    // ⚠️ IMPORTANT: amount frontend se mat lo
    // yahan example ke liye fixed hai
    // aap DB se real order total nikaalna
    const amount = 699; // TODO: fetch from Order model

    const order = await createOrder(amount);

    await PaidOrder.create({
      orderId,
      razorpayOrderId: order.id,
      amount,
      status: "CREATED"
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (e) {
    console.log("Create payment error:", e.message);
    res.status(500).json({ message: "Payment init failed" });
  }
};


/* =========================
   VERIFY PAYMENT
   POST /api/payment/verify
========================= */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const paid = await PaidOrder.findOne({ razorpayOrderId: razorpay_order_id });

    if (!paid) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (paid.status === "PAID") {
      return res.json({ success: true, message: "Already verified" });
    }

    paid.razorpayPaymentId = razorpay_payment_id;
    paid.status = "PAID";
    await paid.save();

    res.json({ success: true, paid });

  } catch (e) {
    console.log("Verify error:", e.message);
    res.status(500).json({ message: "Verification failed" });
  }
};
