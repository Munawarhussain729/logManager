import { USER_ID } from "../../constants.js";
import dbConfig from "../dbconfig.js";
import { createNewLog, fetchAllLeaves, fetchAllLogs, fetchAllProjects, fetchAllRoles } from "../utils/helperFunction.js";
import pg from "pg"

const { Pool } = pg
const pool = new Pool(dbConfig)

export const getAllLeaves = async (req, res) => {
    try {
        const allLeaves = await fetchAllLeaves()
        const allProjects = await fetchAllProjects()
        const allRoles = await fetchAllRoles()
        res.render('layouts/main',
            {
                title: 'Leaves',
                contentFile: '../leaves/leaves',
                leaves: allLeaves,
                projects: allProjects,
                showSidebar: true,
                roles: allRoles,
                loggedInUserId: USER_ID
            });
    } catch (error) {
        console.error('Daily loog error ', error)
        res.status(500).send('Internal server error');
    }

}
