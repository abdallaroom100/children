import mongoose from "mongoose";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { getSubscriptionPrice } from "../utils/getSubscriptoinPrice.js";
import Complaint from "../models/Complaints.schema.js";
import jwt from "jsonwebtoken";
import { sendForgetPassowrdMessage } from "../utils/sendForgetrPassowrdMessage.js";
import User from "../models/User.schema.js";
import fs from "fs"
import {dirname} from "path"
import { fileURLToPath } from "url";
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
 const imagePath = path.join(__dirname,"../images")



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.log(`error in get all users function`);
    console.log(error.message);
  }
};

export const findUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "user not found" });
    } 

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req?.userId)) {
      return res.status(400).json({ error: "invalid id" });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: "user not found",success:false });
    res.status(200).json({...user._doc,password:undefined,rule:undefined, success:true});
  } catch (error) {
    console.log(`error in get current user function`);
    console.log(error.message);
  }
};

export const signUpUser = async (req, res) => {
  let { fullName, password, email, phone, identityNumber } = req.body;
  try {
    if (!fullName || !password || !email || !phone || !identityNumber) {
      return res.status(400).json({ error: "من فضلك قم بملئ جميع الحقول" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "البريد الإلكتروني غير صالح" });
    }
 
    const user = await User.findOne().where("email").equals(email);
    console.log(user);
    if (user)
      return res.status(400).json({ error: "البريد الإلكتروني مستخدم من قبل" });


    fullName = fullName.split(" ").filter((name) => name !== "");
    if (fullName.length != 4) {
      return res.status(400).json({ error: "اسم المستخدم يجب أن يكون رباعيا" });
    }

    
 
     if(String(phone).length != 9) {
      return res.status(400).json({error:"ادخل رقم هاتف صحيح"})
     }

    if (String(identityNumber).length !== 10) {

      return res.status(400).json({ error: "رقم الهوية يجب أن يكون 10 أرقام" });
    }

    if (isNaN(Number(identityNumber))) {
      return res.status(400).json({ error: "رقم الهوية يجب أن يكون أرقام فقط" });
    }
   
     const checkUserIdentityNumber = await User.findOne({identityNumber})
     if(checkUserIdentityNumber){
      return res.status(400).json({error:"رقم الهوية هذا مستخدم من قبل"})
     }
    

    if (password.length <= 8) {
      return res
        .status(400)
        .json({ error: "كلمة المرور يجب أن يكون على الأقل 8 أحرف" });
    }

   

    const hash = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      firstName: fullName[0],
      secondName: fullName[1],
      thirdName: fullName[2],
      lastName: fullName[3],
      email:String(email).toLowerCase(),
      password: hash,
      phone,
      identityNumber,
      rule: "user",
    });

    generateToken(newUser._id, res, req);

    res.status(200).json({
      ...newUser._doc,
      password: undefined,
      rule: undefined,
      token: req.token,
    });
  } catch (error) {
    console.log(`error in signup user function`);
    console.log(error.message);
  }
};

export const loginUser = async (req, res) => {
  const { loginDetails, password } = req.body;
  try {
    let user;
    if (!loginDetails || !password) {
      return res.status(400).json({ error: "من فضلك قم بملئ جميع الحقول" });
    }
    if (validator.isEmail(loginDetails)) {
      
      user = await User.findOne({email:String(loginDetails).toLowerCase()})
      console.log(user)
    } else {
      if(!Number(loginDetails)){
        return res.status(401).json({ error: "بيانات التسجيل هذه غير موجوده" });
      }
      user = await User.findOne({phone:loginDetails})
    }

    if (!user) {
      return res.status(401).json({ error: "بيانات التسجيل هذه غير موجوده" });
    }
    console.log(user.password)
    const Vpassword = bcrypt.compareSync(password,user.password)
    if (!Vpassword) {
      return res.status(401).json({ error: "بيانات التسجيل هذه غير موجوده" });
    }
    generateToken(user._id, res, req);
   return res.status(200).json({
      ...user._doc,
      password: undefined,
      rule: undefined,
      token: req.token,
    });
  } catch (error) {
    console.log(`error in login user function`);
    console.log(error.message);
  }
};



