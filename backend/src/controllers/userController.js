const User = require("../models/User");

/**
 * Lists all users (passwords excluded).
 */
exports.listUsers = async (_req, res) => {
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
};

/**
 * Deletes a user.
 */
exports.deleteUser = async (req, res) => {
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
};

/**
 * Updates a user's role.
 */
exports.updateRole = async (req, res) => {
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
};
