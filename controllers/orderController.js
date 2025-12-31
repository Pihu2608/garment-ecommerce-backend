const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET ALL ORDERS (ADMIN)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
