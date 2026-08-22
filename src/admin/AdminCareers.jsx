import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";

const BLANK = {
  id: "",
  title: "",
  dept: "",
  type: "Full-time",
  location: "",
};

export default function AdminCareers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("job_postings").select("*").order("sort_order");
    if (!error) setJobs(data || []);
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

  function openEdit(j) {
    setEditing({ ...j });
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
      dept: editing.dept,
      type: editing.type || "Full-time",
      location: editing.location,
    };
    if (editing.id) payload.id = editing.id;
    if (!editing.id) payload.sort_order = jobs.length;

    const { error } = await supabase.from("job_postings").upsert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEditing(null);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this job posting? This can't be undone.")) return;
    await supabase.from("job_postings").delete().eq("id", id);
    load();
  }

  async function move(idx, dir) {
    const target = idx + dir;
    if (target < 0 || target >= jobs.length) return;
    const reordered = [...jobs];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    setJobs(reordered);
    // Persist new sort_order for the two swapped rows.
    await Promise.all(
      reordered.map((j, i) =>
        supabase.from("job_postings").update({ sort_order: i }).eq("id", j.id)
      )
    );
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Careers</h1>
        <div className="admin-notice">
          Supabase isn't connected yet. Connect it to manage job postings — see{" "}
          <code>supabase/README.md</code>.
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Careers</h1>
      <p className="admin-sub">Job openings shown on the public Careers page.</p>

      {!editing ? (
        <>
          <div className="admin-toolbar">
            <div className="spacer" />
            <button className="admin-btn admin-btn-primary" onClick={openNew}>+ Add Job Posting</button>
          </div>

          <div className="admin-card" style={{ padding: 0 }}>
            {loading ? (
              <div className="admin-empty">Loading…</div>
            ) : jobs.length === 0 ? (
              <div className="admin-empty">No job postings yet. Click "Add Job Posting" to get started.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j, idx) => (
                    <tr key={j.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button className="admin-btn admin-btn-sm" disabled={idx === 0} onClick={() => move(idx, -1)}>↑</button>
                          <button className="admin-btn admin-btn-sm" disabled={idx === jobs.length - 1} onClick={() => move(idx, 1)}>↓</button>
                        </div>
                      </td>
                      <td>{j.title}</td>
                      <td>{j.dept}</td>
                      <td>{j.type}</td>
                      <td>{j.location}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-btn admin-btn-sm" onClick={() => openEdit(j)}>Edit</button>
                          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(j.id)}>Delete</button>
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
              <label>Job Title *</label>
              <input className="admin-input" required value={editing.title} onChange={(e) => updateField("title", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Department *</label>
              <input className="admin-input" required placeholder="e.g. Engineering" value={editing.dept} onChange={(e) => updateField("dept", e.target.value)} />
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label>Type</label>
              <select className="admin-select" value={editing.type} onChange={(e) => updateField("type", e.target.value)}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Location *</label>
              <input className="admin-input" required placeholder="e.g. Sharjah" value={editing.location} onChange={(e) => updateField("location", e.target.value)} />
            </div>
          </div>

          {error && <div className="admin-error">{error}</div>}

          <div className="admin-savebar">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Job Posting"}
            </button>
            <button className="admin-btn" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
    </>
  );
}
