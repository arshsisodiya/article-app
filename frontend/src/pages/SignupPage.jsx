import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield, User, Check, X as XIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import "./LoginPage.css";

function getPasswordStrength(pw) {
  const rules = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };

  const score = Object.values(rules).filter(Boolean).length;
  let level = "weak";
  if (score >= 5) level = "strong";
  else if (score >= 4) level = "good";
  else if (score >= 3) level = "fair";

  return { rules, score, level };
}

export default function SignupPage() {
  const { isAuthenticated, signup, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await signup(name, email, password);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  }

  const strengthLabels = { weak: "Weak", fair: "Fair", good: "Good", strong: "Strong" };

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
          <h1>Join the Platform</h1>
          <p>
            Create a viewer account to start reading articles.
            Admins can upgrade your role later.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-card-subtitle">Sign up as a viewer to get started</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="signup-name">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="signup-email">Email</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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

              {password && (
                <div className="password-strength">
                  <div className="password-strength-bar">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`password-strength-segment${
                          i <= strength.score ? ` active ${strength.level}` : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="password-strength-label">
                    Password strength: {strengthLabels[strength.level]}
                  </span>

                  <div className="password-rules">
                    <PasswordRule met={strength.rules.length} label="At least 8 characters" />
                    <PasswordRule met={strength.rules.upper} label="One uppercase letter" />
                    <PasswordRule met={strength.rules.lower} label="One lowercase letter" />
                    <PasswordRule met={strength.rules.number} label="One number" />
                    <PasswordRule met={strength.rules.special} label="One special character" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading || strength.score < 5}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function PasswordRule({ met, label }) {
  return (
    <div className={`password-rule${met ? " met" : ""}`}>
      {met ? <Check size={12} /> : <XIcon size={12} />}
      <span>{label}</span>
    </div>
  );
}
