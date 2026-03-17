import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

/**
 * useArticles — custom hook for article management logic.
 * Encapsulates fetching, searching, and deleting articles.
 */
export function useArticles() {
  const { api } = useAuth();
  const toast = useToast();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadArticles = useCallback(async () => {
    try {
      const data = await api("/articles");
      setArticles(data.articles || []);
    } catch {
      // Auth context handles 401
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const filteredArticles = useMemo(() => {
    if (!search.trim()) return articles;
    const q = search.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.createdBy.toLowerCase().includes(q)
    );
  }, [articles, search]);

  const deleteArticle = async (id) => {
    try {
      await api(`/articles/${id}`, { method: "DELETE" });
      toast.success("Article deleted");
      setArticles((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  return {
    articles: filteredArticles,
    allArticles: articles,
    loading,
    search,
    setSearch,
    loadArticles,
    deleteArticle,
  };
}
