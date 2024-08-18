import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.render('layouts/main', { title: 'Dashboard', contentFile: '../dashboard/dashboard' });
});

router.get('/dashboard', (req, res) => {
    res.render('layouts/main', { title: 'Dashboard', contentFile: '../dashboard/dashboard' });
});

router.get('/daily-logs', (req, res) => {
    console.log("Request object ", req);
    
    res.render('layouts/main', { title: 'Daily Logs',  contentFile: '../dailyLogs/dailyLogs'  });
});

router.post('/daily-logs', (req, res) => {
    console.log("Request object ", req.body);
    res.render('layouts/main', { title: 'Daily Logs',  contentFile: '../dailyLogs/dailyLogs'  });
    // res.render('layouts/main', { title: 'Daily Logs',  contentFile: '../dailyLogs/dailyLogs'  });
});

export default router;
