const Article = require("../models/Article");

/**
 * Lists all articles.
 * Returns formatted articles and the requester's profile.
 */
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });

    const formattedArticles = articles.map((a) => ({
      id: a._id,
      title: a.title,
      content: a.content,
      createdBy: a.authorName,
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
};

/**
 * Creates a new article.
 */
exports.createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const article = await Article.create({
      title: title.trim(),
      content: content.trim(),
      createdBy: req.user.id,
      authorName: req.user.name,
    });

    return res.status(201).json({
      article: {
        id: article._id,
        title: article.title,
        content: article.content,
        createdBy: article.authorName,
      },
    });
  } catch (error) {
    console.error("Create article error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes an article by ID.
 */
exports.deleteArticle = async (req, res) => {
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
};
