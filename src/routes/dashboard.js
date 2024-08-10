import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.render('layouts/main', { title: 'Dashboard', contentFile: '../dashboard/dashboard' });
});

router.get('/dashboard', (req, res) => {
    res.render('layouts/main', { title: 'Dashboard', contentFile: '../dashboard/dashboard' });
});

router.get('/daily-logs', (req, res) => {
    res.render('layouts/main', { title: 'Daily Logs',  contentFile: '../dailyLogs/dailyLogs'  });
});

export default router;
