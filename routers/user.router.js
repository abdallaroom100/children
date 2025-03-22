import express from "express"
import { protectRoute } from "../utils/protectedRoute.js"
import { checkUpdatePassword, createAdmin, deleteUser, forgetPassword, getAdminPageDetails, getAllUsers, getCurrentUser, loginAdmin, loginUser, logOut, signUpUser, subscribe, updatePageProtected, updateUser } from "../controllers/user.controller.js"

const router = express.Router()


router.post("/signup",signUpUser)
router.post("/login",loginUser)
router.post("/createAdmin",createAdmin)
router.post("/loginAdmin",loginAdmin)
router.post("/subscribe/:id",protectRoute,subscribe)
router.get("/",protectRoute,getAllUsers)
router.post("/forgetPassword",forgetPassword)
router.post('/updatePassword',checkUpdatePassword)
router.post('/updateprotect',updatePageProtected)
router.patch("/update/:userId",protectRoute,updateUser)
router.get("/adminPageDetial",protectRoute,getAdminPageDetails) // for admin page
router.delete("/delete/:userId",protectRoute,deleteUser)

router.post("/logout",protectRoute,logOut)

export default router







// router.get("/me",protectRoute,getCurrentUser)