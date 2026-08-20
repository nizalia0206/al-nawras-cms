import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { CATEGORIES, SUPPLIERS } from "../data/products";
import ImageUploadField from "./ImageUploadField";

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const BLANK = {
  id: "",
  name: "",
  supplier: Object.keys(SUPPLIERS)[0],
  category: CATEGORIES[0].id,
  price: "",
  price_unit: "",
  short: "",
  description: "",
  images: [],
  specs: [],
  tags: [],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} shape = editing/creating
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("sort_order");
    if (!error) setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  function openNew() {
    setEditing({ ...BLANK, tagsText: "", specsList: [] });
    setError("");
  }

  function openEdit(p) {
    setEditing({
      ...p,
      price: p.price ?? "",
      price_unit: p.price_unit ?? "",
      tagsText: (p.tags || []).join(", "),
      specsList: (p.specs || []).map(([label, val]) => ({ label, val })),
    });
    setError("");
  }

  function closeForm() {
    setEditing(null);
  }

  function updateField(key, value) {
    setEditing((e) => ({ ...e, [key]: value }));
  }

  function addImage(url) {
    setEditing((e) => ({ ...e, images: [...(e.images || []), url] }));
  }

  function removeImage(idx) {
    setEditing((e) => ({ ...e, images: e.images.filter((_, i) => i !== idx) }));
  }

  function addSpec() {
    setEditing((e) => ({ ...e, specsList: [...e.specsList, { label: "", val: "" }] }));
  }

  function updateSpec(idx, key, value) {
    setEditing((e) => ({
      ...e,
      specsList: e.specsList.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    }));
  }

  function removeSpec(idx) {
    setEditing((e) => ({ ...e, specsList: e.specsList.filter((_, i) => i !== idx) }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const id = editing.id || slug(editing.name);
    const payload = {
      id,
      name: editing.name,
      supplier: editing.supplier,
      category: editing.category,
      price: editing.price === "" ? null : Number(editing.price),
      price_unit: editing.price_unit || null,
      short: editing.short,
      description: editing.description,
      images: editing.images || [],
      specs: (editing.specsList || []).filter((s) => s.label).map((s) => [s.label, s.val]),
      tags: editing.tagsText.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const { error } = await supabase.from("products").upsert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEditing(null);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Products</h1>
        <div className="admin-notice">
          Supabase isn't connected yet. Connect it to manage products here — see{" "}
          <code>supabase/README.md</code>.
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Products</h1>
      <p className="admin-sub">These changes go live on the site immediately — no redeploy needed.</p>

      {!editing ? (
        <>
          <div className="admin-toolbar">
            <div className="spacer" />
            <button className="admin-btn admin-btn-primary" onClick={openNew}>+ Add Product</button>
          </div>

          <div className="admin-card" style={{ padding: 0 }}>
            {loading ? (
              <div className="admin-empty">Loading…</div>
            ) : products.length === 0 ? (
              <div className="admin-empty">
                No products yet. Click "Add Product", or run the seed script to import the existing catalog.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Supplier</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.images?.[0] && <img className="admin-thumb" src={p.images[0]} alt="" />}</td>
                      <td>{p.name}</td>
                      <td>{SUPPLIERS[p.supplier]?.name || p.supplier}</td>
                      <td>{CATEGORIES.find((c) => c.id === p.category)?.name || p.category}</td>
                      <td>{p.price != null ? `AED ${p.price.toLocaleString()}` : "—"}</td>
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
              <label>Product Name *</label>
              <input className="admin-input" required value={editing.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Price (AED)</label>
              <input className="admin-input" type="number" step="0.01" value={editing.price} onChange={(e) => updateField("price", e.target.value)} />
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label>Price Unit (optional, e.g. "/ meter")</label>
              <input className="admin-input" value={editing.price_unit || ""} onChange={(e) => updateField("price_unit", e.target.value)} />
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label>Supplier</label>
              <select className="admin-select" value={editing.supplier} onChange={(e) => updateField("supplier", e.target.value)}>
                {Object.entries(SUPPLIERS).map(([key, s]) => (
                  <option key={key} value={key}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Category</label>
              <select className="admin-select" value={editing.category} onChange={(e) => updateField("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-field">
            <label>Short Description</label>
            <input className="admin-input" value={editing.short} onChange={(e) => updateField("short", e.target.value)} />
          </div>

          <div className="admin-field">
            <label>Full Description</label>
            <textarea className="admin-textarea" value={editing.description} onChange={(e) => updateField("description", e.target.value)} />
          </div>

          <div className="admin-field">
            <label>Tags (comma separated)</label>
            <input className="admin-input" value={editing.tagsText} onChange={(e) => updateField("tagsText", e.target.value)} />
          </div>

          <div className="admin-field">
            <label>Specifications</label>
            {editing.specsList.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input className="admin-input" placeholder="Label" value={s.label} onChange={(e) => updateSpec(i, "label", e.target.value)} />
                <input className="admin-input" placeholder="Value" value={s.val} onChange={(e) => updateSpec(i, "val", e.target.value)} />
                <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => removeSpec(i)}>✕</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn-sm" onClick={addSpec}>+ Add Spec</button>
          </div>

          <ImageUploadField label="Add Image" folder="products" value={null} onChange={addImage} />
          {editing.images?.length > 0 && (
            <div className="admin-preview-strip" style={{ marginBottom: 14 }}>
              {editing.images.map((url, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={url} alt="" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", border: "none", background: "#c62828", color: "#fff", fontSize: 11, cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <div className="admin-error">{error}</div>}

          <div className="admin-savebar">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Product"}
            </button>
            <button className="admin-btn" type="button" onClick={closeForm}>Cancel</button>
          </div>
        </form>
      )}
    </>
  );
}
