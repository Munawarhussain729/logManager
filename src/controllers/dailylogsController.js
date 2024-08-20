import { fetchAllLogs } from "../utils/helperFunction.js";

export const getDailyLogs = async (req, res) => {
    try {
        const allLogs = await fetchAllLogs()
        res.render('layouts/main', { title: 'Daily Logs', contentFile: '../dailyLogs/dailyLogs', logs: allLogs });
    } catch (error) {
        console.error('Daily loog error ', error)
        res.status(500).send('Internal server error');
    }
   
}

export const postDailyLog = (req, res) => {
    res.render('layouts/main', { title: 'Daily Logs', contentFile: '../dailyLogs/dailyLogs' });
}