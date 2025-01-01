import { Router } from "express";
import { getDailyLogs, getLogDetail, postDailyLog, updateDailyLog } from "../controllers/dailylogsController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getAllLeaves } from "../controllers/leavesController.js";

const router = Router()

router.get('/leaves', authenticate, getAllLeaves);
// router.get('/daily-logs/:id', authenticate, getLogDetail)
// router.post('/daily-logs', authenticate, postDailyLog);
// router.patch('/daily-logs', authenticate, updateDailyLog);

export default router