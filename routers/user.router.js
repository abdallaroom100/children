import express from "express"
import { protectRoute } from "../utils/protectedRoute.js"
import { createAdmin, deleteUser, getAdminPageDetails, getAllUsers, getCurrentUser, loginAdmin, loginUser, logOut, signUpUser, subscribe, updateUser } from "../controllers/user.controller.js"


const router = express.Router()


router.get("/me",protectRoute,getCurrentUser)
router.get("/",getAllUsers)
router.post("/signup",signUpUser)
router.post("/login",loginUser)
router.patch("/update/:userId",protectRoute,updateUser)
router.post("/subscribe/:id",subscribe)
router.post("/loginAdmin",loginAdmin)
router.post("/createAdmin",createAdmin)
router.get("/adminPageDetial",getAdminPageDetails)
router.delete("/delete/:userId",protectRoute,deleteUser)
router.post("/logout",protectRoute,logOut)

export default router