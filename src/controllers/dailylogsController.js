import { fetchAllLogs, fetchAllProjects, fetchAllRoles } from "../utils/helperFunction.js";

export const getDailyLogs = async (req, res) => {
    try {
        const allLogs = await fetchAllLogs()
        const allProjects = await fetchAllProjects()
        const allRoles = await fetchAllRoles()

        res.render('layouts/main',
            {
                title: 'Daily Logs',
                contentFile: '../dailyLogs/dailyLogs',
                logs: allLogs,
                projects: allProjects,
                roles: allRoles
            });
    } catch (error) {
        console.error('Daily loog error ', error)
        res.status(500).send('Internal server error');
    }

}

export const postDailyLog = async (req, res) => {
    try {
        console.log("Request body is ", req.body);
        const { date, project, role, hours } = req.body
        const allLogs = await fetchAllLogs()
        const allProjects = await fetchAllProjects()
        const allRoles = await fetchAllRoles()

        res.render('layouts/main',
            {
                title: 'Daily Logs',
                contentFile: '../dailyLogs/dailyLogs',
                logs: allLogs,
                projects: allProjects,
                roles: allRoles
            });
    } catch (error) {
        console.error('Daily logs post error ', error)
        res.status(500).send('Internal Server Error')
    }
}