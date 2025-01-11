import { Router } from "express";
import { deleteDailyLog, getDailyLogs, getLogDetail, postDailyLog, updateDailyLog } from "../controllers/dailylogsController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router()

router.get('/daily-logs', authenticate, getDailyLogs);
router.get('/daily-logs/:id', authenticate, getLogDetail)
router.post('/daily-logs', authenticate, postDailyLog);
router.patch('/daily-logs/:id', authenticate, updateDailyLog);
router.delete('/daily-logs/:id', authenticate, deleteDailyLog);

export default router