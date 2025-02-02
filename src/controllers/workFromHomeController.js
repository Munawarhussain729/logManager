import dbConfig from "../dbconfig.js";
import pg from "pg"
import { createNewWorkFromHome, fetchAllWorkFromHome } from "../utils/helperFunction.js";
import { USER_ID } from "../../constants.js";

const { Pool } = pg
const pool = new Pool(dbConfig)

const validateUserSession = (req, res) => {
    const { user } = req.session;
    if (!user?.id) {
        res.status(401).send('Unauthorized: Please log in again.');
        return null;
    }
    return user;
};

const handleError = async (error, res, userId) => {
    console.error('Error:', error);

    let workFromHome = [];
    try {
        if (userId) {
            workFromHome = await fetchAllWorkFromHome({ user_id: userId });
        }
    } catch (fetchError) {
        console.error('Error fetching work from home after failure:', fetchError);
    }

    res.status(error?.status || 500).json({
        error: error?.message || 'Internal Server Error',
        leaves: workFromHome || []
    });
};


export const getAllWorkFromHome = async (req, res) => {
    try {
        const user = validateUserSession(req, res);
        if (!user) return;
        const workFromHome = await fetchAllWorkFromHome({ user_id: user.id })
        res.render('layouts/main',
            {
                title: 'Work From Home',
                contentFile: '../workFromHome/workFromHome',
                leaves: workFromHome,
                showSidebar: true,
                loggedInUserId: user.id
            });
    } catch (error) {
        handleError(error, res, req?.session?.user?.id);
    }

}
export const postWorkFromHome = async (req, res) => {
    try {
        const user = validateUserSession(req, res);
        if (!user) return;
        const { subject, body, startDate, endDate, createdOn, status } = req.body
        await createNewWorkFromHome({ userId: user.id, subject, body, startDate, endDate })
        const allLeaves = await fetchAllWorkFromHome({ user_id: user.id })
        res.json(allLeaves);
    } catch (error) {
        handleError(error, res, req?.session?.user?.id);
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
        throw { status: 404, message: 'Leave not found.' };
    } catch (error) {
        console.error('Leave get error ', error)
        res.status(500).send('Internal Server Error')
    } finally {
        if (client) {
            client.release();
        }
    }
}
export const deleteWorkFromHome = async (req, res) => {
    let client
    const user = validateUserSession(req, res)
    if (!user) return

    const leaveId = req.params?.id
    try {
        if (!leaveId) {
            res.statusCode(400).send("Leave id is missing")
        }
        client = await pool.connect()
        const query = 'DELETE FROM work_from_home WHERE id = $1 AND user_id =$2'
        const results = await client.query(query, [leaveId, user?.id])
        if (results.rowCount > 0) {
            const allLeaves = await fetchAllWorkFromHome({ user_id: user.id });
            res.json(allLeaves);
            return
        }
        throw { status: 404, message: 'Leave not found.' };
    } catch (error) {
        handleError(error, res, res?.session?.user)
    } finally {
        if (client) {
            client.release();
        }
    }
}

export const updateWorkFromHome = async (req, res) => {
    let client;
    const user = validateUserSession(req, res)
    if (!user) return;
    try {
        const { id, subject, body, startDate, endDate, createdOn, status } = req.body
        if (!id) {
            return res.status(400).send("leave ID is requried")
        }
        const query = `UPDATE work_from_home SET user_id =$1, 
        subject = $2,
        body = $3,
        "startDate" = $4,
        "endDate" = $5
        WHERE id = $6
        RETURNING *`
        const values = [user.id, subject, body, startDate, endDate, Number.parseInt(id, 10)];
        client = await pool.connect()
        const result = await client.query(query, values)

        if (result.rowCount === 0) {
            return res.status(400).send("leave does not updated.")
        }
        const allLeaves = await fetchAllWorkFromHome({ user_id: user.id })
        res.json(allLeaves)
    } catch (error) {
        handleError(error, res, req?.session?.user?.id)
    } finally {
        if (client) {
            client.release();
        }
    }
}