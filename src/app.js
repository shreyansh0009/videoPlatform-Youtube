import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors({
    origin: process.env.CORS_PORT   //optional, generally front-end ip included in this.
}))

app.use(express.json({limit: "16kb"})) //limit is optional
app.use(express.urlencoded())
app.use(express.static("public"))




export { app }