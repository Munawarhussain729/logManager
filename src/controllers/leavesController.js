import { USER_ID } from "../../constants.js";
import dbConfig from "../dbconfig.js";
import { createNewLeave, createNewLog, fetchAllLeaves, fetchAllLogs, fetchAllProjects, fetchAllRoles } from "../utils/helperFunction.js";
import pg from "pg"

const { Pool } = pg
const pool = new Pool(dbConfig)

export const getAllLeaves = async (req, res) => {
    try {
        const allLeaves = await fetchAllLeaves()
        console.log("all leaves ", allLeaves);
        
        res.render('layouts/main',
            {
                title: 'Leaves',
                contentFile: '../leaves/leaves',
                leaves: allLeaves,
                showSidebar: true,
                loggedInUserId: USER_ID
            });
    } catch (error) {
        console.error('Daily loog error ', error)
        res.status(500).send('Internal server error');
    }

}

export const postLeave = async (req, res) => {
    try {
        const { userId, subject, body, startDate, endDate, createdOn, status } = req.body
        await createNewLeave({ userId, subject, body, startDate, endDate })
        const allLeaves = await fetchAllLeaves()
        res.json(allLeaves);
    } catch (error) {
        console.error('Daily leave post error ', error)
        res.status(500).send('Internal Server Error')
    }
}

export const updateLeave = async (req, res) => {
    let client;
    try {
        const { id, userId, subject, body, startDate, endDate, createdOn, status } = req.body
        if (!id) {
            return res.status(400).send("leave ID is requried")
        }
        const query = `UPDATE leaves SET user_id =$1, 
        subject = $2,
        body = $3,
        "startDate" = $4,
        "endDate" = $5
        WHERE id = $6
        RETURNING *`
        const values = [userId, subject, body, startDate, endDate, id]
        client = await pool.connect()
        const result = await client.query(query, values)

        if (result.rowCount === 0) {
            return res.status(400).send("leave does not updated.")
        }
        const allLeaves = await fetchAllLeaves()
        res.json(allLeaves)
    } catch (error) {
        console.error('Daily leave post error ', error)
        res.status(500).send('Internal Server Error')
    } finally {
        if (client) {
            client.release();
        }
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
        const query = `SELECT * FROM Leaves WHERE id = ${leaveId}`
        const results = await client.query(query)
        if (result.rows?.length > 0) {
            res.status(200).send(result.rows[0])
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
