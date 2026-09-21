import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import ImageUploadField from "./ImageUploadField";

const SYSTEMS = [
  { key: "fire-fighting", label: "Fire Fighting Systems", chip: "FIRE FIGHTING", groups: true },
  { key: "fire-alarm", label: "Fire Alarm Systems", chip: "FIRE ALARM", groups: false },
  { key: "voice-evacuation", label: "Voice Evacuation", chip: "VOICE EVACUATION", groups: false },
  { key: "emergency-lighting", label: "Emergency Lighting", chip: "EMERGENCY LIGHTING", groups: false },
  { key: "elv", label: "ELV Systems", chip: "ELV & SECURITY", groups: false },
  { key: "smoke-management", label: "Smoke Management", chip: "SMOKE MANAGEMENT", groups: false },
];

const EMPTY_FORM = { group_title: "", name: "", brand: "", description: "", src: "" };

// The two columns added by supabase/migrations/001_system_images_card_fields.sql
const MIGRATION_HINT =
  "The database is missing the description/brand columns. Run supabase/migrations/001_system_images_card_fields.sql in the Supabase SQL Editor, then try again.";
const friendlyError = (error) =>
  /description|brand/i.test(error.message || "") ? MIGRATION_HINT : error.message || "Something went wrong.";

/** One card — same look as the picture cards on the website's Systems & Solutions pages. */
function SystemCardPreview({ img, chip, onEdit, onDelete }) {
  return (
    <div className="admin-sys-card">
      <div className="thumb">
        {img.brand && <span className="brand-tag">{img.brand}</span>}
        <img src={img.src} alt={img.name} loading="lazy" />
      </div>
      <div className="body">
        <span className="chip">{chip}</span>
        <h3>{img.name}</h3>
        {img.description ? <p className="desc">{img.description}</p> : <p className="desc empty">No description</p>}
        <div className="actions">
          <button className="admin-btn admin-btn-sm" onClick={onEdit}>Edit</button>
          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/** Add / edit form — same fields for both. */
function SystemForm({ form, setForm, showGroup, groupOptions, submitLabel, busy, error, onSubmit, onCancel, imageLabel }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <form className="admin-card" onSubmit={onSubmit}>
      {showGroup && (
        <div className="admin-field">
          <label>Group (e.g. "Fire Pump Sets")</label>
          <input className="admin-input" required list="admin-sys-groups" value={form.group_title} onChange={set("group_title")} />
          <datalist id="admin-sys-groups">
            {groupOptions.map((g) => <option key={g} value={g} />)}
          </datalist>
        </div>
      )}
      <div className="admin-field-row">
        <div className="admin-field">
          <label>Card title</label>
          <input className="admin-input" required value={form.name} onChange={set("name")} />
        </div>
        <div className="admin-field">
          <label>Brand tag (optional, e.g. Honeywell)</label>
          <input className="admin-input" value={form.brand} onChange={set("brand")} />
        </div>
      </div>
      <div className="admin-field">
        <label>Description (optional — shown under the title, about 2 lines)</label>
        <textarea className="admin-textarea" value={form.description} onChange={set("description")} />
      </div>
      <ImageUploadField
        label={imageLabel}
        folder="systems"
        value={form.src}
        onChange={(url) => setForm((f) => ({ ...f, src: url }))}
      />
      <div className="admin-hint">Tip: use a square picture on a white background so it fills the card.</div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-savebar">
        <button className="admin-btn admin-btn-primary" type="submit" disabled={busy || !form.src}>
          {busy ? "Saving…" : submitLabel}
        </button>
        <button className="admin-btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function AdminSystems() {
  const [systemKey, setSystemKey] = useState(SYSTEMS[0].key);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  const current = SYSTEMS.find((s) => s.key === systemKey);

  async function load(key) {
    setLoading(true);
    setLoadError("");
    const { data, error: err } = await supabase
      .from("system_images")
      .select("*")
      .eq("system_key", key)
      .order("group_order")
      .order("sort_order");
    if (err) setLoadError(err.message || "Could not load the cards.");
    else setImages(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load(systemKey);
    else setLoading(false);
    setAdding(false);
    setAddForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
  }, [systemKey]);

  // Groups in display order: [{ title, order, items }]
  const groups = [];
  for (const img of images) {
    const title = img.group_title || "";
    let g = groups.find((x) => x.title === title);
    if (!g) groups.push((g = { title, order: img.group_order ?? 0, items: [] }));
    g.items.push(img);
  }

  // Where a card being placed in `groupTitle` should go: same group order if the group exists,
  // otherwise a new group at the end; last position within the group.
  function placement(groupTitle, ignoreId) {
    const title = current.groups ? groupTitle.trim() : "";
    const rest = images.filter((i) => i.id !== ignoreId);
    const inGroup = rest.filter((i) => (i.group_title || "") === title);
    const group_order = inGroup.length
      ? inGroup[0].group_order ?? 0
      : rest.reduce((m, i) => Math.max(m, (i.group_order ?? 0) + 1), 0);
    const sort_order = inGroup.reduce((m, i) => Math.max(m, (i.sort_order ?? 0) + 1), 0);
    return { group_title: title, group_order, sort_order };
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!addForm.src || !addForm.name) return;
    setSaving(true);
    setError("");
    const { error: err } = await supabase.from("system_images").insert({
      system_key: systemKey,
      ...placement(addForm.group_title),
      name: addForm.name.trim(),
      brand: addForm.brand.trim() || null,
      description: addForm.description.trim() || null,
      src: addForm.src,
    });
    setSaving(false);
    if (err) return setError(friendlyError(err));
    setAdding(false);
    setAddForm(EMPTY_FORM);
    load(systemKey);
  }

  function startEdit(img) {
    setAdding(false);
    setError("");
    setEditingId(img.id);
    setEditForm({
      group_title: img.group_title || "",
      name: img.name || "",
      brand: img.brand || "",
      description: img.description || "",
      src: img.src || "",
    });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    const original = images.find((i) => i.id === editingId);
    if (!original || !editForm.name || !editForm.src) return;
    setSaving(true);
    setError("");
    const patch = {
      name: editForm.name.trim(),
      brand: editForm.brand.trim() || null,
      description: editForm.description.trim() || null,
      src: editForm.src,
    };
    // Only move the card if its group actually changed.
    if (current.groups && editForm.group_title.trim() !== (original.group_title || "")) {
      Object.assign(patch, placement(editForm.group_title, original.id));
    }
    const { error: err } = await supabase.from("system_images").update(patch).eq("id", editingId);
    setSaving(false);
    if (err) return setError(friendlyError(err));
    setEditingId(null);
    load(systemKey);
  }

  async function handleDelete(id) {
    if (!confirm("Remove this card?")) return;
    const { error: err } = await supabase.from("system_images").delete().eq("id", id);
    if (err) return setError(friendlyError(err));
    if (editingId === id) setEditingId(null);
    load(systemKey);
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Systems &amp; Solutions</h1>
        <div className="admin-notice">
          Supabase isn't connected yet. Connect it to manage these images — see{" "}
          <code>supabase/README.md</code>.
        </div>
      </>
    );
  }

  const groupOptions = groups.map((g) => g.title).filter(Boolean);

  const renderCard = (img, chip) =>
    editingId === img.id ? (
      <div key={img.id} className="admin-sys-edit">
        <SystemForm
          form={editForm}
          setForm={setEditForm}
          showGroup={current.groups}
          groupOptions={groupOptions}
          submitLabel="Save changes"
          imageLabel="Picture (upload to replace)"
          busy={saving}
          error={error}
          onSubmit={handleSaveEdit}
          onCancel={() => { setEditingId(null); setError(""); }}
        />
      </div>
    ) : (
      <SystemCardPreview key={img.id} img={img} chip={chip} onEdit={() => startEdit(img)} onDelete={() => handleDelete(img.id)} />
    );

  return (
    <>
      <h1 className="admin-h1">Systems &amp; Solutions</h1>
      <p className="admin-sub">
        Manage the picture cards shown on each systems page. The cards below look the same as on the website.
      </p>

      <div className="admin-pill-group" style={{ marginBottom: 20 }}>
        {SYSTEMS.map((s) => (
          <button
            key={s.key}
            className={`admin-pill ${systemKey === s.key ? "active" : ""}`}
            onClick={() => setSystemKey(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="admin-toolbar">
        <div className="spacer" />
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => { setAdding((v) => !v); setEditingId(null); setError(""); }}
        >
          {adding ? "Cancel" : "+ Add Card"}
        </button>
      </div>

      {adding && (
        <SystemForm
          form={addForm}
          setForm={setAddForm}
          showGroup={current.groups}
          groupOptions={groupOptions}
          submitLabel="Add to Gallery"
          imageLabel="Picture"
          busy={saving}
          error={error}
          onSubmit={handleAdd}
          onCancel={() => { setAdding(false); setError(""); }}
        />
      )}

      {!adding && editingId === null && error && <div className="admin-error" style={{ marginBottom: 14 }}>{error}</div>}

      {loadError && (
        <div className="admin-error" style={{ marginBottom: 14 }}>Couldn't load the cards: {loadError}</div>
      )}

      {loading ? (
        <div className="admin-card"><div className="admin-empty">Loading…</div></div>
      ) : loadError ? null : images.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            No CMS cards for this system yet — the page currently shows its bundled default gallery.
            Add a card above, or import the current gallery with{" "}
            <code>node --env-file=.env supabase/seed-system-images.mjs --apply</code>.
          </div>
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.title || "_"} style={{ marginBottom: 26 }}>
            {current.groups && g.title && <h2 className="admin-group-title">{g.title}</h2>}
            <div className="admin-sys-grid">
              {g.items.map((img) => renderCard(img, current.groups && g.title ? g.title.toUpperCase() : current.chip))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
