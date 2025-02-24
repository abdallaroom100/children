import mongoose from "mongoose";
import User from "../models/User.schema.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs"; 
 import validator from "validator"
import { getSubscriptionPrice } from "../utils/getSubscriptoinPrice.js";
import Complaint from "../models/Complaints.schema.js";


 export const getAllUsers = async (req,res)=>{

  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    console.log(`error in get all users function`);
    console.log(error.message);
  }
 }
export const getCurrentUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req?.userId)) {
      return res.status(400).json({ error: "invalid id" });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: "user not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(`error in get current user function`);
    console.log(error.message);
  }
};

export const signUpUser = async (req, res) => {
  const { name, password,email } = req.body;
  try {
    if (!name || !password) { 
      return res.status(400).json({ error: "plase fill all fields" });
    }
    if(name.length < 3){
        return res.status(400).json({ error: "username must be atleast 3 chars" });
    }
    if(!validator.isEmail(email)
    ){
        return res.status(400).json({ error: "invalid email" });
    }
    if(password.length < 6){
        return res.status(400).json({ error: "password must be atleast 6 chars" });
    }
     const user = await User.findOne({email})
   
     if(user) return res.status(400).json({error:"this email is already exist"})
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hash,
    });
    generateToken(newUser._id, res,req);
    res.status(200).json({...newUser._doc,token:req.token});
  } catch (error) {
    console.log(`error in signup user function`);
    console.log(error.message);
  }
};
export const loginUser = async (req, res) => {

  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "plase fill all required fields" });
    }
    
 
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "email not found" });
    }
    const Vpassword = bcrypt.compareSync(password, user.password);
    if (!Vpassword){
        return res.status(401).json({ error: "password is incorrect" });
    }
    generateToken(user._id, res,req);
    console.log(req.token)
    res.status(200).json({...user._doc,token:req.token});
  } catch (error) {
    console.log(`error in login user function`);
    console.log(error.message);
  }
};

export const deleteUser = async (req,res)=>{
    const {userId} = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "invalid id" });
          }
        const user = await User.findByIdAndDelete(userId,{
            new:true
        })
        if (!user) {
            return res.status(401).json({ error: "user not found" });
        }
        return res.status(200).json("user has deleted successfully")
    } catch (error) {
        console.log(`error in delete user function`);
        console.log(error.message);
    }
}
export const updateUser = async (req,res)=>{
    const {userId} = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "invalid id" });
          }
        const {username,password} = req.body
        if (!username && !password) {
            return res.status(400).json({ error: "plase fill at least one field" });
          }
          if(password.length < 6){
            return res.status(400).json({ error: "password must be atleast 6 chars" });
        }
        if(username.length < 3){
            return res.status(400).json({ error: "username must be atleast 3 chars" });
        }
  const existUser = await User.findOne({username})
  if(existUser) 
       if(username){
        return res.status(400).json({error:"this username is already exist"})
       }
        const hash = bcrypt.hashSync(password,10)
        const user = await User.findByIdAndUpdate(userId,{
            username,
            password:hash
        },{new:true})

        if (!user) {
            return res.status(401).json({ error: "user not found" });
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(`error in delete user function`);
        console.log(error.message);
    }
}

export const logOut = async (req, res) => {
    try {
      res.cookie('jwt', '', {
        httpOnly: true,
        secure: true,
        expires: new Date(0),  
    });
    res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.log(`error in logout user function`);
      console.log(error.message);
    }
  };



  
  export const subscribe = async (req,res)=>{
    try {
      const {id} = req.params
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(401).json({message:"invalid id"})
      }

      const {name, type,numbers} = req.body
      if(!name || !type || !numbers){
        return res.status(400).json({message:"please fill all required fields"})
      }

      const user = await User.findById(id)
      if(!user){
        return res.status(401).json({message:"user  not found"})
      }


       if(user.subscription.type !== "not_subscribed"){
      return res.status(400).json({message:"you have already subscribed"})
       }


        if(name.length < 3){
          return res.status(401).json({message:"name must be atleast 3 chars"})
        }else {
          user.subscription.name = name
        }



      if(numbers != 16 ){
      return res.status(400).json({message:"card numbers must be 16 "})
      }

      if(type == "advanced" || type == "professional"|| type ==  "beginner"  ){
        user.subscription.type = type
        user.subscription.price = getSubscriptionPrice(type)
      }
      else {
        return res.status(401).json({message:"invalid subscription type"})
      }
      await user.save()
      res.status(200).json(user)

    } catch (error) {
      console.log(error)
    }
  }


  export const createAdmin =  async () =>{
     
    const { name, password,email } = req.body;
    try {
      if (!name || !password) { 
        return res.status(400).json({ error: "plase fill all fields" });
      }
      if(name.length < 3){
          return res.status(400).json({ error: "username must be atleast 3 chars" });
      }
      if(!validator.isEmail(email)
      ){
          return res.status(400).json({ error: "invalid email" });
      }
      if(password.length < 6){
          return res.status(400).json({ error: "password must be atleast 6 chars" });
      }
       const user = await User.findOne({email})
     
       if(user) return res.status(400).json({error:"this email is already exist"})
      const hash = bcrypt.hashSync(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hash,
        rule:"admin"
      });
      generateToken(newUser._id, res,req);
      res.status(200).json({...newUser._doc,token:req.token});
    } catch (error) {
      console.log(`error in signup user function`);
      console.log(error.message);
    }
  }

  export const loginAdmin = async (req, res) => {

    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ error: "plase fill all required fields" });
      }
      
   
      const user = await User.findOne({ email,rule:"admin" });
      if (!user) {
          return res.status(401).json({ error: "email not found" });
      }
      const Vpassword = bcrypt.compareSync(password, user.password);
      if (!Vpassword){
          return res.status(401).json({ error: "password is incorrect" });
      }
      generateToken(user._id, res,req);
      console.log(req.token)
      res.status(200).json({...user._doc,token:req.token});
    } catch (error) {
      console.log(`error in login user function`);
      console.log(error.message);
    }
  };




  export const  getAdminPageDetails  = async (req,res)=>{
    try {
      
      const totalCompalints = await Complaint.find({}).countDocuments()
      const last3Complaints = await Complaint.find({}).sort({createdAt:-1}).limit(3)
      const last8Students = await User.find({ rule: "student" })
      .sort({ createdAt: -1 })
      .limit(8)
      .select("name email subscription");

    // 2. عدد الطلاب اللي مش Admin
    const studentCount = await User.countDocuments({ rule: "student" });

    // 3. إجمالي الربح من الاشتراكات
    const totalRevenue = await User.aggregate([
      {
        $match: { "subscription.price": { $gt: 0 } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$subscription.price" }
        }
      }
    ]);

    return {
      totalRevenue: totalRevenue[0]?.total || 0,
      studentCount,
      last8Students,
      last3Complaints,
      totalCompalints,
    };
    } catch (error) {
      console.log(error)
    }
  }