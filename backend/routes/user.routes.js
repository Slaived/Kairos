const express = require("express");
const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Ruta POST /api/users/register
router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;
    
    try {
        //Registro
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({message: "Usuario ya existente"});

        user = new User({name, email, password});
        await user.save();

        // Crear el JWT
        const payload = {user: {id: user._id, role: user.role} };

        // Carga y devolución del token, junto con datos del usuario
        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: "40h" },
            (err, token) => {
                if (err) throw err;

                //Envía el usuario y token en respuesta
                res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                });
        }
    );
    } catch (error) {
        console.log(error);
        res.status(500).send("Error de Servidor");        
    }
});

// Ruta POST /api/users/login
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        //Encuentra el usuario por correo
        let user = await User.findOne({ email });

        if (!user) return res.status(400).json({message: "Credenciales Inválidas"});
        const isMatch = await user.matchPassword(password);

        if (!isMatch) 
            return res.status(400).json({message: "Credenciales Inválidas"});

        // Crear el JWT
        const payload = {user: {id: user._id, role: user.role} };

        // Carga y devolución del token, junto con datos del usuario
        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: "40h" },
            (err, token) => {
                if (err) throw err;

                //Envía el usuario y token en respuesta
                res.json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                });
        }
    );

    } catch (error) {
        console.error(error);
        res.status(500).send("Error de Servidor");       
    }
});

// Ruta GET /api/users/profile
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});


module.exports = router;

