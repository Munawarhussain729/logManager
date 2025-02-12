import dbConfig from "../dbconfig.js";
import pg from 'pg';
import { fetchAllLogs } from "../utils/helperFunction.js";

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
            WHERE user_id = $1 AND DATE(created_on) = $2
        `;
        const pendingLeavesQuery = `
            SELECT COUNT(*) AS total FROM leaves WHERE status = $1 AND user_id = $2
        `;
        const totalLeavesQuery = `
            SELECT COUNT(*) AS total FROM leaves WHERE user_id = $1
        `;
        const productivityQuery = `
            SELECT TO_CHAR(created_on, 'YYYY-MM-DD') AS date, SUM(duration) AS total_hours
            FROM logs
            WHERE user_id = $1 AND created_on >= CURRENT_DATE - INTERVAL '6 days'
            GROUP BY date
            ORDER BY date ASC
        `;

        const [
            totalHoursResult,
            currentDayHoursResult,
            pendingLeavesResult,
            totalLeavesResult,
            productivityResult
        ] = await Promise.all([
            client.query(totalHoursQuery, [user.id]),
            client.query(currentDayHoursQuery, [user.id, formattedDate]),
            client.query(pendingLeavesQuery, ["Pending", user.id]),
            client.query(totalLeavesQuery, [user.id]),
            client.query(productivityQuery, [user.id])
        ]);

        const totalHours = totalHoursResult.rows[0]?.total_hours || 0;
        const todayHours = currentDayHoursResult.rows[0]?.today_hours || 0;
        const pendingLeaves = pendingLeavesResult.rows[0]?.total || 0;
        const totalLeaves = totalLeavesResult.rows[0]?.total || 0;
        const allLogs = await fetchAllLogs({ user_id: user?.id });

        const labels = productivityResult.rows.map(row => row.date);
        const data = productivityResult.rows.map(row => row.total_hours);

        res.render('layouts/main', {
            title: 'Dashboard',
            duration: totalHours,
            currentDayHours: todayHours,
            totalLeaves: totalLeaves,
            pendingLeaves: pendingLeaves,
            recentLogs: allLogs,
            productivityLabels: JSON.stringify(labels),  // Ensure JSON format
            productivityData: JSON.stringify(data),      // Ensure JSON format
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
