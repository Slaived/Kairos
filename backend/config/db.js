const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB conectado exitosamente");        
    }catch (err) {
        console.error("Conexión MongoDB  fallida", err);  
        process.exit(1);    
    }
}

module.exports = connectDB;
