import dbConfig from "../dbconfig.js"
import pg from 'pg'

const { Pool } = pg
const pool = new Pool(dbConfig)

export const fetchAllLogs = async ({user_id}) => {
    let client
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM logs WHERE user_id = $1 ORDER BY created_on',[user_id]);
        return result.rows
    } catch (error) {
        console.error('Error fetching logs ', error)
        throw new Error('Failed to fetch logs')
    } finally {
        if (client) {
            client.release();
        }

    }
}
export const fetchAllLeaves = async () => {
    let client
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM leaves ORDER BY "createdOn"');
        return result.rows
    } catch (error) {
        console.error('Error fetching leaves ', error)
        throw new Error('Failed to fetch leaves')
    } finally {
        if (client) {
            client.release();
        }

    }
}
export const fetchAllWorkFromHome = async () => {
    let client
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM work_from_home ORDER BY "createdOn"');
        return result.rows
    } catch (error) {
        console.error('Error fetching leaves ', error)
        throw new Error('Failed to fetch leaves')
    } finally {
        if (client) {
            client.release();
        }

    }
}

export const fetchAllProjects = async () => {
    let client
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM projects')
        return result.rows
    } catch (error) {
        console.error('Error while fetching projects ', error)
        throw new Error('Failed to fetch projects')
    } finally {
        if (client) {
            client.release()
        }
    }
}

export const fetchAllRoles = async () => {
    let client
    try {
        client = await pool.connect()
        const result = await client.query('SELECT * FROM user_roles')
        return result.rows
    } catch (error) {
        console.error('Error while fetching roles', error)
        throw new Error('Failed to fetch roles')
    } finally {
        if (client) {
            client.release()
        }
    }
}

export const createNewLog = async ({ created_on, message, blocker, duration, tomorrows_plan, project, user_id, user_role }) => {
    let client;
    try {
        client = await pool.connect();

        const query = `
            INSERT INTO logs (created_on, message, blocker, duration, tomorrow_plan, project_id, user_id, user_role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        const values = [created_on, message, blocker, duration, tomorrows_plan, project, user_id, user_role];

        const result = await client.query(query, values);

        return result.rows
    } catch (error) {
        console.error('Error inserting logs:', error);
        throw new Error('Failed to store logs');
    } finally {
        if (client) {
            client.release();
        }
    }
};
export const createNewLeave = async ({ userId, subject, body, startDate, endDate }) => {
    let client;
    try {
        client = await pool.connect();

        const query = `
            INSERT INTO leaves (user_id, subject, body, "startDate", "endDate")
            VALUES ($1, $2, $3, $4, $5)
        `;

        const values = [userId, subject, body, startDate, endDate];
        const result = await client.query(query, values);

        return result.rows
    } catch (error) {
        console.error('Error inserting leave:', error);
        throw new Error('Failed to store leave');
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const createNewWorkFromHome = async ({ userId, subject, body, startDate, endDate }) => {
    let client;
    try {
        client = await pool.connect();

        const query = `
            INSERT INTO work_from_home ("user_id", subject, body, "startDate", "endDate")
            VALUES ($1, $2, $3, $4, $5)
        `;

        const values = [userId, subject, body, startDate, endDate];
        const result = await client.query(query, values);

        return result.rows
    } catch (error) {
        console.error('Error inserting leave:', error);
        throw new Error('Failed to store leave');
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const getTotalHours = async ({ user_id }) => {
    let client
    try {
        client = await pool.connect()
        const query = `SELECT SUM (duration) FROM logs WHERE user_id = ${user_id}`
        const result = await client.query(query)
        if (result.rows?.length <= 0) {
            return
        }
        return result.rows[0]
    } catch (error) {
        console.error('Error geting hours ', error)
        throw new Error('Failed to get hours')
    } finally {
        if (client) {
            client.release();
        }
    }
}