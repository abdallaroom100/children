import express from "express"
import {  createComplaint, getAllComplaints } from "../controllers/complaint.controller.js"
import { protectRoute } from "../utils/protectedRoute.js"

const router = express.Router()


router.get("/",getAllComplaints) // for admin page
router.post("/:userId",createComplaint)


export default router 

