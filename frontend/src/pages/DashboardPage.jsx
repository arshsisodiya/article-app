import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Shield, Eye, PenSquare, Trash2, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, role, canCreate, canDelete, isAdmin, api } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api("/articles");
        if (!cancelled) setArticles(data.articles || []);
      } catch {
        /* handled by auth context */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [api]);

  const permissions = [];
  if (role === "admin" || role === "editor" || role === "viewer") permissions.push("View");
  if (canCreate) permissions.push("Create");
  if (canDelete) permissions.push("Delete");

  const recentArticles = articles.slice(-5).reverse();

  return (
    <div className="animate-fade-in">
      {/* Welcome banner */}
      <div className="welcome-banner">
        <h2>Welcome back, {user?.name || "User"} 👋</h2>
        <p>
          You are signed in as{" "}
          <span className={`badge badge-${role}`}>{role}</span>.{" "}
          {role === "admin" && "You have full access to manage articles and users."}
          {role === "editor" && "You can create and view articles."}
          {role === "viewer" && "You can browse all published articles."}
        </p>
        <div className="welcome-actions">
          {canCreate && (
            <button className="btn btn-primary" onClick={() => navigate("/articles/new")}>
              <Plus size={16} /> Create Article
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate("/articles")}>
            <FileText size={16} /> View Articles
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><FileText size={22} /></div>
          <div className="stat-info">
            <h3>{articles.length}</h3>
            <span className="stat-label">Total Articles</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><Shield size={22} /></div>
          <div className="stat-info">
            <h3 style={{ fontSize: "1.1rem", textTransform: "capitalize" }}>{role}</h3>
            <span className="stat-label">Your Role</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber"><Eye size={22} /></div>
          <div className="stat-info">
            <div className="perm-chips">
              {permissions.map((p) => (
                <span key={p} className="perm-chip">{p}</span>
              ))}
            </div>
            <span className="stat-label" style={{ marginTop: 6 }}>Permissions</span>
          </div>
        </div>

        {isAdmin && (
          <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/users")}>
            <div className="stat-icon cyan"><Shield size={22} /></div>
            <div className="stat-info">
              <h3>Admin</h3>
              <span className="stat-label">Manage Users →</span>
            </div>
          </div>
        )}
      </div>

      {/* Recent articles */}
      <div className="recent-section">
        <h3>Recent Articles</h3>
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : recentArticles.length === 0 ? (
          <div className="empty-box">
            <h4>No articles yet</h4>
            <p>Articles will appear here once created.</p>
          </div>
        ) : (
          <div className="recent-list">
            {recentArticles.map((a) => (
              <div key={a.id} className="recent-item">
                <div className="recent-item-icon"><FileText size={18} /></div>
                <div className="recent-item-info">
                  <div className="recent-item-title">{a.title}</div>
                  <div className="recent-item-meta">
                    by {a.createdBy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
