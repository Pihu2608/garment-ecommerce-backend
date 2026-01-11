const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req,res)=>{
  const { name, phone, email, password } = req.body;

  const exist = await User.findOne({ phone });
  if(exist) return res.status(400).json({ message:"User already exists" });

  const hash = await bcrypt.hash(password,10);
  const user = await User.create({ name, phone, email, password: hash });

  res.json({ success:true, message:"Registered successfully" });
});

/* LOGIN */
router.post("/login", async (req,res)=>{
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if(!user) return res.status(400).json({ message:"Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(400).json({ message:"Invalid credentials" });

  const token = jwt.sign(
    { id:user._id },
    process.env.JWT_SECRET,
    { expiresIn:"7d" }
  );

  res.json({
    success:true,
    token,
    user:{ id:user._id, name:user.name, phone:user.phone }
  });
});

module.exports = router;
