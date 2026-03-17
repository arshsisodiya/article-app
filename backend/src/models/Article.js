/**
 * Article model — Mongoose schema for articles.
 *
 * Fields: title, content, createdBy (author name).
 */
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* Prevent model recompilation errors in serverless (Vercel) */
module.exports = mongoose.models.Article || mongoose.model("Article", articleSchema);
