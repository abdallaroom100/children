import express from "express"
import { addCompound, deleteCompound, getAllCompounds, getCurrentCompound, updateCompound } from "../controllers/compound.controller.js"
import { protectRoute } from "../utils/protectedRoute.js"

const router = express.Router()
// compound/
router.get("/",getAllCompounds)
router.get("/find/:id",getCurrentCompound)
router.post("/add",protectRoute,addCompound)
router.patch("/update/:id",protectRoute,updateCompound)
router.delete("/delete/:id",protectRoute,deleteCompound)

export default router