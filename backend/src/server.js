/**
 * Express server entry point.
 *
 * Loads environment variables, connects to MongoDB,
 * mounts route modules, and starts listening.
 * Exports the app for Vercel serverless deployment.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- Public Welcome Route ---------- */
app.get("/", (_req, res) => {
  res.json({ 
    message: "RBAC Backend API is running",
    endpoints: {
      health: "/health",
      auth: ["/signup", "/login"],
      articles: "/articles",
      users: "/users"
    }
  });
});

/* ---------- Health check ---------- */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/* ---------- Route modules ---------- */
app.use(authRoutes);
app.use(articleRoutes);
app.use(userRoutes);

/* ---------- 404 fallback ---------- */
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

/* ---------- Global error handler ---------- */
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

/* ---------- Start (local development) ---------- */
if (process.env.NODE_ENV !== "production") {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Backend API running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
      process.exit(1);
    });
}

/* ---------- Export for Vercel ---------- */
module.exports = app;
