const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");

// 👉 ONLY this route should create order
router.post("/", createOrder);

module.exports = router;
