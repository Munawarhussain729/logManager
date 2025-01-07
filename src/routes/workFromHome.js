import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getAllWorkFromHome } from "../controllers/workFromHomeController.js";


const router = Router()

router.get("/", authenticate, getAllWorkFromHome)

export default router