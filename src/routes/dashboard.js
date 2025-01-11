import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { getDailyLogs, postDailyLog } from "../controllers/dailylogsController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/', authenticate, getDashboard);

export default router;
