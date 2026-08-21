import "../../styles/al-shop.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { supabaseConfigured } from "../../lib/supabase";

export default function Register() {
  const { register } = useCustomerAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error, needsEmailConfirmation } = await register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      company: form.company,
      password: form.password,
    });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }
    if (needsEmailConfirmation) {
      setNeedsConfirmation(true);
      return;
    }
    navigate("/account", { replace: true });
  }

  return (
    <div className="al-shop-scope">
      <section className="page-hero bg-ambient">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a><span className="sep">/</span><span>Register</span></div>
          <span className="eyebrow" style={{ color: "var(--flame-400)" }}>MY ACCOUNT</span>
          <h1>Create Your Account</h1>
          <p className="lead">Register to save your details, track quote requests and reorder faster next time.</p>
        </div>
      </section>

      <main className="section">
        <div className="container" style={{ maxWidth: 560 }}>
          {!supabaseConfigured && (
            <div className="form-notice" style={{ marginBottom: 20 }}>
              Customer accounts aren&rsquo;t connected yet. See <code>supabase/README.md</code> to finish setup.
            </div>
          )}

          {needsConfirmation ? (
            <div className="form-card">
              <div className="form-success">
                Almost there — we&rsquo;ve sent a confirmation link to <strong>{form.email}</strong>.
                Confirm your email, then sign in to access your account.
              </div>
              <Link to="/account/sign-in" className="btn btn-primary btn-block" style={{ marginTop: 18 }}>
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="field">
                <label>Full Name *</label>
                <input type="text" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Email *</label>
                  <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label>Company (optional)</label>
                <input type="text" value={form.company} onChange={(e) => update("company", e.target.value)} />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Password *</label>
                  <input type="password" required value={form.password} onChange={(e) => update("password", e.target.value)} />
                </div>
                <div className="field">
                  <label>Confirm Password *</label>
                  <input type="password" required value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
                </div>
              </div>

              {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting || !supabaseConfigured}>
                {submitting ? "Creating account…" : "Create Account"}
              </button>

              <p style={{ marginTop: 18, fontSize: 13.5, color: "var(--slate-500)", textAlign: "center" }}>
                Already have an account? <Link to="/account/sign-in" style={{ color: "var(--flame-500)", fontWeight: 600 }}>Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
