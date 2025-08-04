//process 1st

// import dotenv from "dotenv";
// dotenv.config();

// import mongoose from "mongoose";
// import express from "express";
// import { chaiBackend } from "./constants.js";

// const app = express();

// // 1st method of connecting db, 2nd is best and it's in '/db/index.js'

// if (!process.env.MONGODB_URI) {
//   console.error("MONGODB_URI environment variable is not set!");
//   process.exit(1);
// }

// if (!process.env.PORT) {
//   console.error("PORT environment variable is not set!");
//   process.exit(1);
// }

// (async () => {  // iffi fun, that executes asap.
//   try {
//     const connectedData = await mongoose.connect(
//       `${process.env.MONGODB_URI}/${chaiBackend}`
//     );
//     console.log("MongoDB connected !!");
//     console.log(connectedData);

//     app.listen(process.env.PORT, () => {
//       console.log(`App is running on port: ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Mongo connection error:", error);
//     throw error;
//   }
// })();


// 2nd process of connecting db, more professional and effcient.
import dotenv from "dotenv";
dotenv.config({path: './.env'});
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()  // this is async-await fun, it always return promise.
.then(() => {
    app.on("error", (err) => {
        console.log("Error: ", err);
        throw err
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listning on port: ${process.env.PORT}`);
    })
    app.get("/", (req, res) => {
        try {
            res.send("Database Connected!!")
        } catch (error) {
            console.log(error);
            
        }
    })
})
.catch((err) => {
    console.log("Mongo connection failed! ", err);
})
