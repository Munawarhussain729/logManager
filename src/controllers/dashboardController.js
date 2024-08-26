import dbConfig from "../dbconfig.js";
import { getTotalHours } from "../utils/helperFunction.js";
import pg from 'pg'

const { Pool } = pg
const pool = new Pool(dbConfig)

export const getDashboard = async (req, res) => {
    try {
        let client = await pool.connect()
        const { date } = req.query;
        console.log("Date is ", date);

        const result = await getTotalHours({ user_id: 1 })

        if (!date) {
            res.render('layouts/main', { title: 'Dashboard', duration: 12, contentFile: '../dashboard/dashboard' })
            return
        }

        if (!result) {
            res.render('layouts/main', { title: 'Dashboard', duration: 0, contentFile: '../dashboard/dashboard' });
            return
        }

        res.render('layouts/main', { title: 'Dashboard', duration: result?.sum, contentFile: '../dashboard/dashboard' });

    } catch (error) {
        console.error('Error is ', error)
        res.status(500).send('Internal Server error')
    }

};
