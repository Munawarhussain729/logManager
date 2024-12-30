import { USER_ID } from "../../constants.js";
import dbConfig from "../dbconfig.js";
import { createNewLog, fetchAllLogs, fetchAllProjects, fetchAllRoles } from "../utils/helperFunction.js";
import pg from "pg"

const { Pool } = pg
const pool = new Pool(dbConfig)

export const getLogin = async (req, res) => {
    try {
        res.render('layouts/main',
            {
                title: 'Login',
                contentFile: '../login/login',
                showSidebar: false
            });
    } catch (error) {
        console.error('Daily loog error ', error)
        res.status(500).send('Internal server error');
    }

}
export const postLogin = async (req, res) => {
    let client;
    try {
        const { email, password } = req.body;
        console.log("email is ", email);
        console.log("password is ", password);
        client = await pool.connect(); // Connect to the database

        // Use parameterized query to safely handle input
        const query = 'SELECT * FROM users WHERE email = $1';
        const results = await client.query(query, [email]);

        console.log("query result ", results.rows);

        if (results.rows.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results.rows[0];
        if (user.password !== password) {
            return res.status(401).send('Invalid password for the email');
        }
        console.log("Users ", user);

        res.render('layouts/main',
            {
                title: 'Login',
                contentFile: '../login/login',
                showSidebar: false
            });
    } catch (error) {
        console.error('Login loog error ', error)
        res.status(500).send('Internal server error');
    }

}