import { Router } from "express";

const router = Router()

router.get('/', (req, res) => {
    res.render('layouts/main', { title: 'Dashboard' })
})

router.get('/daily-logs', (req, res) => {
    res.render('dailyLogs/dailyLogs', { title: 'Daily Logs' })
})

export default router