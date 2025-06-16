// import mongoose from "mongoose";



// const Schema = mongoose.Schema;

// const escortSchema = new Schema({
//   fullName: {
//     type: String,
//     required: true,
//   },
//   identityNumber: {
//     type: Number,
//     required: true,
//   },
//   gender: {
//     type: String,
//     required: true,
//     enum: ["ذكر", "مؤنث"],
//   },
//   kinship:{
//     type:String,
//     required:true,
//   }
// });
// const userSchema = new Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     updateToken: {
//       type: String,
//     },
//     gender: {
//       type: String,
//       required: true,
//       enum: ["male", "female"],
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     nationality: {
//       type: String,
//       required: true,
//     },
//     identityNumber: {
//       type: Number,
//       required: true,
//     },
//     identityImage: {
//       type: String,
//       required: true,
//     },
//     birthDate: {
//       type: Date,
//       required: true,
//     },
//     MarityStatus: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       required: true,
//       enum: ["admin", "user"],
//     },
//     cityOfResidence: {
//       type: String,
//       required: true,
//     },
//     escorts: escortSchema,
    
//   },
//   {
//     timestamps: true,
//   }
// );
// const User = mongoose.model("q3wanUser", userSchema);

// export default User;


import mongoose from "mongoose"

const housematesSchema = new mongoose.Schema({
  name: { type: String, required: true },         // اسم الابن
  birthDate: { type: Date, required: true },      // تاريخ ميلاد الابن
  identityNumber: { type: String, required: true },   // رقم هوية الابن
  gender: { type: String, enum: ['ذكر', 'أنثى'], required: true },
  kinship: {type:String,required:true} // جنس الابن
}, { _id: false });

const homeSchema = new mongoose.Schema({
  homeNickname: { type: String, required: true }, // الاسم المستعار للمنزل
  city: { type: String, required: true },         // المدينة
  district: { type: String, required: true }, 
  housemates:[housematesSchema],                   // الأبناء (مرافقين)
  addtionalHomes:[
    {
      homeNickname: { type: String, required: true }, // الاسم المستعار للمنزل
      city: { type: String, required: true },         // المدينة
      district: { type: String, required: true },     // الحي
      housemates:[housematesSchema]                   // الأبناء (مرافقين)
    },
  ]                    // الأبناء (مرافقين)
}, { _id: false });

const residenceSchema = new mongoose.Schema({
  currentCity: { type: String, required: true },  // مدينة السكن الحالية
  bornInSameCity: { type: Boolean, required: true }, // هل من مواليد نفس المدينة
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  thirdName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {type:String,required:true,unique:true},
  identityNumber: { type: String, unique: true },
  nationality: {type:String,default:""},
  password:{type:String,required:true},
  hasAFamily  : { type: Boolean, default:false},
  gender: { type: String, enum: ['ذكر', 'أنثى'] },
  rule:{type:String,default:"user",enum:["user","admin"]},
  phone: { type: Number, required: true },
  birthDate: {type:Date,default:""},
  maritalStatus: {type:String,default:""},  
  idImagePath: { type: String,default:"" },                 // مسار صورة الهوية
  cityOfResidence: {type:String,default:""},                     // بيانات السكن
  home: homeSchema,                              // بيانات المنزل والأبناء
}, { timestamps: true });

 
const User= mongoose.model('Q3wanUser', userSchema);

export default User;


