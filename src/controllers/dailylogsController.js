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
            fetchAllLogs({ user_id: user.id }),
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
    let logs = [];

    try {
        const user = validateUserSession(req, res);
        if (!user) return;
        const { created_on, message, blocker, duration, tomorrows_plan, project, user_role } = req.body;
        if (!created_on) {
            throw { status: 400, message: "Creation date is required" };
        }
        if (duration !== undefined && Number.isNaN(Number(duration))) {
            throw { status: 400, message: "Duration must be a valid number" };
        }
        await createNewLog({
            created_on,
            message: message || null,
            blocker: blocker || null,
            duration: duration ? Number.parseInt(duration, 10) : null,
            tomorrows_plan: tomorrows_plan || null,
            project: project || null,
            user_id: user.id,
            user_role: user_role || null
        });
        logs = await fetchAllLogs({ user_id: user.id });
        return res.json(logs);
    } catch (error) {
        console.error("Error creating daily log:", error);
        try {
            if (!logs.length) {
                logs = await fetchAllLogs({ user_id: req?.user?.id });
            }
        } catch (fetchError) {
            console.error("Error fetching logs after failure:", fetchError);
        }
        res.status(error?.status || 500).json({
            error: error?.message || "Internal server error",
            logs: logs || []
        });
    }
};

export const deleteDailyLog = async (req, res) => {
    let client;
    let logs = [];
    try {
        const user = validateUserSession(req, res);
        if (!user) return;
        const logId = req.params?.id;
        if (!logId) {
            throw { status: 400, message: 'Log ID is required' };
        }
        client = await pool.connect();
        const query = 'DELETE FROM logs WHERE id = $1 AND user_id = $2';
        const result = await client.query(query, [logId, user.id]);
        if (result.rowCount === 0) {
            throw { status: 404, message: 'Log not found or deletion failed' };
        }
        logs = await fetchAllLogs({ user_id: user.id });
        return res.json(logs);
    } catch (error) {
        console.error('Error deleting daily log:', error);
        try {
            if (!logs.length) {
                logs = await fetchAllLogs({ user_id: req?.user?.id });
            }
        } catch (fetchError) {
            console.error('Error fetching logs after failure:', fetchError);
        }
        res.status(error?.status || 500).json({
            error: error?.message || 'Internal server error',
            logs: logs || []
        });
    } finally {
        if (client) client.release();
    }
};


// Controller to fetch a single log detail
export const getLogDetail = async (req, res) => {
    let client;
    let logs = [];

    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const logId = req.params?.id;
        if (!logId) {
            throw { status: 400, message: 'Log ID is required' };
        }

        client = await pool.connect();

        const query = "SELECT * FROM logs WHERE id = $1 AND user_id = $2";
        const result = await client.query(query, [logId, user.id]);

        if (result.rows?.length === 0) {
            throw { status: 404, message: 'Log not found' };
        }

        logs = await fetchAllLogs({ user_id: user.id });
        return res.status(200).json({ log: result.rows[0], logs });
    } catch (error) {
        console.error('Error fetching log details:', error);
        try {
            if (!logs.length) {
                logs = await fetchAllLogs({ user_id: req?.user?.id });
            }
        } catch (fetchError) {
            console.error('Error fetching logs after failure:', fetchError);
        }
        res.status(error?.status || 500).json({
            error: error?.message || 'Internal server error',
            logs: logs || []
        });
    } finally {
        if (client) client.release();
    }
};

// Controller to update a daily log
export const updateDailyLog = async (req, res) => {
    let client;
    let logs = []
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const { id, message, blocker, duration, tomorrows_plan, project, user_role } = req.body;

        if (!id) {
            throw { status: 400, message: "Valid Log Id is required" }
        }
        if (duration !== undefined && Number.isNaN(Number(duration))) {
            throw { status: 400, message: "Duration must be a valid number" }
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
            message || "",
            blocker || "",
            duration || 0,
            tomorrows_plan || "",
            project || null,
            user.id,
            user_role || null,
            id
        ];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            throw { status: 404, message: "Log not found" }
        }

        logs = await fetchAllLogs({ user_id: user.id });
        res.json(logs);
    } catch (error) {
        console.error('Error updating daily log:', error);
        try {
            if (!logs.length) {
                logs = await fetchAllLogs({ user_id: user.id })
            }
        } catch (fetchError) {
            console.error("Error while fetching logs after failure ", fetchError)
        }
        res.status(error?.status || 500).json({
            error: error?.message || "Internal server error",
            logs: logs || []
        })
    } finally {
        if (client) client.release();
    }
};
