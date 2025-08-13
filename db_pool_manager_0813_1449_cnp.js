// 代码生成时间: 2025-08-13 14:49:09
 * It includes error handling and documentation to ensure maintainability and scalability.
 */

const { Pool } = require('pg'); // Import pg module for PostgreSQL connection pooling

// Configuration for the PostgreSQL database connection pool
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  port: 5432,
  max: 10, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // 30 seconds of inactivity before a connection is closed
};

// Create a new database connection pool instance
const dbPool = new Pool(dbConfig);

// Function to query the database using the connection pool
const queryDatabase = async (query, params = []) => {
  try {
    const client = await dbPool.connect();
    try {
      // Execute the query with given parameters
      const res = await client.query(query, params);
      // Return the result of the query
      return res.rows;
    } catch (err) {
      // Handle query errors
      console.error('Database query error:', err);
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    // Handle connection errors
    console.error('Database connection error:', err);
    throw err;
  }
};

// Export the queryDatabase function for use in other modules
module.exports = {
  queryDatabase,
};