/**
 * Article routes — CRUD operations with role-based access.
 *
 * GET    /articles      — all authenticated roles can read articles.
 * POST   /articles      — admin and editor can create articles.
 * DELETE /articles/:id  — admin only can delete articles.
 */
const express = require("express");
const Article = require("../models/Article");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

/* All article routes require authentication */
router.use(authenticate);

/**
 * GET /articles
 * Returns all articles and the authenticated user's profile.
 * Accessible by: admin, editor, viewer.
 */
router.get("/articles", authorize(["admin", "editor", "viewer"]), async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });

    /* Map _id to id for frontend compatibility */
    const formattedArticles = articles.map((a) => ({
      id: a._id,
      title: a.title,
      content: a.content,
      createdBy: a.createdBy,
    }));

    return res.json({
      articles: formattedArticles,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Get articles error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * POST /articles
 * Creates a new article with the provided title and content.
 * Accessible by: admin, editor.
 */
router.post("/articles", authorize(["admin", "editor"]), async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const article = await Article.create({
      title: title.trim(),
      content: content.trim(),
      createdBy: req.user.name,
    });

    return res.status(201).json({
      article: {
        id: article._id,
        title: article.title,
        content: article.content,
        createdBy: article.createdBy,
      },
    });
  } catch (error) {
    console.error("Create article error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * DELETE /articles/:id
 * Deletes an article by ID. Returns 204 on success.
 * Accessible by: admin only.
 */
router.delete("/articles/:id", authorize(["admin"]), async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Delete article error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
