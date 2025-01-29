import mongoose from "mongoose";
import { Compound } from "../models/Compound.schema.js";

export const getAllCompounds = async (req, res) => {
  try {
    const compounds = await Compound.find();

    res.status(200).json(compounds);
  } catch (error) {
    console.log("error in get all compound function");
    console.log(error.message);
  }
};

export const getCurrentCompound = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "not valid compound id" });
    }
    const compound = await Compound.findById(id);
    if (!compound)
      return res.status(401).json({ error: "the compound not found" });
    return res.status(200).json(compound);
  } catch (error) {
    console.log(`error in get curernt compound function`);
    console.log(error.message);
  }
};

export const addCompound = async (req, res) => {
  try {
    const {
      mainImage,
      images,
      title,
      location,
      status,
      video,
      description,
      address,
      map,
      pdf,
    } = req.body;

    if (
      !mainImage ||
      !title ||
      !location ||
      !status ||
      !description ||
      !address
    ) {
      return res.status(401).json({ error: "please fill all fields" });
    }
    if (status !== "sold" && status !== "available" && status !== "soon") {
      return res
        .status(400)
        .json({ error: "please select what is available in status" });
    }
    const newCompound = await Compound.create({
      mainImage,
      images,
      title,
      location,
      status,
      video,
      address,
      description,
      map,
      pdf,
    });

    res.status(200).json(newCompound);
  } catch (error) {
    console.log("error in add compound function");
    console.log(error.message);
  }
};

export const updateCompound = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid id" });
    }
    const {
      title,
      mainImage,
      location,
      images,
      status,
      video,
      description,
      address,
      map,
      pdf,
    } = req.body;
    if (
      mainImage &&
      !title &&
      !location &&
      !status &&
      !description &&
      !address
    ) {
      return res
        .status(401)
        .json({ error: "fill all required fields for updating" });
    }
    if (status !== "sold" && status !== "available" && status !== "soon") {
      return res
        .status(400)
        .json({ error: "please select what is available in status" });
    }
    const updatedCompound = await Compound.findByIdAndUpdate(
      id,
      {
        title,
        location,
        mainImage,
        video,
        images,
        status,
        description,
        address,
        map,
        pdf,
      },
      {
        new: true,
      }
    );
    if (!updatedCompound) {
      return res.status(401).json({ error: "compound not found" });
    }
    res.status(200).json(updatedCompound);
  } catch (error) {
    console.log("error in update compound function");
    console.log(error.message);
  }
};

export const deleteCompound = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid id" });
    }
    const deletedCompound = await Compound.findByIdAndDelete(id, {
      new: true,
    });
    if (!deletedCompound) {
      return res.status(401).json({ error: "compound not found" });
    }
    res.status(200).json(deletedCompound);
  } catch (error) {
    console.log("error in update compound function");
    console.log(error.message);
  }
};
