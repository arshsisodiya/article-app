import { Search, Plus } from "lucide-react";

/**
 * SearchToolbar — search input and action buttons for the articles page.
 */
export default function SearchToolbar({ search, onSearchChange, canCreate, onCreateClick }) {
  return (
    <div className="articles-toolbar">
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          id="search-articles"
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {canCreate && (
        <button className="btn btn-primary" onClick={onCreateClick}>
          <Plus size={16} /> New Article
        </button>
      )}
    </div>
  );
}
