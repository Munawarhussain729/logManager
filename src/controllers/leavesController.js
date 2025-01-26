import { USER_ID } from "../../constants.js";
import dbConfig from "../dbconfig.js";
import { createNewLeave, fetchAllLeaves } from "../utils/helperFunction.js";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool(dbConfig);

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

    let leaves = [];
    try {
        if (userId) {
            leaves = await fetchAllLeaves({ user_id: userId });
        }
    } catch (fetchError) {
        console.error('Error fetching leaves after failure:', fetchError);
    }

    res.status(error?.status || 500).json({
        error: error?.message || 'Internal Server Error',
        leaves: leaves || []
    });
};

export const getAllLeaves = async (req, res) => {
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const allLeaves = await fetchAllLeaves({ user_id: user.id });
        res.render('layouts/main', {
            title: 'Leaves',
            contentFile: '../leaves/leaves',
            leaves: allLeaves,
            showSidebar: true,
            loggedInUserId: user.id,
        });
    } catch (error) {
        handleError(error, res, req?.session?.user?.id);
    }
};

export const postLeave = async (req, res) => {
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const { subject, body, startDate, endDate } = req.body;
        if (!subject || !body || !startDate || !endDate) {
            throw { status: 400, message: 'All fields are required.' };
        }

        await createNewLeave({
            userId: user.id,
            subject: subject.trim(),
            body: body.trim(),
            startDate,
            endDate,
        });

        const leaves = await fetchAllLeaves({ user_id: user.id });
        res.json(leaves);
    } catch (error) {
        handleError(error, res, req?.session?.user?.id);
    }
};

export const updateLeave = async (req, res) => {
    let client;
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const { id, subject, body, startDate, endDate } = req.body;
        if (!id || !subject || !body || !startDate || !endDate) {
            throw { status: 400, message: 'All fields, including leave ID, are required.' };
        }

        client = await pool.connect();
        const query = `
            UPDATE leaves
            SET user_id = $1, subject = $2, body = $3, "startDate" = $4, "endDate" = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [user.id, subject.trim(), body.trim(), startDate, endDate, id];
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            throw { status: 404, message: 'Leave not found or not updated.' };
        }

        const allLeaves = await fetchAllLeaves({ user_id: user.id });
        res.json(allLeaves);
    } catch (error) {
        handleError(error, res, req?.session?.user?.id);
    } finally {
        if (client) client.release();
    }
};

export const getLeave = async (req, res) => {
    let client;
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const leaveId = req.params.id;
        if (!leaveId) {
            throw { status: 400, message: 'Leave ID is required.' };
        }

        client = await pool.connect();
        const query = `
            SELECT * FROM leaves
            WHERE id = $1 AND user_id = $2;
        `;
        const values = [leaveId, user.id];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        throw { status: 404, message: 'Leave not found.' };
    } catch (error) {
        handleError(error, res, req?.session?.user?.id);
    } finally {
        if (client) client.release();
    }
};

export const deleteLeave = async (req, res) => {
    let client;
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const leaveId = req.params.id;
        if (!leaveId) {
            throw { status: 400, message: 'Leave ID is required.' };
        }

        client = await pool.connect();
        const query = `
            DELETE FROM leaves
            WHERE id = $1 AND user_id = $2;
        `;
        const values = [leaveId, user.id];
        const result = await client.query(query, values);

        if (result.rowCount > 0) {
            const allLeaves = await fetchAllLeaves({ user_id: user.id });
            return res.json(allLeaves);
        }
        throw { status: 404, message: 'Leave not found.' };
    } catch (error) {
        handleError(error, res, req?.session?.user?.id);
    } finally {
        if (client) client.release();
    }
};
