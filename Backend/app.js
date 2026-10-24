//File for express setup

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//express middlewares (app.use())
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//cors
app.use(cors({
    origin : process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders : ["Content-Type","Authorization"]
}))

//routes go here

app.get('/',(req,res)=>{
    res.send("Server is working")
})

export default app