import mongoose from "mongoose"
import User  from "../models/User.schema.js"
import Complaint from "../models/Complaints.schema.js"





export const getAllComplaints = async (req,res)=>{
  try {
    

     const allComplaints = await Complaint.find({}).sort({createdAt:-1}).populate("user")
    
    return res.status(200).json(allComplaints)
  } catch (error) {
    console.log(error)
  }
}
export const createComplaint = async (req,res)=>{
  try {
     const {userId} = req.params
     const {message} = req.body
      if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(401).json({message:"invalid id "})
      }

     const user = await User.findById(userId)
     if(!user){
      return res.status(401).json({message:"user not found"})
     }

      await Complaint.create({
      user:user._id,
      message
     })
     
     return res.status(200).json({message:"message have sent successfully"})
  } catch (error) {
    console.log(error)
  }
}