import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { dbError } from "./dbError";
import CATALOG from "./websiteText.json";

// Every piece of text on the website (English + Arabic), with the text currently
// in the website's code as the default. Edits are saved to `site_text` and replace
// the default on the live site; "Reset" goes back to the original wording.

const GROUPS = [
  ["pages.about.overview", "About › Who We Are"],
  ["pages.about.mission", "About › Mission & Vision"],
  ["pages.about.founder", "About › Message from the Founder"],
  ["pages.about.team", "About › Our Team"],
  ["pages.about.certifications", "About › Certifications"],
  ["pages.systems.fireFighting", "Systems › Firefighting"],
  ["pages.systems.fireAlarm", "Systems › Fire Alarm & Voice Evacuation"],
  ["pages.systems.emergencyLighting", "Systems › Emergency Lighting"],
  ["pages.systems.elv", "Systems › ELV"],
  ["pages.systems.smokeManagement", "Systems › Smoke Management"],
  ["pages.products", "Products page"],
  ["pages.productDetail", "Product details page"],
  ["pages.projects", "Projects page"],
  ["pages.projectDetail", "Project details page"],
  ["pages.careers", "Careers page"],
  ["pages.contact", "Contact page"],
  ["pages.account", "Customer sign in / register"],
  ["content.systems", "Home › Systems & Solutions cards"],
  ["content.brands", "Home › Brand cards"],
  ["hero", "Home › Hero"],
  ["about", "Home › About section"],
  ["services", "Home › Systems & Solutions heading"],
  ["brands", "Home › Brands heading"],
  ["industries", "Home › Sectors heading"],
  ["projectsHome", "Home › Projects section"],
  ["certifications", "Home › Certifications heading"],
  ["testimonial", "Home › Testimonial"],
  ["nav", "Menu (header navigation)"],
  ["header", "Header"],
  ["topbar", "Top bar"],
  ["footer", "Footer"],
  ["components", "Buttons & small labels"],
  ["lang", "Language switch"],
];

function groupOf(key) {
  for (const [prefix, label] of GROUPS) if (key === prefix || key.startsWith(prefix + ".")) return label;
  return "Other";
}

function labelOf(key) {
  const tail = key.split(".").slice(-2).join(" ");
  return tail
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/\bp(\d)\b/i, "paragraph $1")
    .replace(/\bdesc\b/i, "description")
    .replace(/^./, (c) => c.toUpperCase());
}

const ALL = Object.entries(CATALOG).map(([key, v]) => ({ key, en: v.en || "", ar: v.ar || "", group: groupOf(key), label: labelOf(key) }));
const GROUP_NAMES = [...new Set(GROUPS.map(([, l]) => l).concat("Other"))].filter((g) => ALL.some((r) => r.group === g));

function Row({ item, saved, onSave, onReset }) {
  const [en, setEn] = useState(saved?.en || item.en);
  const [ar, setAr] = useState(saved?.ar || item.ar);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => { setEn(saved?.en || item.en); setAr(saved?.ar || item.ar); }, [saved, item]);

  const dirty = en !== (saved?.en || item.en) || ar !== (saved?.ar || item.ar);
  const long = Math.max(item.en.length, item.ar.length) > 70;

  async function save() {
    setBusy(true); setMsg("");
    const err = await onSave(item.key, en === item.en ? "" : en, ar === item.ar ? "" : ar);
    setBusy(false);
    setMsg(err || "Saved");
  }

  return (
    <div className={`admin-text-row ${saved ? "is-edited" : ""}`}>
      <div className="admin-text-head">
        <strong>{item.label}</strong>
        {saved && <span className="admin-text-badge">Edited</span>}
        <code>{item.key}</code>
      </div>
      <div className="admin-field-row">
        <div className="admin-field">
          <label>English</label>
          {long ? <textarea className="admin-textarea" rows={4} value={en} onChange={(e) => setEn(e.target.value)} />
                : <input className="admin-input" value={en} onChange={(e) => setEn(e.target.value)} />}
        </div>
        <div className="admin-field">
          <label>Arabic</label>
          {long ? <textarea className="admin-textarea" dir="rtl" rows={4} value={ar} onChange={(e) => setAr(e.target.value)} />
                : <input className="admin-input" dir="rtl" value={ar} onChange={(e) => setAr(e.target.value)} />}
        </div>
      </div>
      <div className="admin-row-actions" style={{ alignItems: "center" }}>
        <button className="admin-btn admin-btn-sm admin-btn-primary" disabled={!dirty || busy} onClick={save}>{busy ? "Saving…" : "Save"}</button>
        {saved && <button className="admin-btn admin-btn-sm" onClick={() => onReset(item.key)}>Reset to original</button>}
        {msg && <span className="admin-hint" style={{ margin: 0, color: msg === "Saved" ? "#1a8a4a" : "var(--a-bad)" }}>{msg}</span>}
      </div>
    </div>
  );
}

