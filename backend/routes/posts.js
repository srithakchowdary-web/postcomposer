const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { validatePost } = require("../utils/validate");
const router = express.Router();
function parsePlatforms(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return String(raw).split(",").map((s) => s.trim()).filter(Boolean);
  }
}
// Multer error handler so oversized-image messages are readable.
function handleUpload(req, res, next) {
  upload.array("images", 10)(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: `One or more images exceed the maximum size of 10 MB.`,
      });
    }
    return res.status(400).json({ message: err.message });
  });
}
// POST /api/posts   -> post immediately (simulated)
router.post("/", auth, handleUpload, async (req, res) => {
  try {
    const { content } = req.body;
    const platforms = parsePlatforms(req.body.platforms);
    const errors = validatePost({ content, platforms });
    if (errors.length) return res.status(400).json({ errors });
    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const post = await Post.create({
      userId: req.userId,
      content,
      platforms,
      images,
      status: "Posted",
    });
    res.status(201).json({ message: "Post published", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// POST /api/posts/schedule
router.post("/schedule", auth, handleUpload, async (req, res) => {
  try {
    const { content, scheduledDate } = req.body;
    const platforms = parsePlatforms(req.body.platforms);
    const errors = validatePost({ content, platforms });
    if (!scheduledDate) {
      errors.push("Scheduled date and time are required");
    } else {
      const when = new Date(scheduledDate);
      if (isNaN(when.getTime())) errors.push("Invalid scheduled date");
      else if (when.getTime() <= Date.now())
        errors.push("Scheduled date must be in the future");
    }
    if (errors.length) return res.status(400).json({ errors });
    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const post = await Post.create({
      userId: req.userId,
      content,
      platforms,
      images,
      status: "Scheduled",
      scheduledDate: new Date(scheduledDate),
    });
    res.status(201).json({ message: "Post scheduled", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET /api/posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
