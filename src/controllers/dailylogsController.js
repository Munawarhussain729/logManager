import { USER_ID } from "../../constants.js";
import dbConfig from "../dbconfig.js";
import { createNewLog, fetchAllLogs, fetchAllProjects, fetchAllRoles } from "../utils/helperFunction.js";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool(dbConfig);

// Utility to handle session validation
const validateUserSession = (req, res) => {
    const { user } = req.session;
    if (!user?.id) {
        res.status(404).send('No user found. Please login again');
        return null;
    }
    return user;
};

// Controller to fetch daily logs
export const getDailyLogs = async (req, res) => {
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const [allLogs, allProjects, allRoles] = await Promise.all([
            fetchAllLogs(),
            fetchAllProjects(),
            fetchAllRoles()
        ]);

        res.render('layouts/main', {
            title: 'Daily Logs',
            contentFile: '../dailyLogs/dailyLogs',
            logs: allLogs,
            projects: allProjects,
            showSidebar: true,
            roles: allRoles,
            loggedInUserId: user.id
        });
    } catch (error) {
        console.error('Error fetching daily logs:', error);
        res.status(500).send('Internal server error');
    }
};

// Controller to create a new daily log
export const postDailyLog = async (req, res) => {
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const { created_on, message, blocker, duration, tomorrows_plan, project, user_role } = req.body;

        await createNewLog({
            created_on,
            message,
            blocker,
            duration,
            tomorrows_plan,
            project,
            user_id: user.id,
            user_role
        });

        const allLogs = await fetchAllLogs();
        res.json(allLogs);
    } catch (error) {
        console.error('Error creating daily log:', error);
        res.status(500).send('Internal server error');
    }
};

// Controller to delete a daily log
export const deleteDailyLog = async (req, res) => {
    let client;
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const logId = req.params?.id;
        if (!logId) {
            return res.status(400).send('Log ID is required');
        }

        client = await pool.connect();

        const query = `DELETE FROM logs WHERE id = $1 AND user_id = $2`;
        const result = await client.query(query, [logId, user.id]);

        if (result.rowCount > 0) {
            const allLogs = await fetchAllLogs();
            res.json(allLogs);
        } else {
            res.status(404).json({ error: 'Log not found or deletion failed' });
        }
    } catch (error) {
        console.error('Error deleting daily log:', error);
        res.status(500).send('Internal server error');
    } finally {
        if (client) client.release();
    }
};

// Controller to fetch a single log detail
export const getLogDetail = async (req, res) => {
    let client;
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const logId = req.params?.id;
        if (!logId) {
            return res.status(400).send('Log ID is required');
        }

        client = await pool.connect();

        const query = `SELECT * FROM logs WHERE id = $1 AND user_id = $2`;
        const result = await client.query(query, [logId, user.id]);

        if (result.rows?.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Log not found');
        }
    } catch (error) {
        console.error('Error fetching log details:', error);
        res.status(500).send('Internal server error');
    } finally {
        if (client) client.release();
    }
};

// Controller to update a daily log
export const updateDailyLog = async (req, res) => {
    let client;
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const { id, message, blocker, duration, tomorrows_plan, project, user_role } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Log ID is required' });
        }

        client = await pool.connect();

        const query = `
            UPDATE logs
            SET message = $1,
                blocker = $2,
                duration = $3,
                tomorrow_plan = $4,
                project_id = $5,
                user_id = $6,
                user_role = $7
            WHERE id = $8
            RETURNING *`;

        const values = [
            message,
            blocker,
            duration,
            tomorrows_plan,
            project,
            user.id,
            user_role,
            id
        ];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Log not found' });
        }

        const allLogs = await fetchAllLogs();
        res.json(allLogs);
    } catch (error) {
        console.error('Error updating daily log:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (client) client.release();
    }
};
