const express = require("express");
const { articles, createArticle, deleteArticleById } = require("../data/store");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

router.use(authenticate);

router.get("/articles", authorize(["admin", "editor", "viewer"]), (req, res) => {
  return res.json({
    articles,
    user: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

router.post("/articles", authorize(["admin", "editor"]), (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const article = createArticle({
    title: title.trim(),
    content: content.trim(),
    createdBy: req.user.name,
  });

  return res.status(201).json({ article });
});

router.delete("/articles/:id", authorize(["admin"]), (req, res) => {
  const articleId = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(articleId)) {
    return res.status(400).json({ message: "Invalid article id" });
  }

  const deleted = deleteArticleById(articleId);

  if (!deleted) {
    return res.status(404).json({ message: "Article not found" });
  }

  return res.status(204).send();
});

module.exports = router;
