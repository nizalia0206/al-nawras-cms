import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import ImageUploadField from "./ImageUploadField";

const BLANK = {
  num: "",
  title: "",
  description: "",
  image_url: "",
};

export default function AdminCertifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("certifications").select("*").order("sort_order");
    if (!error) setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  function openNew() {
    const nextNum = String(items.length + 1).padStart(2, "0");
    setEditing({ ...BLANK, num: nextNum });
    setError("");
  }

  function openEdit(p) {
    setEditing({ ...p });
    setError("");
  }

  function updateField(key, value) {
    setEditing((e) => ({ ...e, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      num: editing.num,
      title: editing.title,
      description: editing.description,
      image_url: editing.image_url || null,
    };

    const { error } = await supabase.from("certifications").upsert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEditing(null);
    load();
  }

  async function handleDelete(num) {
    if (!confirm("Remove this certification? This can't be undone.")) return;
    await supabase.from("certifications").delete().eq("num", num);
    load();
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Certifications</h1>
        <div className="admin-notice">
          Supabase isn't connected yet. Connect it to manage certifications — see{" "}
          <code>supabase/README.md</code>.
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Certifications</h1>
      <p className="admin-sub">Shown on the Home page and the Certifications page under About.</p>

      {!editing ? (
        <>
          <div className="admin-toolbar">
            <div className="spacer" />
            <button className="admin-btn admin-btn-primary" onClick={openNew}>+ Add Certification</button>
          </div>

          <div className="admin-card" style={{ padding: 0 }}>
            {loading ? (
              <div className="admin-empty">Loading…</div>
            ) : items.length === 0 ? (
              <div className="admin-empty">No certifications yet. Click "Add Certification" to get started.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>#</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.num}>
                      <td>{c.image_url && <img className="admin-thumb" src={c.image_url} alt="" />}</td>
                      <td>{c.num}</td>
                      <td>{c.title}</td>
                      <td style={{ maxWidth: 340 }}>{c.description}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-btn admin-btn-sm" onClick={() => openEdit(c)}>Edit</button>
                          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(c.num)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <form className="admin-card" onSubmit={handleSave}>
          <div className="admin-field-row">
            <div className="admin-field">
              <label>Number *</label>
              <input className="admin-input" required value={editing.num} onChange={(e) => updateField("num", e.target.value)} />
              <div className="admin-hint">Shown as the badge number, e.g. "01". Must be unique.</div>
            </div>
            <div className="admin-field">
              <label>Title *</label>
              <input className="admin-input" required value={editing.title} onChange={(e) => updateField("title", e.target.value)} />
            </div>
          </div>

          <div className="admin-field">
            <label>Description *</label>
            <textarea className="admin-textarea" required value={editing.description} onChange={(e) => updateField("description", e.target.value)} />
          </div>

          <ImageUploadField
            label="Certificate Image (optional — shown enlarged when clicked)"
            folder="certifications"
            value={editing.image_url}
            onChange={(url) => updateField("image_url", url)}
          />

          {error && <div className="admin-error">{error}</div>}

          <div className="admin-savebar">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Certification"}
            </button>
            <button className="admin-btn" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
    </>
  );
}
