import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getAllLeaves, getLeave, postLeave, updateLeave } from "../controllers/leavesController.js";

const router = Router()

router.get('/', authenticate, getAllLeaves);
router.post('/', authenticate, postLeave);
router.get('/:id', authenticate, getLeave)
router.patch('/', authenticate, updateLeave);

export default router