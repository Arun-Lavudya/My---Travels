const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, '../db/schema.sql');

const initDb = async () => {
    try {
        // Create connection without database selected to create it if needed
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        console.log('✅ Connected to MySQL server');

        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Remove "USE bus_booking;" from schema to avoid error if DB doesn't exist yet
        // Actually, schema.sql has CREATE DATABASE IF NOT EXISTS, so we can run it.
        // But we need to ensure we are not collecting to a non-existent DB in the initial connection.

        console.log('... Executing schema.sql ...');

        await connection.query(schema);

        console.log('✅ Database initialized successfully');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

initDb();
