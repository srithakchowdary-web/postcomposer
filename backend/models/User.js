const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
<<<<<<< HEAD
  role: { type: String, enum: ["Admin", "User"], default: "User" },
  createdAt: { type: Date, default: Date.now },
});
=======
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", userSchema);
>>>>>>> bbbd655cfb96b3874fbe09c0375c01389f20f29a
