const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber.models");

// Ruta POST /api/subscribe
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email es requerido" });
  }

  try {
    // Verificar si el email ya está suscrito
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "Email ya suscrito" });
    }

    // Crear un nuevo suscritor
    subscriber = new Subscriber({ email });
    await subscriber.save();

    res
      .status(201)
      .json({ message: "¡¡Suscrito exitosamente en el boletín de noticias!!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Error de Servidor"});    
  }
});

module.exports = router;
