import express from "express"
import { protectRoute } from "../utils/protectedRoute.js"
import { checkUpdatePassword, createAdmin, deleteUser, findUser, forgetPassword, getAdminPageDetails, getAllUsers, getCurrentUser, loginAdmin, loginUser, logOut, signUpUser, subscribe, updatePageProtected, updateUser } from "../controllers/user.controller.js"
import multer from "multer" 
import path from "path"
import {dirname} from "path"
import { fileURLToPath } from "url"
import {v4 as uuidv4} from "uuid"
const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const imagePath = path.join(__dirname,"../images")
const currentDate = Date.now()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, imagePath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, uuidv4() + ext);
    }
  });
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})




router.post("/signup",signUpUser)
router.post("/login",loginUser)
router.post("/createAdmin",createAdmin)
router.post("/loginAdmin",loginAdmin)
router.post("/subscribe/:id",protectRoute,subscribe)
router.get("/",protectRoute,getAllUsers)
router.get("/me",protectRoute,getCurrentUser)
router.get("/find/:userId",findUser)





router.post("/forgetPassword",forgetPassword)
router.post('/updatePassword',checkUpdatePassword)
router.post('/updateprotect',updatePageProtected)

router.post("/uploadImage",upload.single("images"),(req,res)=>{ 
    const host  =  req.get("host")
    console.log(req.protocol,host)
     
    console.log(req.file)
    return res.status(200).json({message:"تم تحميل الصورة بنجاح",success:true})
})


router.patch("/update",protectRoute,upload.single("idImagePath"),updateUser)



router.get("/adminPageDetial",getAdminPageDetails) // for admin page
router.delete("/delete/:userId",protectRoute,deleteUser)

router.post("/logout",protectRoute,logOut)

export default router







// router.get("/me",protectRoute,getCurrentUser)