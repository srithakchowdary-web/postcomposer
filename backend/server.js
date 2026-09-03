require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
<<<<<<< HEAD
const adminRoutes = require("./routes/admin");
const startScheduler = require("./utils/scheduler");

const app = express();

app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => res.json({ ok: true, service: "PostComposer API" }));

=======
const startScheduler = require("./utils/scheduler");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.get("/", (_req, res) => res.json({ ok: true, service: "PostComposer API" }));
>>>>>>> bbbd655cfb96b3874fbe09c0375c01389f20f29a
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/postcomposer";
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    startScheduler();
<<<<<<< HEAD
    app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
=======
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> bbbd655cfb96b3874fbe09c0375c01389f20f29a
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });