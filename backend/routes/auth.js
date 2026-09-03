const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserRole = require("../models/UserRole");
const auth = require("../middleware/auth");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

async function getUserRole(userId) {
  const userRole = await UserRole.findOne({ userId }).select("role").lean();
  return userRole?.role || "User";
}

// POST /api/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });
    await UserRole.create({ userId: user._id, role: "User" });
    const token = signToken(user._id.toString());

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, role: "User" },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const role = await getUserRole(user._id);
    const token = signToken(user._id.toString());

    res.json({
      token,
      user: { id: user._id, username: user.username, role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;