import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getAllWorkFromHome, postWorkFromHome } from "../controllers/workFromHomeController.js";


const router = Router()

router.get("/", authenticate, getAllWorkFromHome)
router.post("/", authenticate, postWorkFromHome)

export default router