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

export const getAllLeaves = async (req, res) => {
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const allLeaves = await fetchAllLeaves();
        res.render('layouts/main', {
            title: 'Leaves',
            contentFile: '../leaves/leaves',
            leaves: allLeaves,
            showSidebar: true,
            loggedInUserId: user.id,
        });
    } catch (error) {
        console.error('Error fetching all leaves:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const postLeave = async (req, res) => {
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const { subject, body, startDate, endDate } = req.body;
        if (!subject || !body || !startDate || !endDate) {
            return res.status(400).send('All fields are required.');
        }

        await createNewLeave({ userId: user.id, subject, body, startDate, endDate });
        const allLeaves = await fetchAllLeaves();
        res.json(allLeaves);
    } catch (error) {
        console.error('Error creating leave:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateLeave = async (req, res) => {
    let client;
    try {
        const user = validateUserSession(req, res);
        if (!user) return;

        const { id, subject, body, startDate, endDate } = req.body;
        if (!id || !subject || !body || !startDate || !endDate) {
            return res.status(400).send('All fields, including leave ID, are required.');
        }

        client = await pool.connect();
        const query = `
            UPDATE leaves
            SET user_id = $1, subject = $2, body = $3, "startDate" = $4, "endDate" = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [user.id, subject, body, startDate, endDate, id];
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).send('Leave not found or not updated.');
        }

        const allLeaves = await fetchAllLeaves();
        res.json(allLeaves);
    } catch (error) {
        console.error('Error updating leave:', error);
        res.status(500).send('Internal Server Error');
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
            return res.status(400).send('Leave ID is required.');
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
        res.status(404).send('Leave not found.');
    } catch (error) {
        console.error('Error fetching leave:', error);
        res.status(500).send('Internal Server Error');
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
            return res.status(400).send('Leave ID is required.');
        }

        client = await pool.connect();
        const query = `
            DELETE FROM leaves
            WHERE id = $1 AND user_id = $2;
        `;
        const values = [leaveId, user.id];
        const result = await client.query(query, values);

        if (result.rowCount > 0) {
            const allLeaves = await fetchAllLeaves();
            return res.json(allLeaves);
        }
        res.status(404).send('Leave not found.');
    } catch (error) {
        console.error('Error deleting leave:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) client.release();
    }
};