export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "المعرف غير صالح" });
    }
    const user = await User.findByIdAndDelete(userId, {
      new: true,
    });
    if (!user) {
      return res.status(401).json({ error: "المستخدم غير موجود" });
    }
    return res
      .status(200)
      .json({ message: "تم حذف المستخدم بنجاح", success: true });
  } catch (error) {
    console.log(`error in delete user function`);
    console.log(error.message);
  }
};

const deleteImageAfterError = (req) => {
  if (req.file && fs.existsSync(path.join(imagePath, req.file?.filename))) {
    fs.unlinkSync(path.join(imagePath, req.file?.filename));
  }
}

const validateHomeData = (homeData) => {
  // التحقق من البيانات الأساسية للمنزل
  if (!homeData.homeNickname || !homeData.city || !homeData.district) {
    return { isValid: false, error: "من فضلك قم بملئ جميع بيانات المنزل الأساسية" };
  }

  // التحقق من وجود مرافق واحد على الأقل
  if (!homeData.housemates || homeData.housemates.length < 1) {
    return { isValid: false, error: "يجب أن يكون لديك على الأقل مرافق واحد" };
  }

  // التحقق من بيانات المرافقين
  for (const housemate of homeData.housemates) {
    if (!housemate.name || !housemate.kinship || !housemate.gender || !housemate.birthDate || !housemate.identityNumber) {
      return { isValid: false, error: "من فضلك قم بملئ جميع بيانات المرافقين" };
    }
  }

  // التحقق من المنازل الإضافية إذا وجدت
  if (homeData.additionalHomes && homeData.additionalHomes.length > 0) {
    for (const home of homeData.additionalHomes) {
      if (!home.homeNickname || !home.city || !home.district) {
        return { isValid: false, error: "من فضلك قم بملئ جميع بيانات المنازل الإضافية" };
      }
    }
  }

  return { isValid: true };
}


export const updateUser = async (req, res, next) => {
  try {
    const {
      firstName,
      secondName,
      thirdName,
      lastName,
      phone,
      gender,
      birthDate,
      maritalStatus,
      nationality,
      cityOfResidence,
      identityNumber,
      home,
    } = req.body;

    // التحقق من البيانات الأساسية
    if (!firstName || !secondName || !thirdName || !lastName || !phone || 
        !gender || !birthDate || !maritalStatus || !nationality || 
        !identityNumber || !cityOfResidence) {
      deleteImageAfterError(req);
      return res.status(400).json({ error: "من فضلك قم بملئ جميع البيانات الأساسية" });
    }

    // البحث عن المستخدم
   
    const existUser = await User.findById(req.userId);
    if (!existUser) {
      deleteImageAfterError(req);
      return res.status(400).json({ error: "المستخدم غير موجود" });
    }
    const checkUser = await User.findOne({identityNumber,_id:{$ne:req.userId}})
 if(checkUser){
      return res.status(400).json({ error: "رقم الهوية هذا مستخدم من قبل" });
    }
    // تحليل بيانات المنزل
    let homeData;
    try {
      homeData = typeof home === 'string' ? JSON.parse(home) : home;
    } catch (error) {
      deleteImageAfterError(req);
      return res.status(400).json({ error: "بيانات المنزل غير صحيحة" });
    }

    // التحقق من صحة بيانات المنزل
    const homeValidation = validateHomeData(homeData);
    if (!homeValidation.isValid) {
      deleteImageAfterError(req);
      return res.status(400).json({ error: homeValidation.error });
    }

    // تحديث الصورة إذا وجدت
    
    let finalIdImagePath = existUser.idImagePath
     if(req.file && existUser?.idImagePath){
       const oldImagePath  = imagePath + "/" + existUser.idImagePath?.split("/")?.slice(-1)[0]
      if(fs.existsSync(oldImagePath)){
        fs.unlinkSync(oldImagePath)
      }
      finalIdImagePath = `${req.protocol}://${req.get("host")}/${req.file?.filename}`
     } else  if(req.file && !existUser?.idImagePath){
      finalIdImagePath = `${req.protocol}://${req.get("host")}/${req.file?.filename}`
     }
     console.log(req.file?.filename)
     console.log(imagePath)
     console.log(existUser.idImagePath)
    // تحديث بيانات المستخدم
    await existUser.updateOne({
      idImagePath: finalIdImagePath,
      home: homeData,
      phone,
      gender,
      birthDate,
      maritalStatus,
      nationality,
      cityOfResidence,
      identityNumber
    });

    existUser.hasAFamily = true;
    await existUser.save();
    
    res.status(200).json({ message: "تم تحديث البيانات بنجاح", success: true });
    next();
  } catch (error) {
    console.log(`error in update user function`);
    console.log(error.message);

    res.status(500).json({ error: "حدث خطأ أثناء تحديث البيانات" });
  }
};




