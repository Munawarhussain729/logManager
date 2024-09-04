import { Router } from "express";
import { getDailyLogs, getLogDetail, postDailyLog } from "../controllers/dailylogsController.js";

const router  = Router()

router.get('/daily-logs', getDailyLogs);
router.get('/daily-logs/:id', getLogDetail)

router.post('/daily-logs', postDailyLog);

export default router