import dotenv from "dotenv";
import mongoose from "mongoose";
import { chaiBackend } from "../constants.js";


dotenv.config({
    path: './.env'
});

const connectDB = async () => {
    try {
        const connectionData = await mongoose.connect(`${process.env.MONGODB_URI}/${chaiBackend}`)
        console.log(`MongoDB connected !! DB Host: ${connectionData.connection.host}`);
        
    } catch (error) {
        console.log("Mongoose connection error: ", error);
        process.exit(1)
    }
}

export default connectDB