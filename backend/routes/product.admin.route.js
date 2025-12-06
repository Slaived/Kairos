const express = require("express");
const Product = require("../models/product.models");
const { protect, admin } = require("../middleware/authMiddleware");

// Ruta GET /api/admin/products

const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

module.exports = router;
