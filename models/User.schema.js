import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String, 
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rule: {
    type: String,
    enum: ["student", "admin"],
    default:"student"
  },
  updateToken : {
    type:String,
    default:""
  },
  subscription: {
    type: {
      type: String,
      enum: ["not_subscribed","beginner", "advanced" , "professional"],
      default: "not_subscribed"
    },
    price: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ""
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;