import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { dbError } from "./dbError";

// Must match DEFAULT_SETTINGS in the website's src/context/SiteSettingsContext.jsx.
// Empty fields fall back to these on the website.
const DEFAULT_SETTINGS = {
  phone_sharjah: "+971 6 562 5425",
  phone_dubai: "+971 4 333 5373",
  phone_abudhabi: "+971 55 109 9886",
  email: "info@nawrassystems.com",
  website: "www.nawrassystems.com",
  whatsapp: "971551099885",
  linkedin: "https://ae.linkedin.com/in/al-nawras-91365b25b",
  instagram: "",
  x: "",
  stat_projects: 1300,
  stat_years: 20,
  stat_offices: 3,
  stat_brands: 6,
  stat_sectors: 10,
  stat_emirates: 7,
};

const SECTIONS = [
  {
    title: "Contact details",
    hint: "Shown in the footer, the top bar and the Contact page.",
    fields: [
      ["phone_sharjah", "Sharjah HQ phone"],
      ["phone_dubai", "Dubai phone"],
      ["phone_abudhabi", "Abu Dhabi phone"],
      ["email", "Email address"],
      ["website", "Website address"],
    ],
  },
  {
    title: "WhatsApp",
    hint: "Used by the green WhatsApp button and every \"Get Quote\" button. Country code + number, digits only (e.g. 971551099885).",
    fields: [["whatsapp", "WhatsApp number"]],
  },
  {
    title: "Social media links",
    hint: "Full links, e.g. https://www.instagram.com/yourpage. Leave empty if you don't have one.",
    fields: [
      ["linkedin", "LinkedIn"],
      ["instagram", "Instagram"],
      ["x", "X (Twitter)"],
    ],
  },
  {
    title: "Numbers on the website",
    hint: "Home page hero & About section counters, and the Projects page stats.",
    fields: [
      ["stat_projects", "Projects completed (shown as 1300+)", "number"],
      ["stat_years", "Years of experience (shown as 20+)", "number"],
      ["stat_offices", "UAE branches", "number"],
      ["stat_brands", "Global brand partners", "number"],
      ["stat_sectors", "Sectors served (Projects page)", "number"],
      ["stat_emirates", "Emirates covered (Projects page)", "number"],
    ],
  },
];

export default function AdminSettings() {
  const [values, setValues] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return; }
    supabase.from("site_settings").select("data").eq("id", "main").maybeSingle().then(({ data, error }) => {
      if (error) setError(dbError(error));
      else if (data?.data) setValues({ ...DEFAULT_SETTINGS, ...data.data });
      setLoading(false);
    });
  }, []);

  function set(key, v) {
    setValues((x) => ({ ...x, [key]: v }));
    setMsg("");
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMsg("");
    const data = { ...values };
    for (const s of SECTIONS) for (const [k, , type] of s.fields) if (type === "number") data[k] = Number(data[k]) || 0;
    data.whatsapp = String(data.whatsapp || "").replace(/\D/g, "");
    const { error } = await supabase.from("site_settings").upsert({ id: "main", data, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) setError(dbError(error));
    else { setValues(data); setMsg("Saved — changes are live on the website (refresh to see them)."); }
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Site Settings</h1>
        <div className="admin-notice">Supabase isn't connected yet — see <code>supabase/README.md</code>.</div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Site Settings</h1>
      <p className="admin-sub">Contact details, WhatsApp, social links and the headline numbers used across the website.</p>
      {loading ? (
        <div className="admin-card"><div className="admin-empty">Loading…</div></div>
      ) : (
        <form onSubmit={save}>
          {SECTIONS.map((s) => (
            <div className="admin-card" key={s.title} style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 15 }}>{s.title}</h3>
              <div className="admin-hint" style={{ marginBottom: 14 }}>{s.hint}</div>
              <div className="admin-field-row">
                {s.fields.map(([k, label, type]) => (
                  <div className="admin-field" key={k}>
                    <label>{label}</label>
                    <input
                      className="admin-input"
                      type={type === "number" ? "number" : "text"}
                      min={type === "number" ? 0 : undefined}
                      value={values[k] ?? ""}
                      onChange={(e) => set(k, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {error && <div className="admin-error">{error}</div>}
          {msg && <div className="admin-hint" style={{ color: "#1a8a4a", fontWeight: 600 }}>{msg}</div>}
          <div className="admin-savebar">
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Settings"}</button>
          </div>
        </form>
      )}
    </>
  );
}
