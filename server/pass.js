require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Admin credentials
const adminEmail = 'admin@gmail.com';  // Change to your desired admin email
const adminPassword = 'admin143';  // The plaintext password you want for the admin

// Generate hashed password and insert admin
const createAdmin = async () => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin already exists
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [adminEmail], (err, results) => {
      if (err) throw err;

      // If no admin exists, insert admin user
      if (results.length === 0) {
        const insertQuery = `
          INSERT INTO users (firstName, lastName, email, mobile, age, address, gender, bloodGroup, password, role)
          VALUES ('Admin', 'User', ?, '1234567890', 35, 'Admin Address', 'Male', 'O+', ?, 'admin')
        `;

        db.query(insertQuery, [adminEmail, hashedPassword], (err) => {
          if (err) {
            console.log('Error inserting admin user:', err);
          } else {
            console.log('Admin user created successfully');
          }

          // Close the connection
          db.end();
        });
      } else {
        console.log('Admin user already exists');
        db.end();
      }
    });
  } catch (err) {
    console.log('Error hashing password:', err);
    db.end();
  }
};

// Run the function to create admin
createAdmin();