export const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(`error in logout user function`);
    console.log(error.message);
  }
};

export const subscribe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(401).json({ message: "invalid id" });
    }

    const { name, type, numbers } = req.body;
    if (!name || !type || !numbers) {
      return res
        .status(400)
        .json({ message: "please fill all required fields" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "user  not found" });
    }

    if (user.subscription.type !== "not_subscribed") {
      return res.status(400).json({ message: "you have already subscribed" });
    }

    if (name.length < 3) {
      return res.status(401).json({ message: "name must be atleast 3 chars" });
    } else {
      user.subscription.name = name;
    }

    if (numbers.length !== 16) {
      return res.status(400).json({ message: "card numbers must be 16 " });
    }

    if (type == "advanced" || type == "professional" || type == "beginner") {
      user.subscription.type = type;
      user.subscription.price = getSubscriptionPrice(type);
    } else {
      return res.status(401).json({ message: "invalid subscription type" });
    }
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const createAdmin = async (req, res) => {
  console.log(req.body);
  const { name, password, email } = req.body;
  try {
    if (!name || !password) {
      return res.status(400).json({ error: "plase fill all fields" });
    }
    if (name.length < 3) {
      return res
        .status(400)
        .json({ error: "username must be atleast 3 chars" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "invalid email" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be atleast 6 chars" });
    }
    const user = await User.findOne({ email });

    if (user)
      return res.status(400).json({ error: "this email is already exist" });
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hash,
      rule: "admin",
    });
    generateToken(newUser._id, res, req);
    res.status(200).json({ ...newUser._doc, token: req.token });
  } catch (error) {
    console.log(`error in signup user function`);
    console.log(error.message);
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "plase fill all required fields" });
    }

    const user = await User.findOne({ email, rule: "admin" });
    if (!user) {
      return res.status(401).json({ error: "email not found" });
    }
    const Vpassword = bcrypt.compareSync(password, user.password);
    if (!Vpassword) {
      return res.status(401).json({ error: "password is incorrect" });
    }
    generateToken(user._id, res, req);
    console.log(req.token);
    res.status(200).json({ ...user._doc, token: req.token });
  } catch (error) {
    console.log(`error in login user function`);
    console.log(error.message);
  }
};

