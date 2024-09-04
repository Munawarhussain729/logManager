import { Router } from "express";
import { getDailyLogs, getLogDetail, postDailyLog, updateDailyLog } from "../controllers/dailylogsController.js";

const router  = Router()

router.get('/daily-logs', getDailyLogs);
router.get('/daily-logs/:id', getLogDetail)
router.post('/daily-logs', postDailyLog);
router.patch('/daily-logs', updateDailyLog);

export default router