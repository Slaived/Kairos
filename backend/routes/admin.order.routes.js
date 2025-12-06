const express = require("express");
const Order = require("../models/order.models");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Ruta GET /api/admin/orders
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

// Ruta PUT /api/admin/orders/:id
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === "Entregado" ? true : order.isDelivered;
      order.deliveredAt =
        req.body.status === "Entregado" ? Date.now() : order.deliveredAt;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(400).json({ message: "Orden no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

// Ruta DELETE /api/admin/orders/:id
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Orden eliminada" });
        } else {
            res.status(404).json({ message: "Orden no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error de Servidor" });
    }
})

module.exports = router;
