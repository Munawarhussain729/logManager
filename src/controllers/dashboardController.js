import dbConfig from "../dbconfig.js";
import { getTotalHours } from "../utils/helperFunction.js";
import pg from 'pg'

const { Pool } = pg
const pool = new Pool(dbConfig)

export const getDashboard = async (req, res) => {
    let client = await pool.connect()
    try {
        const result = await client.query(`SELECT SUM (duration) FROM logs WHERE user_id = ${1}`)
        

        // const result = await getTotalHours({ user_id: 1 })
        if (!result || result.rows.length <=0) {
            res.render('layouts/main', { title: 'Dashboard', duration: 0, contentFile: '../dashboard/dashboard' });
            return
        }
        const totalHours = result.rows[0]
        res.render('layouts/main', { title: 'Dashboard', duration: result?.sum, contentFile: '../dashboard/dashboard' });
    } catch (error) {
        console.error('Error is ', error)
        res.status(500).send('Internal Server error')
    }finally{
        client.release()
    }
};
