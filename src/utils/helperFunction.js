import dbConfig from "../dbconfig.js"
import pg from 'pg'

const { Pool } = pg
const pool = new Pool(dbConfig)

export const fetchAllLogs = async () => {
    let client
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM logs');
        return result.rows
    } catch (error) {
        console.error('Error fetching logs')
        throw new Error('Failed to fetch logs')
    }
    finally {
        if (client) {
             client.release();
        }

    }
}