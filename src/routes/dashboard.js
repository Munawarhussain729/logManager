import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { getDailyLogs, postDailyLog } from "../controllers/dailylogsController.js";

const router = Router();

const tempLogData = [
    {
        created_on: '2024-08-18T07:10:35.984Z',
        message: 'Update the ticketing',
        blocker: 'No blocker.',
        duration: 5,
        tomorrow_plan: 'will be working on urgent tickets',
        id: 4,
        project_id: 1,
        user_id: 2,
        user_role: 3
    },
    {
        created_on: '2024-08-18T07:10:35.984Z',
        message: 'integrate add vheicle api',
        blocker: 'backend needs to update api according to requirement',
        duration: 3,
        tomorrow_plan: 'Will start working on inspect screen',
        id: 3,
        project_id: 2,
        user_id: 3,
        user_role: 2
      }
]

router.get('/',getDashboard);

export default router;
