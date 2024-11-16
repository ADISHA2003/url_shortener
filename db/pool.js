const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use the connection string from .env
    ssl: {
        rejectUnauthorized: false // Required for cloud-hosted databases
    }
});

pool.connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => {
        console.log("Database connection error:", err.message);
        console.log(err); // Log the full error for more information
    });

module.exports = pool;
