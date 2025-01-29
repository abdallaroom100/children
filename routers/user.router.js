import express from "express"
import { protectRoute } from "../utils/protectedRoute.js"
import { deleteUser, getAllUsers, getCurrentUser, loginUser, logOut, signUpUser, updateUser } from "../controllers/user.controller.js"


const router = express.Router()


router.get("/me",protectRoute,getCurrentUser)
router.get("/",getAllUsers)
router.post("/signup",signUpUser)
router.post("/login",loginUser)
router.patch("/update/:userId",protectRoute,updateUser)
router.delete("/delete/:userId",protectRoute,deleteUser)
router.post("/logout",protectRoute,logOut)

export default router