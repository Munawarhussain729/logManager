import dbConfig from "../dbconfig.js";
import pg from "pg"
import { createNewWorkFromHome, fetchAllWorkFromHome } from "../utils/helperFunction.js";
import { USER_ID } from "../../constants.js";

const { Pool } = pg
const pool = new Pool(dbConfig)

export const getAllWorkFromHome = async (req, res) => {
    try {
        const allLeaves = await fetchAllWorkFromHome()
        res.render('layouts/main',
            {
                title: 'Work From Home',
                contentFile: '../workFromHome/workFromHome',
                leaves: allLeaves,
                showSidebar: true,
                loggedInUserId: USER_ID
            });
    } catch (error) {
        console.error('Daily loog error ', error)
        res.status(500).send('Internal server error');
    }

}
export const postWorkFromHome = async (req, res) => {
    try {
        const { userId, subject, body, startDate, endDate, createdOn, status } = req.body
        await createNewWorkFromHome({ userId, subject, body, startDate, endDate })
        const allLeaves = await fetchAllWorkFromHome()
        res.json(allLeaves);
    } catch (error) {
        console.error('Daily loog error ', error)
        res.status(500).send('Internal server error');
    }

}

export const getLeave = async (req, res) => {
    let client
    try {
        const leaveId = req.params?.id
        if (!leaveId) {
            res.statusCode(400).send("Leave id is missing")
        }
        client = await pool.connect()
        const query = `SELECT * FROM work_from_home WHERE id = ${leaveId}`
        const results = await client.query(query)
        if (results.rows?.length > 0) {
            res.status(200).send(results.rows[0])
            return
        }
        res.status(400).send("Leave does not exists")
    } catch (error) {
        console.error('Leave get error ', error)
        res.status(500).send('Internal Server Error')
    } finally {
        if (client) {
            client.release();
        }
    }
}