import mongoose from "mongoose";
import { Apartment } from "../models/Compound.schema.js";

export const getAllCompoundApartment = async (req, res) => {
  try {
    const { compoundId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(compoundId)) {
      return res.status(401).json({ error: "invalid id" });
    }
    const apartments = await Apartment.find({ compound: compoundId });
    console.log(apartments);
    res.status(200).json(apartments);
  } catch (error) {
    console.log("error in get all compound apartments function");
    console.log(error.message);
  } 
};


export const getAllApartments = async(req,res)=>{
  try {
    const apartments = await Apartment.find()
    if(!apartments) {
      return res.status(400).json({error:"there is not apartments "})
    }

  // await Apartment.updateMany({},{
  //   $set:{video:""}
  // },{new:true})
    res.status(200).json(apartments)
  } catch (error) {
    console.log("error in get all apartments function");
    console.log(error.message);
  }
}

export const getCurrentApartment = async (req,res)=>{
   const {id} = req.params
  try {
    if(!mongoose.Types.ObjectId.isValid(id)){
      return req.status(400).json({error:"invalid apartment id"})
    }
    const apartment = await Apartment.findById(id)
    if(!apartment){
      return res.status(400).json("apartment not found")
    }
    return res.status(200).json(apartment)
  } catch (error) {
    console.log(`error in get current apartment function`)
    console.log(error.message)
  }
}
export const addApartment = async (req, res) => {
  try {
    const { compoundId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(compoundId)) {
      return res.status(401).json({ error: "invalid id" });
    }
    const {
      mainImage,
      images,
      video,
      space,
      floor,
      bathrooms,
      description,
      status,
      rooms,
      identity
    } = req.body;

    if (
      !mainImage ||
      !space ||
      !floor ||
      !status ||
      !bathrooms ||
      !description ||
      !rooms || !identity
    ) {
      return res.status(401).json({ error: "please fill all fields" });
    }

    if (status !== "sold" && status !== "available" && status !== "soon") {
      return res
        .status(400)
        .json({ error: "please select what is available in status" });
    }
    const newApartment = await Apartment.create({
      mainImage,
      images,
      video,
      space,
      floor,
      status,
      bathrooms,
      description,
      rooms,
      identity,
      compound: compoundId,
    });

    res.status(200).json(newApartment);
  } catch (error) {
    console.log("error in add apartment function");
    console.log(error.message);
  }
};

export const updateApartment = async (req, res) => {
  const { compoundId } = req.params;
  console.log(compoundId)
  try {
    if (!mongoose.Types.ObjectId.isValid(compoundId)) {
      return res.status(400).json({ error: "invalid id" });
    }
    const {
      mainImage,
      images,
      video,
      space,
      floor,
      bathrooms,
      description,
      status,
      rooms,
      identity,
    } = req.body;

    if (
      !mainImage &&
      !space &&
      !floor &&
      !status &&
      !bathrooms &&
      !description &&
      !rooms && !identity
    ) {
      return res.status(401).json({ error: "قم بملئ البيانات الاساسية" });
    }
    if (status !== "sold" && status !== "available" && status !== "soon") {
      return res
        .status(400)
        .json({ error: "please select what is available in status" });
    }
    const updatedApartment = await Apartment.findByIdAndUpdate(
      compoundId,
      {
        mainImage,
        images,
        video,
        space,
        floor,
        bathrooms,
        description,
        status,
        rooms,
        identity
      },
      {
        new: true,
      }
    );
    if (!updatedApartment) {
      return res.status(401).json({ error: "apartment not found" });
    }
    res.status(200).json(updatedApartment);
  } catch (error) {
    console.log("error in update apartment function");
    console.log(error.message);
  }
};


export const deleteApartment = async (req,res)=>{
    const {apartmentId} = req.params
     
    try {
        if(!mongoose.Types.ObjectId.isValid(apartmentId)){
            return res.status(400).json({error:"invalid id"})
        }
        const deletedCompound = await Apartment.findByIdAndDelete(apartmentId,{
            new:true
        })
        if(!deletedCompound){
            return res.status(401).json({error:"apartment not found"})
        }
        res.status(200).json(deletedCompound)
    } catch (error) {
        console.log("error in delete apartment function")
        console.log(error.message)
    }
}