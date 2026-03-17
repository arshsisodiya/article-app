import { useEffect, useState } from "react";
import { Trash2, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import "./UsersPage.css";

export default function UsersPage() {
  const { api } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      const data = await api("/users");
      setUsers(data.users || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [api]);

  async function handleRoleChange(userId, newRole) {
    try {
      await api(`/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      toast.success("Role updated");
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(userId, userName) {
    if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    try {
      await api(`/users/${userId}`, { method: "DELETE" });
      toast.success("User deleted");
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const adminCount = users.filter((u) => u.role === "admin").length;
  const editorCount = users.filter((u) => u.role === "editor").length;
  const viewerCount = users.filter((u) => u.role === "viewer").length;

  return (
    <div className="animate-fade-in">
      <div className="users-header">
        <h2>User Management</h2>
      </div>

      <div className="users-stats">
        <div className="users-stat">
          <div className="users-stat-value">{users.length}</div>
          <div className="users-stat-label">Total Users</div>
        </div>
        <div className="users-stat">
          <div className="users-stat-value">{adminCount}</div>
          <div className="users-stat-label">Admins</div>
        </div>
        <div className="users-stat">
          <div className="users-stat-value">{editorCount}</div>
          <div className="users-stat-label">Editors</div>
        </div>
        <div className="users-stat">
          <div className="users-stat-value">{viewerCount}</div>
          <div className="users-stat-label">Viewers</div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading users...</p>
      ) : users.length === 0 ? (
        <div className="empty-box">
          <Users size={40} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
          <h4>No users found</h4>
        </div>
      ) : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label="Name">
                    <span className="user-name">{u.name}</span>
                  </td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Role">
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td data-label="Actions">
                    <div className="user-actions">
                      <select
                        className="role-select"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleDelete(u.id, u.name)}
                        title="Delete user"
                      >
                        <Trash2 size={16} style={{ color: "var(--error)" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
