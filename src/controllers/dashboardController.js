import dbConfig from "../dbconfig.js";
import { getTotalHours } from "../utils/helperFunction.js";
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool(dbConfig);

export const getDashboard = async (req, res) => {
    let client = await pool.connect();
    try {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];  // Correct date format

        const result = await client.query(`SELECT SUM(duration) FROM logs WHERE user_id = $1`, [1]);
        const currentDayHours = await client.query(`SELECT SUM(duration) FROM logs WHERE user_id = $1 AND created_on = $2`, [1, formattedDate]);
        console.log("Current day houts ", currentDayHours.rows)
        let todayHours = 0
        if(currentDayHours && currentDayHours.rows.length > 0){
            todayHours = currentDayHours.rows[0].sum
        }
        if (!result || result.rows.length <= 0) {
            res.render('layouts/main', { title: 'Dashboard', duration: 0, contentFile: '../dashboard/dashboard' });
            return;
        }

        const totalHours = result.rows[0].sum || 0;
        res.render('layouts/main', { title: 'Dashboard', duration: totalHours, currentDayHours: todayHours, contentFile: '../dashboard/dashboard' });
    } catch (error) {
        console.error('Error is ', error);
        res.status(500).send('Internal Server error');
    } finally {
        client.release();
    }
};
