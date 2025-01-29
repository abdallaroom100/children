// const mongoose = require("mongoose")

import mongoose from "mongoose"
const connectDB = async ()=>{
//    await mongoose.connect("mongodb+srv://compound:root@compund.frjjj.mongodb.net/compound?retryWrites=true&w=majority&appName=compund").then(()=>{
   await mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("db connected succesfully")
}).catch((error)=>{
    console.log(error.message)
    
})
}

export default connectDB