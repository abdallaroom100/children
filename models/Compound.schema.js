import mongoose from "mongoose";

const Schema = mongoose.Schema;

const compoundSchema = new Schema(
  {
    mainImage: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      
    },
    video: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address:{
      type:String,
      required:true
    },
    location: {
      type: String,
      required: true,
    },
    map:{
      type:String,
      default:""
    },
    pdf:{
      type:String,
      default:""
    },
    
    status: {
      type: String,
      enum: ["available", "soon", "sold"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ApartmentSchema = new Schema({
  mainImage: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
   
  },
  video: {
    type: String,
    default:"",
  },
  rooms:{
    type:String,
    required:true,
  },
  space: {
    type: String,
    required: true,
  },
  floor: {
    type: String,
    required: true,
  },

  bathrooms: {
    type: Number,
    required: true,
  },
  description: {
    type: [String],
    required: true,
  },
  identity:{
    type:String,
  required:true
  },
  status: {
    type: String,
    enum: ["available", "soon", "sold"],
    required: true,
  },
  compound: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Compound",
    required: true,
  },
});

export const Compound = mongoose.model("Compound", compoundSchema);
export const Apartment = mongoose.model("Apartment", ApartmentSchema);
