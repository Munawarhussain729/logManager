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
        console.error('Error fetching logs ', error)
        throw new Error('Failed to fetch logs')
    }finally {
        if (client) {
            client.release();
        }

    }
}

export const fetchAllProjects = async ()=>{
    let client
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM projects')
        return result.rows
    } catch (error) {
        console.error('Error while fetching projects ', error)
        throw new Error('Failed to fetch projects')
    }finally{
        if(client){
            client.release()
        }
    }
}

export const createNewLog = async ({project, role, hours, description}) => {
    let client
    try {

    } catch (error) {
        console.error('Error inserting logs ', error)
        throw new Error('Failed to store logs')
    }finally {
        if (client) {
            client.release()
        }
    }
}