
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,

    ssl: process.env.RENDER
        ? {
            ca: fs.readFileSync('/etc/secrets/tidb-ca.pem', 'utf8'),
            rejectUnauthorized: true
        }
        : undefined,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to Batloung Farm database successfully.');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

module.exports = { pool, testConnection };
