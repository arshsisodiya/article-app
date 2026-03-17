import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Users,
  User,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./DashboardLayout.css";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/articles": "Articles",
  "/articles/new": "Create Article",
  "/users": "User Management",
  "/profile": "Profile",
};

export default function DashboardLayout() {
  const { user, role, canCreate, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle =
    pageTitles[location.pathname] || "Dashboard";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield size={20} />
          </div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-title">RBAC System</span>
            <span className="sidebar-brand-sub">Access Control</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Main</span>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            onClick={closeSidebar}
          >
            <LayoutDashboard className="nav-link-icon" size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/articles"
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FileText className="nav-link-icon" size={20} />
            Articles
          </NavLink>

          {canCreate && (
            <NavLink
              to="/articles/new"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              onClick={closeSidebar}
            >
              <PenSquare className="nav-link-icon" size={20} />
              Create Article
            </NavLink>
          )}

          {isAdmin && (
            <>
              <span className="sidebar-section-label">Admin</span>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
                onClick={closeSidebar}
              >
                <Users className="nav-link-icon" size={20} />
                User Management
              </NavLink>
            </>
          )}

          <span className="sidebar-section-label">Account</span>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            onClick={closeSidebar}
          >
            <User className="nav-link-icon" size={20} />
            Profile
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || "User"}</div>
              <div className="sidebar-user-role">{role || "unknown"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={closeSidebar}
      />

      {/* Main */}
      <div className="main-wrapper">
        <header className="navbar">
          <div className="navbar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="navbar-title">{pageTitle}</h1>
          </div>

          <div className="navbar-right">
            <div className="navbar-role">
              <span className="navbar-role-label">Role:</span>
              <span className={`badge badge-${role || "viewer"}`}>
                {role || "unknown"}
              </span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
