import { useState } from "react";
import { Navigate } from "react-router-dom";
import "./admin.css";
import { useAuth } from "./AuthContext";
import { supabaseConfigured } from "../lib/supabase";

export default function AdminLogin() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <div className="admin-scope admin-login-wrap">
      <div className="admin-login-card">
        <h1>Al Nawras CMS</h1>
        <p className="sub">Sign in to manage products, projects, systems &amp; home images.</p>

        {!supabaseConfigured && (
          <div className="admin-notice">
            Supabase isn't connected yet. Add <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file, run{" "}
            <code>supabase/schema.sql</code> in your project, and create an admin user under
            Authentication → Users before signing in.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Email</label>
            <input
              className="admin-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input
              className="admin-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="admin-btn admin-btn-primary" type="submit" disabled={busy} style={{ width: "100%", justifyContent: "center" }}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
          {error && <div className="admin-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
