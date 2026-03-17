import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useArticles } from "../hooks/useArticles";
import ArticleCard from "../components/ArticleCard";
import ArticleModal from "../components/ArticleModal";
import SearchToolbar from "../components/SearchToolbar";
import "./ArticlesPage.css";

/**
 * ArticlesPage — decomposed and refactored using custom hooks and sub-components.
 */
export default function ArticlesPage() {
  const { canCreate, canDelete } = useAuth();
  const navigate = useNavigate();
  const { articles, loading, search, setSearch, deleteArticle } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="animate-fade-in">
      <div className="articles-header">
        <h2>Articles</h2>
        <SearchToolbar
          search={search}
          onSearchChange={setSearch}
          canCreate={canCreate}
          onCreateClick={() => navigate("/articles/new")}
        />
      </div>

      <p className="articles-count">
        {articles.length} article{articles.length !== 1 ? "s" : ""}
        {search && ` matching "${search}"`}
      </p>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading articles...</p>
      ) : articles.length === 0 ? (
        <div className="empty-box">
          <FileText size={40} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
          <h4>{search ? "No matches found" : "No articles yet"}</h4>
          <p>{search ? "Try a different search term." : "Create the first article to get started."}</p>
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map((a, i) => (
            <ArticleCard
              key={a.id}
              article={a}
              canDelete={canDelete}
              onDelete={deleteArticle}
              onClick={setSelectedArticle}
              animationDelay={`${i * 0.04}s`}
            />
          ))}
        </div>
      )}

      <ArticleModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        canDelete={canDelete}
        onDelete={deleteArticle}
      />
    </div>
  );
}
