const express = require("express");
const verifyCustomer = require("../middleware/verifyCustomer");
const User = require("../models/User");

const router = express.Router();

/* GET MY PROFILE */
router.get("/me", verifyCustomer, async (req, res) => {
  const user = await User.findById(req.customerId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ success: true, user });
});

module.exports = router;
