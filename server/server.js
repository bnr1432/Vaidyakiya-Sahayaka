require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const dbPromise = db.promise();

require("events").EventEmitter.defaultMaxListeners = 20; // give high events

// Middleware for authenticating JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// Register user
app.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    age,
    address,
    gender,
    bloodGroup,
    password,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !mobile ||
    !age ||
    !address ||
    !gender ||
    !bloodGroup ||
    !password
  ) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (firstName, lastName, email, mobile, age, address, gender, bloodGroup, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbPromise.query(query, [
      firstName,
      lastName,
      email,
      mobile,
      age,
      address,
      gender,
      bloodGroup,
      hashedPassword,
    ]);

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error or user already exists" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ?`;

  try {
    const [results] = await dbPromise.query(query, [email]);
    if (results.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        role: user.role,
        userId: user.id,
      });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});

// ✅ Check if mobile exists and allow password reset
app.post("/reset-password", async (req, res) => {
  const { mobile, newPassword } = req.body;

  if (!mobile || !newPassword) {
    return res
      .status(400)
      .json({ message: "Mobile number and new password are required" });
  }

  try {
    const [users] = await dbPromise.query(
      "SELECT * FROM users WHERE mobile = ?",
      [mobile]
    );
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No user found with this mobile number" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbPromise.query("UPDATE users SET password = ? WHERE mobile = ?", [
      hashedPassword,
      mobile,
    ]);

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

// Register child
app.post("/register-child", authenticateToken, async (req, res) => {
  const { firstName, lastName, age, bloodGroup, mobile, gender } = req.body;
  const userId = req.user.id;

  try {
    const query = `
      INSERT INTO children (user_id, firstName, lastName, age, bloodGroup, mobile, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await dbPromise.query(query, [
      userId,
      firstName,
      lastName,
      age,
      bloodGroup,
      mobile,
      gender,
    ]);
    res.status(201).json({ message: "Child registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Database error while registering child" });
  }
});

// Get all names (user and their children)
app.get("/names", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [user] = await dbPromise.query(
      "SELECT firstName FROM users WHERE id = ?",
      [userId]
    );
    const [children] = await dbPromise.query(
      "SELECT firstName FROM children WHERE user_id = ?",
      [userId]
    );

    const names = [
      user[0]?.firstName,
      ...children.map((child) => child.firstName),
    ];
    res.json({ names });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch names" });
  }
});

app.post("/search-hospitals", authenticateToken, async (req, res) => {
  const { name, disease } = req.body;
  const userId = req.user.id;

  try {
    // 1. Get hospitals matching the disease
    const [hospitals] = await dbPromise.query(
      "SELECT name, direction FROM hospitals WHERE disease = ?",
      [disease]
    );

    // 2. Only include name and direction for saving in JSON
    const cleanHospitals = hospitals.map((h) => ({
      name: h.name,
      direction: h.direction,
    }));

    // 3. Save search history with valid JSON
    await dbPromise.query(
      `INSERT INTO search_history (user_id, name, disease, hospitals)
       VALUES (?, ?, ?, ?)`,
      [userId, name, disease, JSON.stringify(cleanHospitals)]
    );

    // 4. Send clean hospitals back
    res.json({ hospitals: cleanHospitals });
  } catch (err) {
    console.error("Error saving search history:", err);
    res.status(500).json({ error: "Error while searching or saving history" });
  }
});

// Admin route to fetch users and their children
app.get("/admin/users", authenticateToken, async (req, res) => {
  try {
    const [users] = await dbPromise.query("SELECT * FROM users");
    const [children] = await dbPromise.query("SELECT * FROM children");

    const userData = users.map((user) => ({
      ...user,
      children: children.filter((child) => child.user_id === user.id),
    }));

    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Admin add hospital route
app.post("/hospitals", authenticateToken, (req, res) => {
  const { name, description, direction, image_url, disease } = req.body;

  const query = `
    INSERT INTO hospitals (name, description, direction, image_url, disease)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, description, direction, image_url, disease],
    (err, result) => {
      if (err) {
        console.error("Error inserting hospital:", err);
        return res.status(500).json({ error: "Failed to add hospital" });
      }
      res.status(201).json({ message: "Hospital added successfully" });
    }
  );
});

app.post("/feedback", authenticateToken, async (req, res) => {
  const { message } = req.body; // Make sure this matches frontend key
  const email = req.user.email;

  try {
    await dbPromise.query(
      "INSERT INTO feedback (email, message) VALUES (?, ?)",
      [email, message]
    );
    res.json({ message: "Feedback submitted" });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

app.get("/admin/feedback", authenticateToken, async (req, res) => {
  // Optional: add check for admin role
  try {
    const [feedback] = await dbPromise.query(
      "SELECT email, message, created_at FROM feedback ORDER BY created_at DESC"
    );
    res.json({ feedback });
  } catch (err) {
    console.error("Failed to retrieve feedback:", err);
    res.status(500).json({ error: "Failed to get feedback" });
  }
});

// Save search to history
app.post("/save-search-history", authenticateToken, async (req, res) => {
  const { name, disease, hospitals } = req.body;
  const userId = req.user.id;

  try {
    const query = `
      INSERT INTO search_history (user_id, name, disease, hospitals)
      VALUES (?, ?, ?, ?)
    `;
    await dbPromise.query(query, [
      userId,
      name,
      disease,
      JSON.stringify(hospitals),
    ]);
    res.status(201).json({ message: "Search history saved successfully" });
  } catch (err) {
    console.error("Error saving search history:", err);
    res
      .status(500)
      .json({ message: "Database error while saving search history" });
  }
});

// Get user search history
app.get("/search-history", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await dbPromise.query(
      "SELECT name, disease, hospitals, timestamp FROM search_history WHERE user_id = ? ORDER BY timestamp DESC",
      [userId]
    );

    const history = rows.map((row) => {
      let parsedHospitals = [];
      try {
        parsedHospitals = JSON.parse(row.hospitals);
      } catch (err) {
        console.warn("Invalid JSON in hospitals field:", row.hospitals);
      }

      return {
        ...row,
        hospitals: parsedHospitals,
      };
    });

    res.json({ history });
  } catch (err) {
    console.error("Failed to fetch search history:", err);
    res.status(500).json({ message: "Error fetching search history" });
  }
});

// Admin route to delete a user
app.delete("/admin/users/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    // Delete associated children
    await dbPromise.query("DELETE FROM children WHERE user_id = ?", [userId]);

    // Delete the user
    await dbPromise.query("DELETE FROM users WHERE id = ?", [userId]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Admin route to update a user's details
app.put("/admin/users/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const {
    firstName,
    lastName,
    email,
    mobile,
    age,
    address,
    gender,
    bloodGroup,
  } = req.body;

  try {
    const query = `
      UPDATE users
      SET firstName = ?, lastName = ?, email = ?, mobile = ?, age = ?, address = ?, gender = ?, bloodGroup = ?
      WHERE id = ?
    `;
    await dbPromise.query(query, [
      firstName,
      lastName,
      email,
      mobile,
      age,
      address,
      gender,
      bloodGroup,
      userId,
    ]);

    res.status(200).json({ message: "User details updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating user details" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Database connected successfully");
});
