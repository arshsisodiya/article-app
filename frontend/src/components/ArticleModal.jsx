import { X, Trash2 } from "lucide-react";

/**
 * ArticleModal — overlay displaying full article details.
 */
export default function ArticleModal({ article, isOpen, onClose, canDelete, onDelete }) {
  if (!isOpen || !article) return null;

  const handleDelete = () => {
    if (window.confirm("Delete this article?")) {
      onDelete(article.id);
      onClose();
    }
  };

  return (
    <div
      className="article-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Article: ${article.title}`}
    >
      <div className="article-modal" onClick={(e) => e.stopPropagation()}>
        <div className="article-modal-header">
          <h2>{article.title}</h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close article"
          >
            <X size={20} />
          </button>
        </div>

        <div className="article-modal-meta">
          <div className="article-author">
            <div className="article-author-avatar">
              {article.createdBy?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <span>
              Written by <strong>{article.createdBy}</strong>
            </span>
          </div>
        </div>

        <div className="article-modal-body">{article.content}</div>

        <div className="article-modal-footer">
          {canDelete && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              <Trash2 size={14} /> Delete Article
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
