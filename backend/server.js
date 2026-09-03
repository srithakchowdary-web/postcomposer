require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const adminRoutes = require("./routes/admin");
const startScheduler = require("./utils/scheduler");

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  "https://postcomposer-rust.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// --- Body Parsing & Static Middleware ---
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.get("/", (_req, res) => res.json({ ok: true, service: "PostComposer API" }));
app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

// --- Database & Server Start ---
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/postcomposer";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    startScheduler();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });