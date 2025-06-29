import express from "express"
import {  createComplaint, getAllComplaints } from "../controllers/complaint.controller.js"
import { protectRoute } from "../utils/protectedRoute.js"
import multer from "multer"
import {dirname} from "path"
import path from "path"
import { fileURLToPath } from "url"


const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const imagePath = path.join(__dirname,"../images")


 const storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null,imagePath)
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname)
        cb(null,uuidv4()+ext)
    }
 })

 const fileUpload = multer({storage ,
    limits:{
        fileSize:10*1024*1024
    }

 })
 const upload = multer({storage})
router.get("/",getAllComplaints) // for admin page
router.post("/:userId",createComplaint)


export default router 

