import "../../styles/al-shop.css";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../components/shop/Icons.jsx";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { supabaseConfigured } from "../../lib/supabase";

export default function SignIn() {
  const { signIn } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <div className="al-shop-scope">
      <section className="page-hero bg-ambient">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a><span className="sep">/</span><span>Sign In</span></div>
          <span className="eyebrow" style={{ color: "var(--flame-400)" }}>MY ACCOUNT</span>
          <h1>Sign In</h1>
          <p className="lead">Sign in to track quote requests, manage your details and see your order history.</p>
        </div>
      </section>

      <main className="section">
        <div className="container" style={{ maxWidth: 460 }}>
          {!supabaseConfigured && (
            <div className="form-notice" style={{ marginBottom: 20 }}>
              Customer accounts aren&rsquo;t connected yet. See <code>supabase/README.md</code> to finish setup.
            </div>
          )}

          <form className="form-card" onSubmit={handleSubmit}>
            <div className="field">
              <label><Icon.mail style={{ width: 14, height: 14, display: "inline", marginRight: 6, verticalAlign: -2 }} />Email *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label><Icon.lock style={{ width: 14, height: 14, display: "inline", marginRight: 6, verticalAlign: -2 }} />Password *</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting || !supabaseConfigured}>
              {submitting ? "Signing in…" : "Sign In"}
            </button>

            <p style={{ marginTop: 18, fontSize: 13.5, color: "var(--slate-500)", textAlign: "center" }}>
              New here? <Link to="/account/register" style={{ color: "var(--flame-500)", fontWeight: 600 }}>Create an account</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
