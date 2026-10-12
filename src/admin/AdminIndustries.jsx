import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import ImageUploadField from "./ImageUploadField";
import { dbError } from "./dbError";

const TABLE = "industries";
const BLANK = { id: "", title: "", image: "" };

function slugId(title) {
  return "ind-" + (title || "sector").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
}

export default function AdminIndustries() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from(TABLE).select("*").order("sort_order");
    if (error) setError(dbError(error));
    else { setRows(data || []); setError(""); }
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!editing.image) { setError("Please upload a picture for this sector."); return; }
    setSaving(true);
    setError("");
    const isNew = !editing.id;
    const payload = { id: editing.id || slugId(editing.title), title: editing.title, image: editing.image };
    if (isNew) payload.sort_order = rows.length;
    const { error } = await supabase.from(TABLE).upsert(payload);
    setSaving(false);
    if (error) { setError(dbError(error)); return; }
    setEditing(null);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this sector from the home page? This can't be undone.")) return;
    await supabase.from(TABLE).delete().eq("id", id);
    load();
  }

  async function move(idx, dir) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const reordered = [...rows];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    setRows(reordered);
    await Promise.all(reordered.map((r, i) => supabase.from(TABLE).update({ sort_order: i }).eq("id", r.id)));
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Sectors We Serve</h1>
        <div className="admin-notice">Supabase isn't connected yet — see <code>supabase/README.md</code>.</div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Sectors We Serve</h1>
      <p className="admin-sub">The sliding sector cards on the home page (picture + name). Use ↑ ↓ to change the order.</p>

      {!editing ? (
        <>
          <div className="admin-toolbar">
            <div className="spacer" />
            <button className="admin-btn admin-btn-primary" onClick={() => { setEditing({ ...BLANK }); setError(""); }}>+ Add Sector</button>
          </div>
          {error && <div className="admin-error" style={{ marginBottom: 12 }}>{error}</div>}
          <div className="admin-card" style={{ padding: 0 }}>
            {loading ? (
              <div className="admin-empty">Loading…</div>
            ) : rows.length === 0 ? (
              error ? null : <div className="admin-empty">
                No sectors in the CMS yet — the website is showing its built-in list.
                Run <code>supabase/migration_site_content.sql</code> to load the current sectors here, or add one.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr><th></th><th>Picture</th><th>Sector</th><th></th></tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button className="admin-btn admin-btn-sm" disabled={idx === 0} onClick={() => move(idx, -1)}>↑</button>
                          <button className="admin-btn admin-btn-sm" disabled={idx === rows.length - 1} onClick={() => move(idx, 1)}>↓</button>
                        </div>
                      </td>
                      <td>{r.image ? <img className="admin-thumb" src={r.image} alt="" /> : "—"}</td>
                      <td>{r.title}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-btn admin-btn-sm" onClick={() => { setEditing({ ...r }); setError(""); }}>Edit</button>
                          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
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
          <div className="admin-field">
            <label>Sector name *</label>
            <input className="admin-input" required placeholder="e.g. Hotels & Hospitality" value={editing.title}
              onChange={(e) => setEditing((x) => ({ ...x, title: e.target.value }))} />
          </div>
          <ImageUploadField label="Picture *" folder="industries" value={editing.image}
            onChange={(url) => setEditing((x) => ({ ...x, image: url }))} />
          <div className="admin-hint">Landscape photos work best (about 520 × 300 px or larger).</div>
          {error && <div className="admin-error">{error}</div>}
          <div className="admin-savebar">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Sector"}</button>
            <button className="admin-btn" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
    </>
  );
}
