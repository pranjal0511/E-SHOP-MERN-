const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const connection = require('../../database/db');
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Create the users table if it does not exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL DEFAULT 'admin'
      );
    `;
    await connection.promise().query(createTableQuery);

    // Check if the user already exists
    const [rows] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 12);

    // Insert new user into the database
    await connection.promise().query('INSERT INTO users (userName, email, password) VALUES (?, ?, ?)', [userName, email, hashPassword]);

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Execute the query and handle the result
    const [rows] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    
    // Check if rows is undefined or empty
    if (!rows || rows.length === 0) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    const checkUser = rows[0]; // Assuming the user exists
    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: checkUser.id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // Send response with the token and user info
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser.id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};


//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};




module.exports = { registerUser ,loginUser,logoutUser,authMiddleware};