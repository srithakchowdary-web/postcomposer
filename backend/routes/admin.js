const express = require("express");
const UserRole = require("../models/UserRole");
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

async function requireAdmin(req, res, next) {
  try {
    const userRole = await UserRole.findOne({ userId: req.userId }).select("role");
    if (!userRole || userRole.role !== "Admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/admin
router.get("/", auth, requireAdmin, async (_req, res) => {
  try {
    const [users, userRoles, posts] = await Promise.all([
      User.find().select("username").sort({ username: 1 }).lean(),
      UserRole.find().select("userId role").lean(),
      Post.find()
        .populate("userId", "username")
        .select("userId platforms status")
        .sort({ createdAt: -1 }),
    ]);
    const roleByUserId = new Map(
      userRoles.map((userRole) => [userRole.userId.toString(), userRole.role])
    );

    res.json({
      users: users.map((user) => ({
        id: user._id,
        username: user.username,
        role: roleByUserId.get(user._id.toString()) || "User",
      })),
      posts: posts.map((post) => ({
        id: post._id,
        username: post.userId?.username || "Deleted user",
        platforms: post.platforms,
        status: post.status,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;