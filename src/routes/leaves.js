import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getAllLeaves, getLeave, postLeaves } from "../controllers/leavesController.js";

const router = Router()

router.get('/', authenticate, getAllLeaves);
router.post('/', authenticate, postLeaves);
router.get('/:id', authenticate, getLeave)
// router.patch('/daily-logs', authenticate, updateDailyLog);

export default router