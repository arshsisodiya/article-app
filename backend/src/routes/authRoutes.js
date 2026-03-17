const express = require("express");
const jwt = require("jsonwebtoken");
const { createViewerUser, users } = require("../data/store");
const { JWT_SECRET } = require("../middleware/authenticate");
const { isValidEmail, passwordRulesCheck } = require("../utils/validation");

const router = express.Router();

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Please provide a valid email address" });
  }

  const existingUser = users.find((candidate) => candidate.email.toLowerCase() === normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const passwordCheck = passwordRulesCheck(password);

  if (!passwordCheck.valid) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      rules: passwordCheck.rules,
    });
  }

  const user = createViewerUser({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  return res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(
    (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({ token });
});

module.exports = router;
