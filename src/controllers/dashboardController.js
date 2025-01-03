import dbConfig from "../dbconfig.js";
import { getTotalHours } from "../utils/helperFunction.js";
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool(dbConfig);

export const getDashboard = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect if not logged in
    }
    let client = await pool.connect();
    try {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];  // Correct date format

        const result = await client.query(`SELECT SUM(duration) FROM logs WHERE user_id = $1`, ["91a2ed64-e083-4405-a09f-a26aec56927d"]);
        const currentDayHours = await client.query(`SELECT SUM(duration) FROM logs WHERE user_id = $1 AND created_on = $2`, ["91a2ed64-e083-4405-a09f-a26aec56927d", formattedDate]);
        // const currentDayHours = await client.query(`SELECT SUM(duration) FROM logs WHERE user_id = $1 AND created_on = $2`, ["91a2ed64-e083-4405-a09f-a26aec56927d", formattedDate]);
        let todayHours = 0
        if (currentDayHours && currentDayHours.rows.length > 0) {
            todayHours = currentDayHours.rows[0].sum
        }
        if (!result || result.rows.length <= 0) {
            res.render('layouts/main', { title: 'Dashboard', duration: 0, contentFile: '../dashboard/dashboard' });
            return;
        }

        const totalHours = result.rows[0].sum || 0;
        res.render('layouts/main', { title: 'Dashboard', duration: totalHours, currentDayHours: todayHours, showSidebar: true, contentFile: '../dashboard/dashboard' });
    } catch (error) {
        console.error('Error is ', error);
        res.status(500).send('Internal Server error');
    } finally {
        client.release();
    }
};
