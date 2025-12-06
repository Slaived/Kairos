const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product.models");
const User = require("./models/user.models");
const Cart = require("./models/cart.models");

const products = require("./data/products");

dotenv.config();

// Connectar a MongoDB
mongoose.connect(process.env.MONGO_URI);

// Funcipon para sembrara datos

const seedData = async () => {
    try {
        // Borrar datos existentes
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();


// Creamos un usuario admin por default
        const createUser = await User.create({
            name: "Admin",
            email: "admin@gmail.com",
            password: "Admin.2025",
            role:"admin",
        });

        // Asignar un ID de usuario por default a cada producto
        const userID = createUser._id;

        const sampleProducts = products.map((product) => {
            return {...product, user: userID };
        });

        //Ingresamos los productos a la base de datos
        await Product.insertMany(sampleProducts);

        console.log("Datos de productos sembrados exitosamente!!");
        process.exit();        
    } catch (error) {
        console.error("Error al sembrar los datos", error); 
        process.exit(1);               
    }
};

seedData();


