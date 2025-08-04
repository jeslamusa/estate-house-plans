const mysql = require('mysql2/promise');
const { Pool } = require('pg'); // Add PostgreSQL support
require('dotenv').config();

let dbConfig;
let isPostgreSQL = false;

// Check if we have a DATABASE_URL (for connection strings)
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  
  if (url.protocol === 'postgresql:' || url.protocol === 'postgres:') {
    // PostgreSQL configuration
    isPostgreSQL = true;
    dbConfig = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading slash
      port: url.port || 5432,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  } else {
    // MySQL configuration
    dbConfig = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading slash
      port: url.port || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }
} else {
  // Use individual environment variables
  if (process.env.DB_TYPE === 'postgresql') {
    isPostgreSQL = true;
    dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'estate_house_plans',
      port: process.env.DB_PORT || 5432,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  } else {
    // Default to MySQL
    dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'estate_house_plans',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }
}

// Create connection pool based on database type
let pool;

if (isPostgreSQL) {
  pool = new Pool(dbConfig);
} else {
  pool = mysql.createPool(dbConfig);
}

// Test database connection
const testConnection = async () => {
  try {
    if (isPostgreSQL) {
      const client = await pool.connect();
      console.log('✅ PostgreSQL database connected successfully');
      console.log(`📊 Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
      client.release();
    } else {
      const connection = await pool.getConnection();
      console.log('✅ MySQL database connected successfully');
      console.log(`📊 Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
      connection.release();
    }
  } catch (error) {
    console.error(`❌ ${isPostgreSQL ? 'PostgreSQL' : 'MySQL'} connection failed:`, error.message);
    console.error('🔧 Database config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
      type: isPostgreSQL ? 'PostgreSQL' : 'MySQL'
    });
    throw error;
  }
};

// Execute query (works for both MySQL and PostgreSQL)
const executeQuery = async (query, params = []) => {
  try {
    if (isPostgreSQL) {
      const result = await pool.query(query, params);
      return result.rows;
    } else {
      const [rows] = await pool.execute(query, params);
      return rows;
    }
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  isPostgreSQL
};
