import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "rbac_assignment_token";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [submittingArticle, setSubmittingArticle] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const role = user?.role || "";
  const canCreate = role === "admin" || role === "editor";
  const canDelete = role === "admin";
  const articleCount = articles.length;

  const roleCaption = useMemo(() => {
    if (role === "admin") return "Can create and delete articles";
    if (role === "editor") return "Can create articles";
    if (role === "viewer") return "Can view articles only";
    return "";
  }, [role]);

  const permissionSummary = useMemo(() => {
    if (role === "admin") return ["View", "Create", "Delete"];
    if (role === "editor") return ["View", "Create"];
    if (role === "viewer") return ["View"];
    return [];
  }, [role]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
    setArticles([]);
  }, []);

  const apiRequest = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }, []);

  const loadArticles = useCallback(
    async (activeToken = token) => {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest("/articles", {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        });

        setArticles(data.articles || []);
        setUser(data.user || null);
      } catch (requestError) {
        setError(requestError.message);
        clearSession();
      } finally {
        setLoading(false);
      }
    },
    [apiRequest, clearSession, token]
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    void loadArticles(token);
  }, [loadArticles, token]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await apiRequest("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setMessage("Login successful");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateArticle(event) {
    event.preventDefault();
    setSubmittingArticle(true);
    setError("");
    setMessage("");

    try {
      await apiRequest("/articles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      setTitle("");
      setContent("");
      await loadArticles(token);
      setMessage("Article created");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmittingArticle(false);
    }
  }

  async function handleDeleteArticle(articleId) {
    setError("");
    setMessage("");

    try {
      await apiRequest(`/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadArticles(token);
      setMessage("Article deleted");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="shell">
      <header className="hero-panel">
        <p className="kicker">Developer Technical Assignment</p>
        <h1>Role Based Access System</h1>
        <p className="subtitle">Login and manage articles based on your role permissions.</p>
      </header>

      {!token && (
        <section className="panel auth-panel">
          <h2>Login</h2>
          <form className="stack" onSubmit={handleLogin}>
            <label>
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="hint">Demo roles: admin@test.com, editor@test.com, viewer@test.com (password: password)</p>
        </section>
      )}

      {token && (
        <section className="panel dashboard-panel">
          <div className="dashboard-head">
            <div>
              <h2>Articles Dashboard</h2>
              <p className="role-line">
                Logged in as <span className={`role-badge ${role || "unknown"}`}>{role || "unknown"}</span>
                {roleCaption && <span> {roleCaption}</span>}
              </p>
            </div>
            <button className="ghost" onClick={clearSession}>
              Logout
            </button>
          </div>

          <div className="stats-grid">
            <article className="metric-card">
              <p>Total Articles</p>
              <strong>{articleCount}</strong>
            </article>
            <article className="metric-card">
              <p>Your Permissions</p>
              <div className="chip-row">
                {permissionSummary.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </div>

          {canCreate && (
            <form className="article-form" onSubmit={handleCreateArticle}>
              <h3>Create Article</h3>
              <label>
                Title
                <input value={title} onChange={(event) => setTitle(event.target.value)} required />
              </label>
              <label>
                Content
                <textarea
                  rows="4"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  required
                />
              </label>
              <button type="submit" disabled={submittingArticle}>
                {submittingArticle ? "Creating..." : "Create Article"}
              </button>
            </form>
          )}

          <div className="article-list-wrap">
            <h3>All Articles</h3>
            {loading ? (
              <p className="loading">Loading articles...</p>
            ) : articles.length === 0 ? (
              <div className="empty-state">
                <h4>No articles yet</h4>
                <p>Create the first article to get started.</p>
              </div>
            ) : (
              <ul className="article-list">
                {articles.map((article) => (
                  <li key={article.id}>
                    <div>
                      <h4>{article.title}</h4>
                      <p>{article.content}</p>
                      <small>Created by {article.createdBy}</small>
                    </div>
                    {canDelete && (
                      <button className="danger" onClick={() => handleDeleteArticle(article.id)}>
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {(error || message) && (
        <div className={`feedback ${error ? "error" : "success"}`}>{error || message}</div>
      )}
    </div>
  );
}

export default App;
