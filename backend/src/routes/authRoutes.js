const express = require("express");
const jwt = require("jsonwebtoken");
const { users } = require("../data/store");
const { JWT_SECRET } = require("../middleware/authenticate");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find((candidate) => candidate.email === email && candidate.password === password);

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
