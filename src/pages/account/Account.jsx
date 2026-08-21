import "../../styles/al-shop.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/shop/Icons.jsx";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function Account() {
  const { session, profile, signOut, updateProfile } = useCustomerAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
    company: profile?.company || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    const { error } = await updateProfile({
      full_name: form.fullName,
      phone: form.phone,
      company: form.company,
    });
    setSaving(false);
    if (error) setError(error.message);
    else setSaved(true);
  }

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="al-shop-scope">
      <section className="page-hero bg-ambient">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a><span className="sep">/</span><span>My Account</span></div>
          <span className="eyebrow" style={{ color: "var(--flame-400)" }}>MY ACCOUNT</span>
          <h1>Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
          <p className="lead">{session?.user?.email}</p>
        </div>
      </section>

      <main className="section">
        <div className="container" style={{ maxWidth: 560 }}>
          <form className="form-card" onSubmit={handleSave}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon.user style={{ width: 18, height: 18 }} /> Your Details
            </h3>

            <div className="field">
              <label>Full Name</label>
              <input type="text" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Email</label>
                <input type="email" value={session?.user?.email || ""} disabled />
              </div>
              <div className="field">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>

            <div className="field">
              <label>Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
            </div>

            {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
            {saved && <div className="form-success" style={{ marginBottom: 16 }}>Your details have been updated.</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleSignOut}
            className="btn btn-outline-navy btn-block"
            style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Icon.logout style={{ width: 16, height: 16 }} /> Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
