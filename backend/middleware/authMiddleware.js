const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

// Middleware de protección de rutas
const protect = async(req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.user.id).select("-password");
            
            // Verificar que el usuario existe
            if (!req.user) {
                return res.status(401).json({message: "Usuario no encontrado"});
            }            
            next();
        } catch (error) {
            console.error("Verificación de Token fallida", error); 
            res.status(401).json({message: "No autorizado, token fallido"});          
        }
    } else {
        res.status(401).json({message: "No autorizado, token no proporcionado"});
    }
};

// Middleware para verificar si el usuario es un administrador
const admin = (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({message: "No autorizado como administrador"})
    }
}

module.exports = { protect, admin };