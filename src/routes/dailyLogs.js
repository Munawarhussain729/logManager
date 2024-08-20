import { Router } from "express";
import { getDailyLogs, postDailyLog } from "../controllers/dailylogsController.js";

const router  = Router()

router.get('/daily-logs', getDailyLogs);

router.post('/daily-logs', postDailyLog);

export default router