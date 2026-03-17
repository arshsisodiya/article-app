/**
 * AuthContext — centralised authentication state and API helpers.
 *
 * Provides:
 *   - token / user / role state
 *   - login, signup, logout actions
 *   - authenticated fetch wrapper (api)
 *   - role-derived booleans (canCreate, canDelete, isAdmin)
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { decodeJwtPayload } from "../utils/jwt";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "rbac_token";

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    /* Immediately decode user from stored token for instant display */
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      const decoded = decodeJwtPayload(stored);
      if (decoded) {
        return { id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role };
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;
  const role = user?.role || "";
  const canCreate = role === "admin" || role === "editor";
  const canDelete = role === "admin";
  const isAdmin = role === "admin";

  /** Clears token and user state, removing from localStorage. */
  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
  }, []);

  /**
   * Authenticated fetch wrapper.
   * Automatically attaches the Bearer token and Content-Type header.
   * Clears the session on 401 responses.
   */
  const api = useCallback(
    async (path, options = {}) => {
      const headers = { ...options.headers };
      const activeToken = options._token || token;

      if (activeToken) {
        headers.Authorization = `Bearer ${activeToken}`;
      }

      if (options.body && typeof options.body === "string") {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${API}${path}`, { ...options, headers });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        if (res.status === 401) {
          clearSession();
        }
        throw new Error(data.message || "Request failed");
      }

      return data;
    },
    [token, clearSession]
  );

  /** Logs in and stores the JWT. Returns the API response. */
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const data = await api("/login", {
          method: "POST",
          body: JSON.stringify({ email: email.trim(), password }),
          _token: "",
        });
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);

        /* Immediately set user from token payload */
        const decoded = decodeJwtPayload(data.token);
        if (decoded) {
          setUser({ id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role });
        }

        return data;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  /** Creates a new viewer account. The user must login afterwards. */
  const signup = useCallback(
    async (name, email, password) => {
      setLoading(true);
      try {
        return await api("/signup", {
          method: "POST",
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
          _token: "",
        });
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  /** Logs out by clearing the session. */
  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  /**
   * On token change, refresh user data from the server.
   * This also validates that the token is still accepted by the backend.
   */
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await api("/articles", { _token: token });
        if (!cancelled && data.user) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, api, clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated,
      role,
      canCreate,
      canDelete,
      isAdmin,
      api,
      login,
      signup,
      logout,
    }),
    [token, user, loading, isAuthenticated, role, canCreate, canDelete, isAdmin, api, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access the auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
