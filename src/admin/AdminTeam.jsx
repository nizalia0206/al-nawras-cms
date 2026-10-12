import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { dbError } from "./dbError";

const BLANK = {
  id: "",
  name: "",
  role: "",
  phone: "",
  icon: "person",
  highlight: false,
};

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("team_members").select("*").order("sort_order");
    if (!error) setTeam(data || []);
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

    const id = editing.id || slug(editing.name);
    const payload = {
      id,
      name: editing.name,
      role: editing.role,
      phone: editing.phone,
      icon: editing.icon,
      highlight: !!editing.highlight,
    };

    const { error } = await supabase.from("team_members").upsert(payload);
    setSaving(false);
    if (error) {
      setError(dbError(error));
      return;
    }
    setEditing(null);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this team member? This can't be undone.")) return;
    await supabase.from("team_members").delete().eq("id", id);
    load();
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Our Team</h1>
        <div className="admin-notice">
          Supabase isn't connected yet. Connect it to manage the team page — see{" "}
          <code>supabase/README.md</code>.
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Our Team</h1>
      <p className="admin-sub">Shown on the "Our Team" page under About.</p>

      {!editing ? (
        <>
          <div className="admin-toolbar">
            <div className="spacer" />
            <button className="admin-btn admin-btn-primary" onClick={openNew}>+ Add Team Member</button>
          </div>

          <div className="admin-card" style={{ padding: 0 }}>
            {loading ? (
              <div className="admin-empty">Loading…</div>
            ) : team.length === 0 ? (
              <div className="admin-empty">No team members yet. Click "Add Team Member" to get started.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Icon</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}{p.highlight && <span style={{ marginLeft: 8, fontSize: 11, color: "#e2580f", fontWeight: 700 }}>★</span>}</td>
                      <td>{p.role}</td>
                      <td>{p.phone}</td>
                      <td style={{ textTransform: "capitalize" }}>{p.icon}</td>
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
              <label>Full Name *</label>
              <input className="admin-input" required value={editing.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Role / Title *</label>
              <input className="admin-input" required value={editing.role} onChange={(e) => updateField("role", e.target.value)} />
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label>Phone / Email</label>
              <input className="admin-input" placeholder="+971 5X XXX XXXX or email" value={editing.phone} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Icon</label>
              <select className="admin-select" value={editing.icon} onChange={(e) => updateField("icon", e.target.value)}>
                <option value="person">Person</option>
                <option value="hardhat">Hard Hat</option>
              </select>
            </div>
          </div>

          <div className="admin-field">
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={!!editing.highlight} onChange={(e) => updateField("highlight", e.target.checked)} />
              Highlight this member on the team page
            </label>
          </div>

          {error && <div className="admin-error">{error}</div>}

          <div className="admin-savebar">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Team Member"}
            </button>
            <button className="admin-btn" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
    </>
  );
}
