const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
<<<<<<< HEAD
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
=======
const auth = require("../middleware/auth");
const router = express.Router();
function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
// POST /api/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: "Username already taken" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });
    const token = signToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, username: user.username } });
>>>>>>> bbbd655cfb96b3874fbe09c0375c01389f20f29a
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
<<<<<<< HEAD

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
=======
// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user._id.toString());
    res.json({ token, user: { id: user._id, username: user.username } });
>>>>>>> bbbd655cfb96b3874fbe09c0375c01389f20f29a
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
<<<<<<< HEAD

module.exports = router;
=======
// PUT /api/change-password
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ message: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
>>>>>>> bbbd655cfb96b3874fbe09c0375c01389f20f29a
