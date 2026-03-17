const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

/**
 * POST /signup
 * Creates a new user account with the 'viewer' role.
 */
router.post("/signup", authController.signup);

/**
 * POST /login
 * Authenticates a user and returns a signed JWT.
 */
router.post("/login", authController.login);

module.exports = router;
