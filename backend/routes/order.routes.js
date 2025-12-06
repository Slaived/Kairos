const express = require("express");
const Order = require("../models/order.models");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//Ruta GET /api/orders/my-orders

router.get("/my-orders", protect, async (req, res) => {
  try {
    // Encontrar ordenes por la auntentificación del usuario
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); // Ordenar por pedidos más recientes
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

// Ruta GET /api/orders/:id

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name emai"
    );

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Devolver los detalles completos del pedido
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

module.exports = router;
