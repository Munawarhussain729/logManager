import dbConfig from "../dbconfig.js";
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool(dbConfig);

export const getDashboard = async (req, res) => {
    const { user } = req.session;

    if (!user || !user.id) {
        return res.redirect('/login');
    }

    let client;
    try {
        client = await pool.connect();

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];

        const totalHoursQuery = `
            SELECT SUM(duration) AS total_hours
            FROM logs
            WHERE user_id = $1
        `;
        const currentDayHoursQuery = `
            SELECT SUM(duration) AS today_hours
            FROM logs
            WHERE user_id = $1 AND created_on = $2
        `;

        const [totalHoursResult, currentDayHoursResult] = await Promise.all([
            client.query(totalHoursQuery, [user.id]),
            client.query(currentDayHoursQuery, [user.id, formattedDate])
        ]);
        const totalHours = totalHoursResult.rows[0]?.total_hours || 0;
        const todayHours = currentDayHoursResult.rows[0]?.today_hours || 0;
        res.render('layouts/main', {
            title: 'Dashboard',
            duration: totalHours,
            currentDayHours: todayHours,
            showSidebar: true,
            contentFile: '../dashboard/dashboard'
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) {
            client.release();
        }
    }
};
