import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { getDailyLogs, postDailyLog } from "../controllers/dailylogsController.js";

const router = Router();

router.get('/',getDashboard);

export default router;
