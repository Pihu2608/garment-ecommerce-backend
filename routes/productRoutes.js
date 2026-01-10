const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("✅ PRODUCTS ROUTE WORKING");
});

router.get("/test", (req, res) => {
  res.send("✅ PRODUCTS TEST OK");
});

module.exports = router;
