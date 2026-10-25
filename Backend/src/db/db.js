import mongoose from "mongoose";

const connectDb = async ()=>{
    
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected")
    }
    catch(err){
        console.log(err)
    }
}

export {connectDb}