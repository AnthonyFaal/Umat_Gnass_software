const jwt =require("jsonwebtoken");
require ('dotenv').config();
const { registerValidation,AdminLoginValidation,userLoginValidation,UpdateValidation } = require('../utils/validation');
const bcrypt = require('bcrypt');
const pool = require('../config/dbConfig');


const registerUser = async (req, res) => {
  // Validate the data before creating a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Check if the user already exists
  const client = await pool.connect();
  try {
    const emailExistsQuery = await client.query('SELECT * FROM users WHERE email = $1', [
      req.body.email,
    ]);

    if (emailExistsQuery.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create a new user
    const insertUserQuery =
      'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *';
    const values = [req.body.username, req.body.email, hashedPassword];
    const insertedUser = await client.query(insertUserQuery, values);

    //generate token on successful 
    const token =jwt.sign({id: insertedUser.rows[0].id}, process.env.JWT_SECRET);
    
    res.json({ userId: insertedUser.rows[0].id, token });
  } finally {
    client.release();
  }
};

// user Login
const userLogin = async (req, res)=>{
  const {error} =userLoginValidation(req.body);
  if(error) return res.status(400).json({message:error.details[0].message});
  const client= await pool.connect();

  try{
    const user = await client.query(
      "SELECT * FROM  users WHERE email = $1",
      [req.body.email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.rows[0].password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET);

    res.json({ userId: user.rows[0].id, token });
  } finally {
    client.release();
  }
};


const loginAdmin = async (req, res) => {
  // Assume that the admin login uses username instead of email
  const { error } = AdminLoginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const client = await pool.connect();
  try {
    const admin = await client.query("SELECT * FROM users WHERE username = $1", [
      req.body.username,
    ]);

    if (admin.rows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, admin.rows[0].password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin.rows[0].id }, process.env.JWT_SECRET);

    res.json({ adminId: admin.rows[0].id, token });
  } finally {
    client.release();
  }
};


const updateUser = async (req, res) => {
  const { error } = UpdateValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const client = await pool.connect();
  try {
    // Check if the user exists
    const user = await client.query("SELECT * FROM users WHERE email = $1", [req.body.email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Update the user's password
    const updatePasswordQuery = "UPDATE users SET password = $2 WHERE email = $1 RETURNING *";
    const updateValues = [req.body.email, hashedPassword];
    const updatedUser = await client.query(updatePasswordQuery, updateValues);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
};


//Get all users

const getAllUsers = async (req, res) => {
  const client = await pool.connect();

  try {
    const getUserQuery = 'SELECT * FROM users';
    
    const result = await client.query(getUserQuery);

    // Assuming you want to send the list of users in the response
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
};


const getUserProfile = (req, res) => {
  res.json({ userProfile: req.user });
};

module.exports = { registerUser, 
  getUserProfile, 
  getAllUsers, 
  loginAdmin,
   userLogin ,
   updateUser };
