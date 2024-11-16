const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // or directly use the connection string if you prefer
    ssl: {
        rejectUnauthorized: false, // Allow SSL connection with non-verified certificates
    },
});

module.exports = pool;