export const getAdminPageDetails = async (req, res) => {
  try {
    const totalCompalints = await Complaint.find({}).countDocuments();
    const last3Complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("user", "name");
    const last8Students = await User.find({ rule: "student" })
      .sort({ createdAt: -1 })
      .limit(8)
      .select("name email subscription");

    // 2. عدد الطلاب اللي مش Admin
    const studentCount = await User.countDocuments({ rule: "student" });

    // 3. إجمالي الربح من الاشتراكات
    const totalRevenue = await User.aggregate([
      {
        $match: { "subscription.price": { $gt: 0 } },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$subscription.price" },
        },
      },
    ]);

    return res.status(200).json({
      totalRevenue: totalRevenue[0]?.total || 0,
      studentCount,
      last8Students,
      last3Complaints,
      totalCompalints,
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email, port } = req.body;

    // التحقق من وجود البريد الإلكتروني والـ port
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    if (!port) {
      return res.status(400).json({
        message: "missing port!, please open the project with live server",
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(201).json({ message: "email not found" });
    }

    let token;

    // التحقق من وجود updateToken
    if (user.updateToken) {
      try {
        // محاولة فك التوكن للتحقق من صلاحيته
        const decoded = jwt.verify(user.updateToken, "SECRET");

        // إذا كان التوكن صالحًا (لم تنتهِ صلاحيته) ويحتوي على id
        if (decoded?.id) {
          token = user.updateToken; // استخدام نفس التوكن
        } else {
          // إذا كان هناك مشكلة في التوكن (مثل عدم وجود id)
          token = jwt.sign({ id: user._id }, "SECRET", {
            expiresIn: 1000 * 60 * 15, // 15 دقيقة
          });
        }
      } catch (error) {
        // إذا انتهت صلاحية التوكن أو كان هناك خطأ في فك التوكن
        if (error.name === "TokenExpiredError") {
          console.log("Token has expired, generating a new one.");
        } else {
          console.log("Error verifying token:", error.message);
        }
        // إنشاء توكن جديد
        token = jwt.sign({ id: user._id }, "SECRET", {
          expiresIn: 1000 * 60 * 15, // 15 دقيقة
        });
      }
    } else {
      // إذا لم يكن هناك توكن موجود، إنشاء توكن جديد
      token = jwt.sign({ id: user._id }, "SECRET", {
        expiresIn: 1000 * 60 * 15, // 15 دقيقة
      });
    }

    console.log("Generated/Used Token:", token);

    // تحديث التوكن في قاعدة البيانات
    user.updateToken = token;
    await user.save();

    // إرسال البريد الإلكتروني مع رابط التوكن
    const result = await sendForgetPassowrdMessage(
      user.email,
      `http://localhost:${port}/pages/updatePassword.html?token=${user.updateToken}?email=${user.email}`
    );

    // التحقق من نجاح إرسال البريد
    if (!result.success) {
      return res.status(500).json({
        message: "Failed to send email, please try again later",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Email has been sent, check your email",
      success: true,
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({
      message: "An error occurred, please try again later",
      success: false,
    });
  }
};

export const updatePageProtected = async (req, res) => {
  const { token, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "email not found" });
  }

  if (!token) {
    return res.status(400).json({ message: "missing token!" });
  }
  if (user.updateToken != token) {
    return res.status(400).json({ message: "invalid or expired token" });
  }

  const decoded = jwt.verify(token, "SECRET");
  if (!decoded?.id) {
    return res.status(400).json({ message: "invalid or expired token " });
  }
  res.status(200).json({ message: "valid data", success: true });
};

export const checkUpdatePassword = async (req, res) => {
  try {
    console.log(req.body);
    const { token, email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email not found" });
    }

    if (!token) {
      return res.status(400).json({ message: "missing token!" });
    }
    if (user.updateToken != token) {
      return res.status(400).json({ message: "invalid or expired token" });
    }

    const decoded = await jwt.verify(token, "SECRET");
    if (!decoded?.id) {
      return res.status(400).json({ message: "invalid or expired token " });
    }

    if (password?.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 characters" });
    }
    const hash = await bcrypt.hashSync(password, 10);

    user.password = hash;
    user.updateToken = "";
    await user.save();
    res
      .status(200)
      .json({ message: "password is updated successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};
