const express = require("express");
const Cart = require("../models/cart.models");
const Product = require("../models/product.models");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Función auxiliar para obtener un carrito por ID de usuario o ID de invitado
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guest: guestId });
  }
  return null;
};

// Ruta POST /api/cart
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });

    // Determinar si el usuario está conectado (ha iniciado sesión) o es un invitado
    let cart = await getCart(userId, guestId);

    // Si el carrito existe, se actualiza
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // Si el producto ya existe, actualiza la cantidad
        cart.products[productIndex].quantity += quantity;
      } else {
        // Añadir nuevo product
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      // Recalcular el precio total
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Crear un nuevo carrito para el invitado o usuario
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

// Ruta PUT /api/cart

router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart)
      return res.status(404).json({ message: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      //Actualizar cantidad
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // Remueve el producto si la cantidad es 0
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de Servidor" });
  }
});

//Ruta DELETE /api/cart
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);

    if (!cart)
      return res.status(404).json({ message: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de Servidor" });
  }
});

//Ruta GET /api/cart
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de Servidor" });
  }
});

//Ruta POST /api/cart/merge
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    // Encontrar el carrito de invitado y el carrito de usuario
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res
          .status(400)
          .json({ message: "Carrito de invitado esta vacío" });
      }

      if (userCart) {
        //Combinar el carrito de invitado en el carrito de usuario
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === color
          );

          if (productIndex > -1) {
            // Si el artículo existe en el carrito del usuario, actualizar la cantidad
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // De lo contrario, agregar el artículo de invitado al carrito
            userCart.products.push(guestItem);
          }
        });

        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();

        //Eliminar el carrito de invitado después de combinar
        try {
            await Cart.findOneAndDelete({ guestId });
        } catch (error) {
            console.error("Error al eliminar el carrito de invitado:", error);                        
        }
        res.status(200),json(userCart);
      } else {
        // Si el usuario no tiene un carrito existente, asignar el carrito de invitado al usuario
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();

        res.status(200).json(guestCart);
      }
    } else {
        if (userCart) {
            // El carrito de invitado ya ha sido combinado, devolver el carrito del usuario
            return res.status(200).json(userCart);
        }
        res.status(404).json({message: "Carrito de invitado no encontrado"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Error de Servidor"});    
  }
});

module.exports = router;
