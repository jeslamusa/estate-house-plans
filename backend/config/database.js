const { Pool } = require('pg');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: dbUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test DB connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    console.log(`📊 Connected to: ${client.database}`);
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
  }
};

module.exports = {
  pool,
  testConnection
};
