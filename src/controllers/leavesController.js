import { USER_ID } from "../../constants.js";
import dbConfig from "../dbconfig.js";
import { createNewLeave, createNewLog, fetchAllLeaves, fetchAllLogs, fetchAllProjects, fetchAllRoles } from "../utils/helperFunction.js";
import pg from "pg"

const { Pool } = pg
const pool = new Pool(dbConfig)

export const getAllLeaves = async (req, res) => {
    try {
        const allLeaves = await fetchAllLeaves()
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

export const postLeaves = async (req, res) => {
    try {
        const { userId, subject, body, startDate, endDate, createdOn, status } = req.body
        await createNewLeave({ userId, subject, body, startDate, endDate })
        const allLeaves = await fetchAllLeaves()
        console.log("all leaves ", allLeaves);
        
        res.json(allLeaves);
    } catch (error) {
        console.error('Daily leave post error ', error)
        res.status(500).send('Internal Server Error')
    }
}
