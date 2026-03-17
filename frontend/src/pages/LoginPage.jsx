import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield, FileText, Users, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import "./LoginPage.css";

export default function LoginPage() {
  const { isAuthenticated, login, loading } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.message);
    }
  }

  function fillDemo(role) {
    setEmail(`${role}@test.com`);
    setPassword("password");
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-orb" />
        <div className="auth-bg-orb" />
        <div className="auth-bg-orb" />
      </div>

      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <Shield size={28} color="#fff" />
          </div>
          <h1>Role Based Access System</h1>
          <p>
            Secure article management with granular role permissions.
            Admin, Editor, and Viewer roles with JWT authentication.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon"><Shield size={18} /></div>
              <span>JWT-based authentication & authorization</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><Users size={18} /></div>
              <span>Three distinct roles: Admin, Editor, Viewer</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><FileText size={18} /></div>
              <span>Full article CRUD with role-based access</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><Zap size={18} /></div>
              <span>Real-time UI updates & feedback</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-card-subtitle">Sign in to your account to continue</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-divider"><span>Demo Accounts</span></div>

          <div className="auth-demo">
            <div className="auth-demo-buttons">
              <button className="auth-demo-btn" type="button" onClick={() => fillDemo("admin")}>
                <span className="badge badge-admin">Admin</span>
              </button>
              <button className="auth-demo-btn" type="button" onClick={() => fillDemo("editor")}>
                <span className="badge badge-editor">Editor</span>
              </button>
              <button className="auth-demo-btn" type="button" onClick={() => fillDemo("viewer")}>
                <span className="badge badge-viewer">Viewer</span>
              </button>
            </div>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
