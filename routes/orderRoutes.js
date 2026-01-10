const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");

// 👉 ORDER CREATE API
router.post("/", createOrder);

module.exports = router;
