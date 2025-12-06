const express = require("express");
const User = require("../models/user.models");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Ruta GET /api/admin/users
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

// Ruta POST /api/admin/users
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({ message: "El usuario ya existe" });
    }

    user = new User({
      name,
      email,
      password,
      role: role || "cliente",
    });

    await user.save();
    res.status(201).json({ message: "¡¡Usuario creado exitosamente!!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

// Ruta PUT /api/admin/users/:id
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }
    const updateUser = await user.save();
    res.json({
      message: "¡¡Usuario actualizado exitosamente!!",
      user: updateUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

// Ruta DELETE /api/admin/users/:id

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "Usuario eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

module.exports = router;
