import { Trash2 } from "lucide-react";

/**
 * ArticleCard — displays a brief overview of an article.
 */
export default function ArticleCard({ article, canDelete, onDelete, onClick, animationDelay }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this article?")) {
      onDelete(article.id);
    }
  };

  return (
    <div
      className="article-card"
      style={{ animationDelay }}
      onClick={() => onClick(article)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(article)}
    >
      <div className="article-card-header">
        <h4>{article.title}</h4>
        {canDelete && (
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={handleDelete}
            title="Delete article"
          >
            <Trash2 size={16} style={{ color: "var(--error)" }} />
          </button>
        )}
      </div>
      <div className="article-card-body">{article.content}</div>
      <div className="article-card-footer">
        <div className="article-author">
          <div className="article-author-avatar">
            {article.createdBy?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <span>{article.createdBy}</span>
        </div>
      </div>
    </div>
  );
}
