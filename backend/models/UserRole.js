const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
});

module.exports = mongoose.model("UserRole", userRoleSchema);