require('dotenv').config();
const { Pool } = require('pg');
const { parse } = require('pg-connection-string'); // Optional: for robust DATABASE_URL parsing

let dbConfig;

// Validate required environment variables
if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  throw new Error('❌ DATABASE_URL or DB_HOST must be provided');
}

// Prefer DATABASE_URL if provided (common on Render)
if (process.env.DATABASE_URL) {
  const parsedConfig = parse(process.env.DATABASE_URL); // Use pg-connection-string for robust parsing
  dbConfig = {
    host: parsedConfig.host,
    user: parsedConfig.user,
    password: parsedConfig.password,
    database: parsedConfig.database,
    port: parsedConfig.port || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
} else {
  // Use individual environment variables
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'estate_house_db',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
}

// Create PostgreSQL connection pool with optimized settings
const pool = new Pool({
  ...dbConfig,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000 // Timeout after 2 seconds if no connection
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL database connected successfully');
    console.log('📊 Database config:', {
      host: dbConfig.host,
      database: dbConfig.database,
      port: dbConfig.port,
      ssl: dbConfig.ssl ? 'Enabled' : 'Disabled'
    });
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    console.error('🔧 Database config:', {
      host: dbConfig.host,
      database: dbConfig.database,
      port: dbConfig.port,
      ssl: dbConfig.ssl ? 'Enabled' : 'Disabled'
    });
    throw error;
  }
};

// Export only what's needed
module.exports = { pool, testConnection };
