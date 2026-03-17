import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import "./CreateArticlePage.css";

export default function CreateArticlePage() {
  const { api } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api("/articles", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });
      toast.success("Article created successfully!");
      navigate("/articles");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-article animate-fade-in">
      <button
        className="btn btn-ghost"
        onClick={() => navigate("/articles")}
        style={{ marginBottom: 16 }}
      >
        <ArrowLeft size={16} /> Back to Articles
      </button>

      <div className="create-article-card">
        <h2>Create New Article</h2>
        <p className="create-article-sub">
          Write a new article. It will be visible to all authenticated users.
        </p>

        <form className="create-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              id="article-title"
              type="text"
              placeholder="Enter a compelling title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Content
            <textarea
              id="article-content"
              placeholder="Write your article content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>

          <div className="create-form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/articles")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Send size={16} />
              {submitting ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
