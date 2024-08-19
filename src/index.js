// index.js

import pg from 'pg'; // Default import
const { Pool } = pg; // Destructure Pool from the imported module

import dbConfig from './dbconfig.js';
import app from './app.js';

// Create a pool instance
const pool = new Pool(dbConfig);

const fetchData = async () => {
  try {
    // Connect to the PostgreSQL server
    const client = await pool.connect();

    // Query the database
    const result = await client.query('SELECT * FROM logs'); // replace 'logs' with your actual table name

    // Log the results
    console.log(result.rows);

    // Release the client back to the pool
    client.release();
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    // End the pool when done
    await pool.end();
  }
};

fetchData();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
