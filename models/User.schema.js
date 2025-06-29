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

import mongoose from "mongoose";

const housematesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // اسم الابن
    birthDate: { type: Date, required: true }, // تاريخ ميلاد الابن
    identityNumber: { type: String, required: true }, // رقم هوية الابن
    gender: { type: String, enum: ["ذكر", "أنثى"], required: true },
    kinship: { type: String, required: true }, // جنس الابن
  },
  { _id: false }
);

const homeSchema = new mongoose.Schema(
  {
    homeNickname: { type: String, required: true }, // الاسم المستعار للمنزل
    city: { type: String, required: true }, // المدينة
    district: { type: String, required: true },
    housemates: [housematesSchema], // الأبناء (مرافقين)
    addtionalHomes: [
      {
        homeNickname: { type: String, required: true }, // الاسم المستعار للمنزل
        city: { type: String, required: true }, // المدينة
        district: { type: String, required: true }, // الحي
        housemates: [housematesSchema], // الأبناء (مرافقين)
      },
    ], // الأبناء (مرافقين)
  },
  { _id: false }
);

const residenceSchema = new mongoose.Schema(
  {
    currentCity: { type: String, required: true }, // مدينة السكن الحالية
    bornInSameCity: { type: Boolean, required: true }, // هل من مواليد نفس المدينة
  },
  { _id: false }
);


const incomeSourceSchema = new mongoose.Schema({
  sourceType:{
   type:String,
   required:true,
   enum:["راتب تقاعدي","راتب عادي","ضمان اجتماعي","حساب مواطن"]      
  },
  sourceAmount:{
    type:Number,
    required:true,
   
  },
  sourceImage:{
    type:String,
    required:true,
  }
})

const facilitiesSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    
  },
  identityNumber:{
    type:Number,
    reuqired:true,
  },
  birthDate:{
    type:String,
    required:true,
    
        
  },
  dateType:{
    type:String,
    required:true,
    enum:['هجري','ميلادي'],
  },
  studyLevel:{
    type:String,
    required:true,
    enum:["ابتدائي","متوسط","ثانوي" ,"جامعي"]
  },
  studyGrade:Number,
  healthStatus:{
    type:String,
    enum:["سليم","غير سليم"],
    required:true,
  },
  disabilityType:{
    type:String,
    enum:["ذوي احتياجات خاصة","مريض",""],
    default:""
  },
  kinship:{
    type:String,
    default:""
  }
  

})
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    secondName: { type: String, required: true },
    thirdName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    identityNumber: { type: String, unique: true },
    nationality: { type: String, default: "" },
    password: { type: String, required: true },
    birthDatetype: {
      type: String,
      enum: ["هجري", "ميلادي"],
    },
    birthDate: { type: String, default: "" },

    jobStatus: {
      type: String,
      enum: ["موظف", "عاطل"],
    },
    healthStatus: {
      type: String,
      enum: ["سليم", "غير سليم"],
    },
    disabilityType : {
      type:String,
      enum:['ذوي احتياجات خاصة','مريض',""],
      defalut:"",
    },
    district : {
      type:String,
      default:""
    }, 
    housingType:{
      type:String,
      enum:["ملك","إيجار"],
    },
    rentAmount: {
      type: Number,
      default: 0,
      
    },
     rentImage:{
      type:String,
      default:"",
     },
    incomeSources:[incomeSourceSchema],
    
    bankName: {
      type: String,
      enum: [
        "",
        "الأهلي السعودي",
        "الراجحي",
        "الرياض",
        "البلد",
        "الجزيرة",
        "الإنماء",
        "سامبا",
        "العربي الوطني",
        "السعودي الفرنسي",
        "ساب",
        "الخليج الدولي",
        "بنك الاستثمار",
        "بنك التنمية",
        "بنك الخليج الدولي",
        "بنك الأول"
      ],
      default: ""
    },

    ibanImage:{
      type:String,
       default:"",
    },
    numberOfFacilities:{
      type:Number,
      default:0,
    },
    numberOfMales:Number,
    numberOfFemales:Number,
    familyCardFile:{
      type:String,
      defulat:"",
    },

    facilitiesInfo:[facilitiesSchema],
    hasAFamily: { type: Boolean, default: false },
    gender: { type: String, enum: ["ذكر", "أنثى"] },
    rule: { type: String, default: "user", enum: ["user", "admin"] },
    phone: { type: Number, required: true },
    maritalStatus: { type: String, default: "" },
    idImagePath: { type: String, default: "" }, // مسار صورة الهوية
    cityOfResidence: { type: String, default: "" },
    // home: homeSchema, 
  },
  { timestamps: true }
);

const User = mongoose.model("Q3wanUser", userSchema);

export default User;
