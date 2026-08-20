import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import ImageUploadField from "./ImageUploadField";

const SYSTEMS = [
  { key: "fire-fighting", label: "Fire Fighting Systems", groups: true },
  { key: "fire-alarm", label: "Fire Alarm Systems", groups: false },
  { key: "voice-evacuation", label: "Voice Evacuation", groups: false },
  { key: "emergency-lighting", label: "Emergency Lighting", groups: false },
  { key: "elv", label: "ELV Systems", groups: false },
  { key: "smoke-management", label: "Smoke Management", groups: false },
];

export default function AdminSystems() {
  const [systemKey, setSystemKey] = useState(SYSTEMS[0].key);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [groupTitle, setGroupTitle] = useState("");
  const [pendingUrl, setPendingUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const current = SYSTEMS.find((s) => s.key === systemKey);

  async function load(key) {
    setLoading(true);
    const { data, error } = await supabase
      .from("system_images")
      .select("*")
      .eq("system_key", key)
      .order("group_order")
      .order("sort_order");
    if (!error) setImages(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load(systemKey);
    else setLoading(false);
    setAdding(false);
    setName("");
    setGroupTitle("");
    setPendingUrl("");
  }, [systemKey]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!pendingUrl || !name) return;
    setSaving(true);
    await supabase.from("system_images").insert({
      system_key: systemKey,
      group_title: current.groups ? groupTitle : "",
      name,
      src: pendingUrl,
    });
    setSaving(false);
    setAdding(false);
    setName("");
    setGroupTitle("");
    setPendingUrl("");
    load(systemKey);
  }

  async function handleDelete(id) {
    if (!confirm("Remove this image?")) return;
    await supabase.from("system_images").delete().eq("id", id);
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

  return (
    <>
      <h1 className="admin-h1">Systems &amp; Solutions</h1>
      <p className="admin-sub">Manage the equipment gallery images shown on each systems page.</p>

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
        <button className="admin-btn admin-btn-primary" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add Image"}
        </button>
      </div>

      {adding && (
        <form className="admin-card" onSubmit={handleAdd}>
          {current.groups && (
            <div className="admin-field">
              <label>Group (e.g. "Fire Pump Sets")</label>
              <input className="admin-input" required value={groupTitle} onChange={(e) => setGroupTitle(e.target.value)} />
            </div>
          )}
          <div className="admin-field">
            <label>Image Name / Caption</label>
            <input className="admin-input" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <ImageUploadField label="Image" folder="systems" value={pendingUrl} onChange={setPendingUrl} />
          <div className="admin-savebar">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving || !pendingUrl}>
              {saving ? "Saving…" : "Add to Gallery"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-card" style={{ padding: 0 }}>
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : images.length === 0 ? (
          <div className="admin-empty">
            No CMS images for this system yet — the page currently shows its bundled default gallery.
            Add an image above, or run the seed script to import the existing gallery.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                {current.groups && <th>Group</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img.id}>
                  <td><img className="admin-thumb" src={img.src} alt="" /></td>
                  <td>{img.name}</td>
                  {current.groups && <td>{img.group_title}</td>}
                  <td>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(img.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
