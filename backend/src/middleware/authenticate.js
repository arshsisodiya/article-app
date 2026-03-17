/**
 * Authentication middleware.
 *
 * Extracts and validates the JWT from the Authorization header.
 * On success, attaches the decoded user payload to `req.user`.
 * Returns 401 if the header is missing, malformed, or the token is invalid/expired.
 */
const jwt = require("jsonwebtoken");

/** Secret key used to sign and verify JWTs. */
const JWT_SECRET = process.env.JWT_SECRET || "assignment-secret-key";

/**
 * Express middleware that authenticates incoming requests via JWT.
 * Must be applied before any route that requires a logged-in user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  authenticate,
  JWT_SECRET,
};
