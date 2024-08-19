import { Router } from "express";

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
router.get('/', (req, res) => {
    res.render('layouts/main', { title: 'Dashboard', contentFile: '../dashboard/dashboard' });
});

router.get('/dashboard', (req, res) => {
    res.render('layouts/main', { title: 'Dashboard', contentFile: '../dashboard/dashboard' });
});

router.get('/daily-logs', (req, res) => {
    console.log("Request object ", req);
    
    res.render('layouts/main', { title: 'Daily Logs',  contentFile: '../dailyLogs/dailyLogs', logs:tempLogData });
});

router.post('/daily-logs', (req, res) => {
    console.log("Request object ", req.body);
    res.render('layouts/main', { title: 'Daily Logs',  contentFile: '../dailyLogs/dailyLogs'  });
    // res.render('layouts/main', { title: 'Daily Logs',  contentFile: '../dailyLogs/dailyLogs'  });
});

export default router;
