import dbConfig from "../dbconfig.js";
import { createNewLog, fetchAllLogs, fetchAllProjects, fetchAllRoles } from "../utils/helperFunction.js";
import pg from "pg"

const {Pool } = pg
const pool = new Pool(dbConfig)

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
                roles: allRoles,
                loggedInUserId: 1
            });
    } catch (error) {
        console.error('Daily loog error ', error)
        res.status(500).send('Internal server error');
    }

}

export const postDailyLog = async (req, res) => {
    try {
        const { created_on, message, blocker, duration, tomorrows_plan, project, user_id, user_role } = req.body
        createNewLog({ created_on, message, blocker, duration, tomorrows_plan, project, user_id, user_role })
        const allLogs = await fetchAllLogs()
        const allProjects = await fetchAllProjects()
        const allRoles = await fetchAllRoles()
        res.render('layouts/main',
            {
                title: 'Daily Logs',
                contentFile: '../dailyLogs/dailyLogs',
                logs: allLogs,
                projects: allProjects,
                roles: allRoles,
                loggedInUserId: 1
            });
    } catch (error) {
        console.error('Daily logs post error ', error)
        res.status(500).send('Internal Server Error')
    }
}

export const getLogDetail = async (req, res) => {
    try {
        let client
        const logId = req.params?.id
        console.log('Log id ', logId)
        if(!logId){
            res.statusCode(400).send('Log id not found')
            return
        }
        client = await pool.connect()
        const query =  `SELECT * FROM logs WHERE id = ${logId}`
        const results = await client.query(query)
        console.log("Results ", results.rows)
        if(results.rows?.length >0){
            res.status(200).send(results.rows[0])
            return
        }
        res.status(400).send('Log id not found')
        return
    } catch (error) {
        console.error('Log detail get error ', error)
        res.status(500).send("Internal server error")
    }
}