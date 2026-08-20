import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import ImageUploadField from "./ImageUploadField";

const BLANK = {
  title: "",
  ref: "",
  category: "",
  status: "Completed",
  location: "",
  year: "",
  client: "",
  scope: "",
  tagsText: "",
  image: "",
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("sort_order");
    if (!error) setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  function openNew() {
    setEditing({ ...BLANK });
    setError("");
  }

  function openEdit(p) {
    setEditing({ ...p, tagsText: (p.tags || []).join(", ") });
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
      title: editing.title,
      ref: editing.ref,
      category: editing.category,
      status: editing.status,
      location: editing.location,
      year: editing.year,
      client: editing.client,
      scope: editing.scope,
      image: editing.image,
      tags: editing.tagsText.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editing.id) payload.id = editing.id;

    const { error } = await supabase.from("projects").upsert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEditing(null);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project? This can't be undone.")) return;
    await supabase.from("projects").delete().eq("id", id);
    load();
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Projects</h1>
        <div className="admin-notice">
          Supabase isn't connected yet. Connect it to manage projects here — see{" "}
          <code>supabase/README.md</code>.
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Projects</h1>
      <p className="admin-sub">Shown on the Projects page, filterable by category.</p>

      {!editing ? (
        <>
          <div className="admin-toolbar">
            <div className="spacer" />
            <button className="admin-btn admin-btn-primary" onClick={openNew}>+ Add Project</button>
          </div>

          <div className="admin-card" style={{ padding: 0 }}>
            {loading ? (
              <div className="admin-empty">Loading…</div>
            ) : projects.length === 0 ? (
              <div className="admin-empty">
                No projects yet. Click "Add Project", or run the seed script to import the existing portfolio.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td>{p.image && <img className="admin-thumb" src={p.image} alt="" />}</td>
                      <td>{p.title}</td>
                      <td>{p.category}</td>
                      <td>{p.location}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-btn admin-btn-sm" onClick={() => openEdit(p)}>Edit</button>
                          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
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
              <label>Project Title *</label>
              <input className="admin-input" required value={editing.title} onChange={(e) => updateField("title", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Reference No.</label>
              <input className="admin-input" value={editing.ref} onChange={(e) => updateField("ref", e.target.value)} />
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label>Category *</label>
              <input className="admin-input" required placeholder="e.g. Malls & Shopping Centers" value={editing.category} onChange={(e) => updateField("category", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Status</label>
              <select className="admin-select" value={editing.status} onChange={(e) => updateField("status", e.target.value)}>
                <option>Completed</option>
                <option>Ongoing</option>
              </select>
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label>Location</label>
              <input className="admin-input" value={editing.location} onChange={(e) => updateField("location", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Year</label>
              <input className="admin-input" value={editing.year} onChange={(e) => updateField("year", e.target.value)} />
            </div>
          </div>

          <div className="admin-field">
            <label>Client</label>
            <input className="admin-input" value={editing.client} onChange={(e) => updateField("client", e.target.value)} />
          </div>

          <div className="admin-field">
            <label>Scope of Work</label>
            <textarea className="admin-textarea" value={editing.scope} onChange={(e) => updateField("scope", e.target.value)} />
          </div>

          <div className="admin-field">
            <label>Brand Tags (comma separated)</label>
            <input className="admin-input" placeholder="Honeywell, Teknoware, Waterfall" value={editing.tagsText} onChange={(e) => updateField("tagsText", e.target.value)} />
          </div>

          <ImageUploadField label="Project Image" folder="projects" value={editing.image} onChange={(url) => updateField("image", url)} />

          {error && <div className="admin-error">{error}</div>}

          <div className="admin-savebar">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Project"}
            </button>
            <button className="admin-btn" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
    </>
  );
}
