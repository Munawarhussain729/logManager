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
        const approvedLeavesQuery = `
            SELECT COUNT(*) AS total FROM leaves WHERE status = $1 AND user_id = $2
        `;

        const [totalHoursResult, currentDayHoursResult, pendingLeavesResult, approvedLeavesResult] = await Promise.all([
            client.query(totalHoursQuery, [user.id]),
            client.query(currentDayHoursQuery, [user.id, formattedDate]),
            client.query(pendingLeavesQuery, ["pending", user.id]),
            client.query(approvedLeavesQuery, ["approved", user.id])
        ]);

        const totalHours = totalHoursResult.rows[0]?.total_hours || 0;
        const todayHours = currentDayHoursResult.rows[0]?.today_hours || 0;
        const pendingLeaves = pendingLeavesResult.rows[0]?.total || 0;
        const totalLeaves = approvedLeavesResult.rows[0]?.total || 0;
        const allLogs = await fetchAllLogs({ user_id: user?.id });

        res.render('layouts/main', {
            title: 'Dashboard',
            duration: totalHours,
            currentDayHours: todayHours,
            totalLeaves: totalLeaves,
            pendingLeaves: pendingLeaves,
            recentLogs: allLogs,
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
