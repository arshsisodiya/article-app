/**
 * Vercel serverless entry point.
 *
 * Connects to MongoDB and exports the Express app
 * as a serverless function handler.
 */
require("dotenv").config();
const connectDB = require("../src/config/db");
const app = require("../src/server");

/* Ensure DB is connected before handling requests */
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
