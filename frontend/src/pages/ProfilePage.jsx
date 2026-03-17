import { Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, role, canCreate, canDelete, isAdmin } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const permissions = [
    { label: "View Articles", granted: true },
    { label: "Create Articles", granted: canCreate },
    { label: "Delete Articles", granted: canDelete },
    { label: "Manage Users", granted: isAdmin },
  ];

  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-identity">
            <h2>{user?.name || "User"}</h2>
            <span className="profile-email">{user?.email || "—"}</span>
          </div>
        </div>

        <div className="profile-fields">
          <div className="profile-field">
            <span className="profile-field-label">Full Name</span>
            <div className="profile-field-value">{user?.name || "—"}</div>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Email Address</span>
            <div className="profile-field-value">{user?.email || "—"}</div>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Role</span>
            <div className="profile-field-value">
              <span className={`badge badge-${role}`}>{role || "unknown"}</span>
            </div>
          </div>
        </div>

        <div className="profile-perms">
          <h3>Your Permissions</h3>
          <div className="profile-perm-list">
            {permissions.map((p) => (
              <div
                key={p.label}
                className={`profile-perm-item${!p.granted ? " profile-perm-denied" : ""}`}
              >
                <span className="profile-perm-icon">
                  {p.granted ? <Check size={16} /> : <X size={16} />}
                </span>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
