import express from "express"
import { addApartment, deleteApartment, getAllApartments, getAllCompoundApartment, getCurrentApartment, updateApartment } from "../controllers/apartment.controller.js"
import { protectRoute } from "../utils/protectedRoute.js"

const router = express.Router()


router.get("/",getAllApartments)
router.get("/:compoundId",getAllCompoundApartment)
router.get("/find/:id",getCurrentApartment)
router.post("/add/:compoundId",protectRoute,addApartment)
router.patch("/update/:compoundId",protectRoute,updateApartment)
router.delete("/delete/:apartmentId",protectRoute,deleteApartment)

export default router 