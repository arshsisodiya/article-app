const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

/* All user routes require authentication */
router.use(authenticate);

/**
 * GET /users
 * Accessible by: admin only.
 */
router.get("/users", authorize(["admin"]), userController.listUsers);

/**
 * DELETE /users/:id
 * Accessible by: admin only.
 */
router.delete("/users/:id", authorize(["admin"]), userController.deleteUser);

/**
 * PUT /users/:id/role
 * Accessible by: admin only.
 */
router.put("/users/:id/role", authorize(["admin"]), userController.updateRole);

module.exports = router;
