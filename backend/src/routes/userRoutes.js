/**
 * User management routes — admin only.
 *
 * GET    /users          — list all users (passwords excluded).
 * DELETE /users/:id      — delete a user (cannot delete self).
 * PUT    /users/:id/role — change a user's role (cannot change own role).
 */
const express = require("express");
const User = require("../models/User");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

/* All user routes require authentication */
router.use(authenticate);

/**
 * GET /users
 * Returns a list of all users with passwords stripped.
 * Accessible by: admin only.
 */
router.get("/users", authorize(["admin"]), async (_req, res) => {
  try {
    const users = await User.find().select("-password -__v");

    const safeUsers = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
    }));

    return res.json({ users: safeUsers });
  } catch (error) {
    console.error("List users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * DELETE /users/:id
 * Deletes a user by ID. Admins cannot delete their own account.
 * Returns 204 on success.
 * Accessible by: admin only.
 */
router.delete("/users/:id", authorize(["admin"]), async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * PUT /users/:id/role
 * Updates a user's role. Valid roles: admin, editor, viewer.
 * Admins cannot change their own role.
 * Accessible by: admin only.
 */
router.put("/users/:id/role", authorize(["admin"]), async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !["admin", "editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Role must be admin, editor, or viewer" });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
