const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  platforms: [{ type: String, enum: ["X", "Instagram", "Facebook", "LinkedIn"] }],
  images: [{ type: String }], // stored file paths (relative to /uploads)
  status: { type: String, enum: ["Posted", "Scheduled"], default: "Posted" },
  scheduledDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Post", postSchema);