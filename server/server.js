const express = require('express');
const { createUserTable } = require('./src/models/user');
const userRoutes = require('./src/routes/user.Routes');
const profileRoutes=require('./src/routes/profile.Routes')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Create the user table on server start
createUserTable().then(() => {
  console.log('User table created');
});

// Use routes
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes)


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
