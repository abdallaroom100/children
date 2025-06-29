import express from "express"
import { protectRoute } from "../utils/protectedRoute.js"
import { checkUpdatePassword, createAdmin, deleteUser, findUser, forgetPassword, getAdminPageDetails, getAllUsers, getCurrentUser, loginAdmin, loginUser, logOut, signUpUser, subscribe, testUpdate, updatePageProtected, updateUser } from "../controllers/user.controller.js"
import multer from "multer" 
import path from "path"
import {dirname} from "path"
import { fileURLToPath } from "url"
import {v4 as uuidv4} from "uuid"
import fs from "fs/promises";






const router = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const baseUploadPath = path.join(__dirname, "../uploads");

// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
  // Check if req.user._id is available
  if (!req?.userId) {
    return cb(new Error("User ID is missing. Authentication required."), false);
  }
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, PNG) and PDFs are allowed"), false);
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.userId.toString(); // Must be defined due to fileFilter
    let subFolder = "";

    // Determine subfolder based on fieldname
    if (file.fieldname === "idImagePath") {
      subFolder = "identity";
    } else if (file.fieldname === "familyCardFile") {
      subFolder = "familyCard";
    } else if (file.fieldname === "ibanImage") {
      subFolder = "iban";
    } else if (file.fieldname === "rentContractFile") {
      subFolder = "rent";
    } else if (file.fieldname.startsWith("incomeSources[")) {
      subFolder = "incomeSources";
      const match = file.fieldname.match(/incomeSources\[(\d+)\]\[sourceImage\]/);
      if (match) {
        const index = parseInt(match[1]);
        let incomeSourcesArr = [];
        if (typeof req.body.incomeSources === 'string') {
          try {
            incomeSourcesArr = JSON.parse(req.body.incomeSources);
          } catch (e) {
            incomeSourcesArr = [];
          }
        } else if (typeof req.body.incomeSources === 'object' && req.body.incomeSources !== null) {
          // جرب تقرأ من المفتاح الفاضي
          if (req.body.incomeSources['']) {
            try {
              incomeSourcesArr = JSON.parse(req.body.incomeSources['']);
            } catch (e) {
              incomeSourcesArr = [];
            }
          } else {
            incomeSourcesArr = Object.values(req.body.incomeSources);
          }
        }
        const sourceType = incomeSourcesArr[index]?.sourceType;
        console.log('incomeSourcesArr:', incomeSourcesArr);
        console.log('index:', index, 'sourceType:', sourceType);
        subFolder = path.join(subFolder, sourceType || "unknownSource");
      }
    }

    const destination = path.join(baseUploadPath, userId, subFolder);

    try {
      // Create directory if it doesn't exist
      await fs.mkdir(destination, { recursive: true });
      // Delete existing files in the folder to ensure only one file
      const existingFiles = await fs.readdir(destination);
      for (const existingFile of existingFiles) {
        await fs.unlink(path.join(destination, existingFile));
      }
      cb(null, destination);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: "idImagePath", maxCount: 1 },
  { name: "familyCardFile", maxCount: 1 },
  { name: "ibanImage", maxCount: 1 },
  { name: "rentContractFile", maxCount: 1 },
  { name: "incomeSources[0][sourceImage]", maxCount: 1 },
  { name: "incomeSources[1][sourceImage]", maxCount: 1 },
  { name: "incomeSources[2][sourceImage]", maxCount: 1 },
  { name: "incomeSources[3][sourceImage]", maxCount: 1 },
]);

router.patch("/testupdate",protectRoute,upload,testUpdate)

router.post("/signup",signUpUser)
router.post("/login",loginUser)

router.post("/createAdmin",createAdmin)
router.post("/loginAdmin",loginAdmin)
router.post("/subscribe/:id",protectRoute,subscribe)
router.get("/",getAllUsers)
router.get("/me",protectRoute,getCurrentUser)
router.get("/find/:userId",findUser)


 

 
router.post("/forgetPassword",forgetPassword)
router.post('/updatePassword',checkUpdatePassword)
router.post('/updateprotect',updatePageProtected)

// router.post("/uploadImage",upload.single("images"),(req,res)=>{ 
//     const host  =  req.get("host")
//     console.log(req.protocol,host)
     
//     console.log(req.file)
//     return res.status(200).json({message:"تم تحميل الصورة بنجاح",success:true})
// })


// router.patch("/update",protectRoute,upload.single("idImagePath"),updateUser)

 

router.get("/adminPageDetial",getAdminPageDetails) // for admin page
router.delete("/delete/:userId",protectRoute,deleteUser)

router.post("/logout",protectRoute,logOut)

export default router

  
   




// router.get("/me",protectRoute,getCurrentUser)