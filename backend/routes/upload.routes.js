const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config();

const router = express.Router();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de Multer usando almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    // Función para manejar la subida del flujo de datos (stream) a Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });

        // Usa Streamifier para convertir el buffer de un archivo a un stream
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Llamar a la función streamUpload
    const result = await streamUpload(req.file.buffer);

    // Responder con la URL de la imagen subida
    res.json({imageUrl: result.secure_url});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Error de Servidor"});    
  }
});

module.exports = router;

