import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("db connected succesfully");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export default connectDB;
