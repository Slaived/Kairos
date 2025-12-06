const express = require("express");
const Product = require("../models/product.models.js");
const { protect, admin } = require("../middleware/authMiddleware.js");

const router = express.Router();

//Ruta POST /api/products


router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, // Hace referencia al usuario administrador que lo creo
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error de Servidor");
  }
});

//Ruta PUT /api/products/:id


router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    //Encontrar producto por su ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // Actualiza los campos del producto
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      //Guarda la actuzalicación en la base de datos
      const updateProduct = await product.save();
      res.json(updateProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error de Servidor");
  }
});

//Ruta DELETE /api/products/:id


router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // Encontrar producto por su ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // Eliminar de la base datos
      await product.deleteOne();
      res.json({ message: "Producto eliminado" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error de Servidor" });
  }
});

// Ruta GET /api/products


router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    // Filtro de búsqueda
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }

    if (category) {
      const normalizedCategory = category.toLowerCase().trim();
      if (normalizedCategory !== "all") {
        query.category = category;
      }
    }

    if (material) {
      query.material = { 
        $regex: material, 
        $options: 'i'  
      };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: [color] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filtro de búsqueda 
    if (search) {
      // Crear un array para las condiciones de búsqueda
      const searchConditions = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
      
      // Si ya hay otros filtros aplicados, combinar correctamente
      if (Object.keys(query).length > 0) {
        query = {
          $and: [
            { ...query },  
            { $or: searchConditions }  // La búsqueda
          ]
        };
      } else {
        // Si no hay otros filtros, usar solo la búsqueda
        query.$or = searchConditions;
      }
    }

    // Ordenamiento
    let sort = {};
    if (sortBy) {        
      console.log("SortBy recibido:", sortBy);
      
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
      
      console.log("Sort aplicado:", sort);
    }

    // Obtener productos y aplicar ordenamiento y límite
    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    console.log("Q Primer producto (debería ser el más barato):", products[0]?.name, products[0]?.price);
    console.log("Q Último producto (debería ser el más caro):", products[products.length-1]?.name, products[products.length-1]?.price);

    res.json(products);
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Error de Servidor");
  }
});

//Ruta GET /api/products/best-seller
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if(bestSeller) {
      res.json(bestSeller);
    } else {
        res.status(404).json({message: "No se encontró ningún más vendido"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error de Servidor");        
  }
});

//Ruta GET /api/products/new-arrivals
router.get("/new-arrivals", async (req, res) => {
  try {
    // Obtener los 8 productos más recientes
    const newArrivals = await Product.find().sort({createdAt: -1}).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error de Servidor");        
  }
});

//Ruta GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product) {
      res.json(product);
    } else {
      res.status(404).json({message: "Producto No Encontrado"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error de Servidor");   
  }
});

//Ruta GET /api/productssimilar/:id
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if(!product) {
      return res.status(404).json({message: "Producto No Encontrado"});
    }

    const similarProducts = await Product.find({
      _id: { $ne: id }, // Excluir el ID del producto actual
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error de Servidor");        
  }
});

module.exports = router;
