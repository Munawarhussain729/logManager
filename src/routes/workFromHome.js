import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getAllWorkFromHome, getLeave, postWorkFromHome } from "../controllers/workFromHomeController.js";


const router = Router()

router.get("/", authenticate, getAllWorkFromHome)
router.post("/", authenticate, postWorkFromHome)
router.get('/:id', authenticate, getLeave)
router.delete('/:id', authenticate, deleteLeave)
router.patch('/', authenticate, updateLeave);

export default router