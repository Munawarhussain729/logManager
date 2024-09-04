import dbConfig from "../dbconfig.js";
import { createNewLog, fetchAllLogs, fetchAllProjects, fetchAllRoles } from "../utils/helperFunction.js";
import pg from "pg"

const { Pool } = pg
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
    let client
    try {
        const logId = req.params?.id
        console.log('Log id ', logId)
        if (!logId) {
            res.statusCode(400).send('Log id not found')
            return
        }
        client = await pool.connect()
        const query = `SELECT * FROM logs WHERE id = ${logId}`
        const results = await client.query(query)
        console.log("Results ", results.rows)
        if (results.rows?.length > 0) {
            res.status(200).send(results.rows[0])
            return
        }
        res.status(400).send('Log id not found')
        return
    } catch (error) {
        console.error('Log detail get error ', error)
        res.status(500).send("Internal server error")
    } finally {
        if (client) {
            client.release()
        }
    }
}
export const updateDailyLog = async (req, res) => {
    let client;
    try {
        const { id, created_on, message, blocker, duration, tomorrows_plan, project, user_id, user_role } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Log ID is required' }); // Send a JSON response
        }

        client = await pool.connect();

        console.log("Id is ", id);

        const query = `
            UPDATE logs
            SET created_on = $1,
                message = $2,
                blocker = $3,
                duration = $4,
                tomorrow_plan = $5,
                project_id = $6,
                user_id = $7,
                user_role = $8
            WHERE id = $9
            RETURNING *`; // This will return the updated row

        const values = [created_on, message, blocker, duration, tomorrows_plan, project, user_id, user_role, id];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Log not found' }); // Send a JSON response
        }

        console.log('Update result', result.rows[0]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log('Log update error', error);
        res.status(500).json({ error: 'Internal server error' }); // Send a JSON response
    } finally {
        if (client) {
            client.release();
        }
    }
};
