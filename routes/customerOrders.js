const express = require("express");
const Order = require("../models/Order");
const verifyCustomer = require("../middleware/verifyCustomer");

const router = express.Router();

/* MY ORDERS */
router.get("/my-orders", verifyCustomer, async (req,res)=>{
  const orders = await Order.find({ customerId: req.customerId })
                            .sort({ createdAt:-1 });
  res.json({ success:true, orders });
});

module.exports = router;
