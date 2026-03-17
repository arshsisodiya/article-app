/**
 * jwt.js — utility for decoding JWT payloads without verification.
 */

/**
 * Decodes the payload of a JWT.
 * @param {string} jwt - The JWT string.
 * @returns {object|null} The decoded payload, or null on failure.
 */
export function decodeJwtPayload(jwt) {
  if (!jwt) return null;
  try {
    const base64Url = jwt.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
