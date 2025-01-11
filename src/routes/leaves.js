import { Router } from "express";
import { getDailyLogs, getLogDetail, postDailyLog, updateDailyLog } from "../controllers/dailylogsController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getAllLeaves, postLeaves } from "../controllers/leavesController.js";

const router = Router()

router.get('/', authenticate, getAllLeaves);
router.post('/', authenticate, postLeaves);
// router.get('/daily-logs/:id', authenticate, getLogDetail)
// router.patch('/daily-logs', authenticate, updateDailyLog);

export default router