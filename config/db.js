import mongoose from "mongoose";

const conectarDB = async () =>{
    try {
        const url = process.env.MONGO_URI;
        const connection = await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const con = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB Conectado en: ${con}`);
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;