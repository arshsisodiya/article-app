import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, FileText, X, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import "./ArticlesPage.css";

/**
 * ArticlesPage — displays all articles in a card grid with search filtering.
 * Admins and editors see a "New Article" button; admins can also delete articles.
 * Clicking an article card opens a full-view modal overlay.
 */
export default function ArticlesPage() {
  const { canCreate, canDelete, api } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  /** Fetch articles from the API. */
  async function loadArticles() {
    try {
      const data = await api("/articles");
      setArticles(data.articles || []);
    } catch {
      /* auth context handles 401 */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, [api]);

  /** Filter articles by search query across title, content, and author. */
  const filtered = useMemo(() => {
    if (!search.trim()) return articles;
    const q = search.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.createdBy.toLowerCase().includes(q)
    );
  }, [articles, search]);

  /** Delete an article by ID after user confirmation. */
  async function handleDelete(id, event) {
    if (event) event.stopPropagation();
    if (!window.confirm("Delete this article?")) return;
    try {
      await api(`/articles/${id}`, { method: "DELETE" });
      toast.success("Article deleted");
      setSelectedArticle(null);
      loadArticles();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="articles-header">
        <h2>Articles</h2>
        <div className="articles-toolbar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              id="search-articles"
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {canCreate && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/articles/new")}
            >
              <Plus size={16} /> New Article
            </button>
          )}
        </div>
      </div>

      <p className="articles-count">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        {search && ` matching "${search}"`}
      </p>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading articles...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-box">
          <FileText size={40} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
          <h4>{search ? "No matches found" : "No articles yet"}</h4>
          <p>{search ? "Try a different search term." : "Create the first article to get started."}</p>
        </div>
      ) : (
        <div className="articles-grid">
          {filtered.map((a, i) => (
            <div
              key={a.id}
              className="article-card"
              style={{ animationDelay: `${i * 0.04}s`, cursor: "pointer" }}
              onClick={() => setSelectedArticle(a)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelectedArticle(a)}
            >
              <div className="article-card-header">
                <h4>{a.title}</h4>
                {canDelete && (
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={(e) => handleDelete(a.id, e)}
                    title="Delete article"
                  >
                    <Trash2 size={16} style={{ color: "var(--error)" }} />
                  </button>
                )}
              </div>
              <div className="article-card-body">{a.content}</div>
              <div className="article-card-footer">
                <div className="article-author">
                  <div className="article-author-avatar">
                    {a.createdBy?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <span>{a.createdBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="article-modal-overlay"
          onClick={() => setSelectedArticle(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Article: ${selectedArticle.title}`}
        >
          <div
            className="article-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="article-modal-header">
              <h2>{selectedArticle.title}</h2>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setSelectedArticle(null)}
                aria-label="Close article"
              >
                <X size={20} />
              </button>
            </div>

            <div className="article-modal-meta">
              <div className="article-author">
                <div className="article-author-avatar">
                  {selectedArticle.createdBy?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <span>Written by <strong>{selectedArticle.createdBy}</strong></span>
              </div>
            </div>

            <div className="article-modal-body">
              {selectedArticle.content}
            </div>

            <div className="article-modal-footer">
              {canDelete && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(selectedArticle.id)}
                >
                  <Trash2 size={14} /> Delete Article
                </button>
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedArticle(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
