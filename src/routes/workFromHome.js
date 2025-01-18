import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { deleteWorkFromHome, getAllWorkFromHome, getLeave, postWorkFromHome, updateWorkFromHome } from "../controllers/workFromHomeController.js";
import { updateLeave } from "../controllers/leavesController.js";


const router = Router()

router.get("/", authenticate, getAllWorkFromHome)
router.post("/", authenticate, postWorkFromHome)
router.get('/:id', authenticate, getLeave)
router.delete('/:id', authenticate, deleteWorkFromHome)
router.patch('/', authenticate, updateWorkFromHome);

export default router