const express = require("express");
const articleController = require("../controllers/articleController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

/* All article routes require authentication */
router.use(authenticate);

/**
 * GET /articles
 * Accessible by: admin, editor, viewer.
 */
router.get("/articles", authorize(["admin", "editor", "viewer"]), articleController.getArticles);

/**
 * POST /articles
 * Accessible by: admin, editor.
 */
router.post("/articles", authorize(["admin", "editor"]), articleController.createArticle);

/**
 * DELETE /articles/:id
 * Accessible by: admin only.
 */
router.delete("/articles/:id", authorize(["admin"]), articleController.deleteArticle);

module.exports = router;
