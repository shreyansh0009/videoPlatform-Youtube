import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors({
    origin: process.env.CORS_PORT   //optional, generally front-end ip included in this.
}))

app.use(express.json({limit: "16kb"})) //limit is optional
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Routes import
import userRouter from './routes/user.routes.js'

//Routes decleration--> whole control to 'userRouter', now 'userRouter' will decide what to do.
app.use("/api/v1/users", userRouter)




export { app }