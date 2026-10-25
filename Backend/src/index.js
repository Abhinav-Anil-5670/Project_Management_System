import dotenv from 'dotenv'
import app from "./app.js"
import {connectDb} from './db/db.js'

dotenv.config({
    path:"./.env"
});

const port = process.env.PORT || 8000

connectDb()
    .then(()=>{
        app.listen(port,()=>{
    console.log("Server is running")
})
    })
    .catch((err)=>{
        console.log(err)
    })