const jwt = require('jsonwebtoken');
const pool = require('../config/dbConfig');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization');

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token not provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database (this is just an example, modify based on your user model)
    const client = await pool.connect();
    try {
      const userQuery = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

      if (userQuery.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Attach the user information to the request object for further use
      req.user = userQuery.rows[0];
      next();
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
