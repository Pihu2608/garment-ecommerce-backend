const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/productController");
const verifyAdmin = require("../middleware/verifyAdmin");

// PUBLIC
router.get("/", productCtrl.getProducts);
router.get("/:id", productCtrl.getSingleProduct);

// ADMIN
router.post("/", verifyAdmin, productCtrl.addProduct);
router.put("/:id", verifyAdmin, productCtrl.updateProduct);
router.delete("/:id", verifyAdmin, productCtrl.deleteProduct);

module.exports = router;

