import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import ImageUploadField from "./ImageUploadField";
import { dbError } from "./dbError";

const TABLE = "brand_partners";
const BLANK = { id: "", name: "", logo: "", supplier: "", height: 40 };

// Product-catalog brand filters on the website (/products?supplier=…)
const SUPPLIERS = [
  ["", "— no link (opens the full catalog) —"],
  ["honeywell", "Honeywell"],
  ["teknoware", "Teknoware"],
  ["waterfall", "Waterfall Fire Pumps"],
  ["h3c", "H3C"],
  ["uranus", "Uranus Cable (Rewire)"],
  ["kdpipes", "KD Pipes"],
];

function newId(name) {
  return (name || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
}

export default function AdminPartners() {
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
    if (!editing.logo) { setError("Please upload the brand's logo."); return; }
    setSaving(true);
    setError("");
    const isNew = !editing.id;
    const payload = {
      id: editing.id || newId(editing.name),
      name: editing.name,
      logo: editing.logo,
      supplier: editing.supplier || null,
      height: Number(editing.height) || 40,
    };
    if (isNew) payload.sort_order = rows.length;
    const { error } = await supabase.from(TABLE).upsert(payload);
    setSaving(false);
    if (error) { setError(dbError(error)); return; }
    setEditing(null);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this brand from the footer logo strip?")) return;
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) setError(dbError(error));
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
        <h1 className="admin-h1">Brand Partners</h1>
        <div className="admin-notice">Supabase isn't connected yet — see <code>supabase/README.md</code>.</div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Brand Partners</h1>
      <p className="admin-sub">The sliding logo strip above the footer on every page. Clicking a logo opens that brand's products.</p>

      {!editing ? (
        <>
          <div className="admin-toolbar">
            <div className="spacer" />
            <button className="admin-btn admin-btn-primary" onClick={() => { setEditing({ ...BLANK }); setError(""); }}>+ Add Brand</button>
          </div>
          {error && <div className="admin-error" style={{ marginBottom: 12 }}>{error}</div>}
          <div className="admin-card" style={{ padding: 0 }}>
            {loading ? (
              <div className="admin-empty">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="admin-empty">No brands yet.</div>
            ) : (
              <table className="admin-table">
                <thead><tr><th></th><th>Logo</th><th>Brand</th><th>Opens</th><th></th></tr></thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button className="admin-btn admin-btn-sm" disabled={idx === 0} onClick={() => move(idx, -1)}>↑</button>
                          <button className="admin-btn admin-btn-sm" disabled={idx === rows.length - 1} onClick={() => move(idx, 1)}>↓</button>
                        </div>
                      </td>
                      <td><img src={r.logo} alt="" style={{ height: 34, maxWidth: 140, objectFit: "contain" }} /></td>
                      <td>{r.name}</td>
                      <td>{(SUPPLIERS.find(([v]) => v === (r.supplier || "")) || ["", r.supplier])[1]}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-btn admin-btn-sm" onClick={() => { setEditing({ ...BLANK, ...r, supplier: r.supplier || "" }); setError(""); }}>Edit</button>
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
          <div className="admin-field-row">
            <div className="admin-field">
              <label>Brand name *</label>
              <input className="admin-input" required value={editing.name} onChange={(e) => setEditing((x) => ({ ...x, name: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Clicking the logo opens</label>
              <select className="admin-select" value={editing.supplier} onChange={(e) => setEditing((x) => ({ ...x, supplier: e.target.value }))}>
                {SUPPLIERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <ImageUploadField label="Logo *" folder="partners" value={editing.logo} onChange={(url) => setEditing((x) => ({ ...x, logo: url }))} />
          <div className="admin-hint">Use a PNG or SVG with a transparent background.</div>
          <div className="admin-field" style={{ marginTop: 14, maxWidth: 260 }}>
            <label>Logo height on the website (px): {editing.height}</label>
            <input type="range" min="20" max="70" value={editing.height} onChange={(e) => setEditing((x) => ({ ...x, height: e.target.value }))} style={{ width: "100%" }} />
            <div className="admin-hint">Wide wordmarks look best at 28–34, square logos at 48–52.</div>
          </div>
          {editing.logo && (
            <div style={{ background: "#fff", border: "1px solid var(--a-line)", borderRadius: 10, padding: 18, display: "inline-block" }}>
              <img src={editing.logo} alt="preview" style={{ height: Number(editing.height) * 1.45, maxWidth: 360, objectFit: "contain" }} />
            </div>
          )}
          {error && <div className="admin-error">{error}</div>}
          <div className="admin-savebar">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Brand"}</button>
            <button className="admin-btn" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
    </>
  );
}
