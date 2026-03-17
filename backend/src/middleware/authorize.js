/**
 * Authorization middleware factory.
 *
 * Creates an Express middleware that checks whether the authenticated
 * user's role is included in a list of allowed roles.
 * Returns 403 Forbidden if the role is not permitted.
 *
 * Must be used after the `authenticate` middleware.
 *
 * @param {string[]} allowedRoles - Roles permitted to access the route.
 * @returns {Function} Express middleware.
 *
 * @example
 *   router.get("/admin-only", authorize(["admin"]), handler);
 *   router.post("/articles", authorize(["admin", "editor"]), handler);
 */
function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated request" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}

module.exports = {
  authorize,
};
