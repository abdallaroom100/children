import express from "express"
import {  createComplaint, getAllComplaints } from "../controllers/apartment.controller.js"
import { protectRoute } from "../utils/protectedRoute.js"

const router = express.Router()


router.get("/",getAllComplaints)
router.post("/:userId",protectRoute,createComplaint)


export default router 