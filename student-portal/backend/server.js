const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "student_portal_secret_key";

// Demo users
const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    name: "Student User",
    email: "student@gmail.com",
    password: "student123",
    role: "student"
  }
];

// Demo students
let students = [
  {
    id: 1,
    name: "Rahul",
    course: "CSE"
  },
  {
    id: 2,
    name: "Priya",
    course: "AI & ML"
  },
  {
    id: 3,
    name: "Aman",
    course: "CSE"
  }
];

// ===============================
// LOGIN
// ===============================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role
    },
    SECRET_KEY,
    {
      expiresIn: "1h"
    }
  );

  res.json({
    message: "Login successful",
    token: token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    }
  });
});

// ===============================
// AUTHENTICATION MIDDLEWARE
// ===============================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }

    req.user = user;
    next();
  });
}

// ===============================
// ROLE CHECKING MIDDLEWARE
// ===============================

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only."
    });
  }

  next();
}

// ===============================
// PROTECTED PROFILE ROUTE
// ===============================

app.get("/api/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user
  });
});

// ===============================
// ADMIN ONLY ROUTE
// ===============================

app.get(
  "/api/students",
  authenticateToken,
  adminOnly,
  (req, res) => {
    res.json(students);
  }
);

// ===============================
// DELETE STUDENT - ADMIN ONLY
// ===============================

app.delete(
  "/api/students/:id",
  authenticateToken,
  adminOnly,
  (req, res) => {
    const id = parseInt(req.params.id);

    students = students.filter((student) => student.id !== id);

    res.json({
      message: "Student deleted successfully"
    });
  }
);

// ===============================
// SERVER
// ===============================

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});