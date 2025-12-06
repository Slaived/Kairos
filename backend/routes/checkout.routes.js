const express = require("express");
const Checkout = require("../models/checkout.models");
const Cart = require("../models/cart.models");
const Product = require("../models/product.models");
const Order = require("../models/order.models");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//Ruta POST /api/checkout
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No hay artículos para el pago." });
  }

  try {
    // Crear una nueva sesión de compra
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pendiente",
      isPaid: false,
    });
    console.log(`Compra creada para el usuario: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error al crear la sesión de pago:", error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

//Ruta PUT /api/checkout/:id/pay
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Pago no encontrado." });
    }

    if (paymentStatus === "pagado") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Estado de pago inválido." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor." });
  }
});

//Ruta POST /api/checkout/:id/finalize
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Pago no encontrado." });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      // Crear pedido final basado en los detalles del pago
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "pagado",
        paymentDetails: checkout.paymentDetails,
      });

      // Marcar el pago como finalizado
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // Eliminar el carrito asociado con el usuario
      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Pago ya finalizado" });
    } else {
      res.status(400).json({ message: "El carrito no está pagado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor." });
  }
});

module.exports = router;