export default function AdminText() {
  const [saved, setSaved] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [group, setGroup] = useState(GROUP_NAMES[0]);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("site_text").select("key, en, ar");
    if (error) setError(dbError(error));
    else {
      const map = {};
      for (const r of data || []) map[r.key] = r;
      setSaved(map);
      setError("");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  async function onSave(key, en, ar) {
    if (!en && !ar) {
      const { error } = await supabase.from("site_text").delete().eq("key", key);
      if (error) return dbError(error);
      setSaved((s) => { const n = { ...s }; delete n[key]; return n; });
      return "";
    }
    const { error } = await supabase.from("site_text").upsert({ key, en, ar, updated_at: new Date().toISOString() });
    if (error) return dbError(error);
    setSaved((s) => ({ ...s, [key]: { key, en, ar } }));
    return "";
  }

  async function onReset(key) {
    if (!confirm("Go back to the original wording for this text?")) return;
    const { error } = await supabase.from("site_text").delete().eq("key", key);
    if (error) { setError(dbError(error)); return; }
    setSaved((s) => { const n = { ...s }; delete n[key]; return n; });
  }

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle) {
      return ALL.filter((r) =>
        [r.en, r.ar, r.key, r.label, saved[r.key]?.en, saved[r.key]?.ar].some((v) => (v || "").toLowerCase().includes(needle))
      ).slice(0, 80);
    }
    return ALL.filter((r) => r.group === group);
  }, [q, group, saved]);

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Website Text</h1>
        <div className="admin-notice">Supabase isn't connected yet — see <code>supabase/README.md</code>.</div>
      </>
    );
  }

  const editedCount = Object.keys(saved).length;

  return (
    <>
      <h1 className="admin-h1">Website Text</h1>
      <p className="admin-sub">
        Every heading, description and label on the website, in English and Arabic. Change the wording and press Save — it
        goes live straight away. Wrap words in <code>**double stars**</code> to make them bold in long paragraphs.
        {editedCount > 0 && <> · <b>{editedCount}</b> edited</>}
      </p>
      {error && <div className="admin-error" style={{ marginBottom: 14 }}>{error}</div>}

      <div className="admin-toolbar">
        <input className="admin-input" style={{ maxWidth: 340 }} placeholder="Search any text on the website…" value={q} onChange={(e) => setQ(e.target.value)} />
        {!q && (
          <select className="admin-select" style={{ maxWidth: 340 }} value={group} onChange={(e) => setGroup(e.target.value)}>
            {GROUP_NAMES.map((g) => (
              <option key={g} value={g}>{g} ({ALL.filter((r) => r.group === g).length})</option>
            ))}
          </select>
        )}
        <div className="spacer" />
        <span className="admin-hint" style={{ margin: 0 }}>{rows.length} item{rows.length === 1 ? "" : "s"}</span>
      </div>

      {loading ? (
        <div className="admin-card"><div className="admin-empty">Loading…</div></div>
      ) : rows.length === 0 ? (
        <div className="admin-card"><div className="admin-empty">Nothing matches "{q}".</div></div>
      ) : (
        <div className="admin-card" style={{ padding: 0 }}>
          {rows.map((item) => (
            <Row key={item.key} item={item} saved={saved[item.key]} onSave={onSave} onReset={onReset} />
          ))}
        </div>
      )}
    </>
  );
}
