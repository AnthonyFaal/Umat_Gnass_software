const pool = require('../config/dbConfig');

const createUserTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
  } finally {
    client.release();
  }
};

const dropUserTable = async () => {
  const client = await pool.connect();
  try {
    await client.query('DROP TABLE IF EXISTS users;');
  } finally {
    client.release();
  }
};

module.exports = { createUserTable, dropUserTable };
