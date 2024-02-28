const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

pool.connect((error)=>{
    if(error){
        console.error("Error connecting to database", error.message);
        process.exit(1);
    }
    else {
        console.log("Database connected successfully ....");
    }
});

module.exports= pool;

