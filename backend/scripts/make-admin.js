require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const UserRole = require("../models/UserRole");

const username = process.argv[2];
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/postcomposer";

async function makeAdmin() {
  if (!username) {
    throw new Error("Provide a username: npm run make-admin -- your_username");
  }

  await mongoose.connect(mongoUri);
  const user = await User.findOne({ username });
  if (!user) throw new Error(`No user found with username "${username}"`);

  await UserRole.findOneAndUpdate(
    { userId: user._id },
    { userId: user._id, role: "Admin" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`${username} is now an Admin.`);
}

makeAdmin()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });