import mongoose from "mongoose";

const Schema = mongoose.Schema;

const complaintsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
  },
  message: {
    type: String, 
    required: true,
    unique: true
  }
 
 
}, {
  timestamps: true
});

const Complaint = mongoose.model("Complaint", complaintsSchema);

export default Complaint;