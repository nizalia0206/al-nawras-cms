import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import ImageUploadField from "./ImageUploadField";
import { dbError } from "./dbError";

const SITE = "https://al-nawras-website.vercel.app";

// Same slide keys the website's hero carousel uses; `current` is the picture the
// website shows when no custom image has been uploaded.
const SLOTS = [
  { key: "intro", label: "Think Al Nawras (first slide)", current: `${SITE}/assets/hero/think-nawras.jpg` },
  { key: "fire-fighting", label: "Firefighting Systems", current: `${SITE}/assets/hero/fire-fighting-env.jpg` },
  { key: "fire-alarm", label: "Fire Alarm & Voice Evacuation Systems", current: `${SITE}/assets/hero/fire-alarm-env.jpg` },
  { key: "emergency-lighting", label: "Emergency Lighting", current: `${SITE}/assets/hero/emergency-light-env.jpg` },
  { key: "elv", label: "ELV Systems", current: `${SITE}/assets/hero/elv-cctv.jpg` },
  { key: "smoke-management", label: "Smoke Management", current: `${SITE}/assets/hero/smoke-fan.jpg` },
];

export default function AdminHome() {
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("home_hero_slides").select("*");
    if (error) setError(dbError(error));
    else {
      const map = {};
      for (const row of data || []) map[row.slide_key] = row.image_url;
      setOverrides(map);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  async function handleUpload(slot, url) {
    setSavingKey(slot.key);
    setError("");
    const { error } = await supabase.from("home_hero_slides").upsert({ slide_key: slot.key, label: slot.label, image_url: url });
    if (error) setError(dbError(error));
    else setOverrides((o) => ({ ...o, [slot.key]: url }));
    setSavingKey("");
  }

  async function handleReset(slotKey) {
    if (!confirm("Go back to the original picture for this slide?")) return;
    const { error } = await supabase.from("home_hero_slides").delete().eq("slide_key", slotKey);
    if (error) { setError(dbError(error)); return; }
    setOverrides((o) => {
      const next = { ...o };
      delete next[slotKey];
      return next;
    });
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Home Page Pictures</h1>
        <div className="admin-notice">Supabase isn't connected yet — see <code>supabase/README.md</code>.</div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Home Page Pictures</h1>
      <p className="admin-sub">The background picture of each slide in the home page carousel. Upload a new one to replace it.</p>
      {error && <div className="admin-error" style={{ marginBottom: 14 }}>{error}</div>}

      {loading ? (
        <div className="admin-empty">Loading…</div>
      ) : (
        <div className="admin-pic-grid">
          {SLOTS.map((slot) => {
            const custom = overrides[slot.key];
            const shown = custom || slot.current;
            return (
              <div className="admin-card admin-pic-card" key={slot.key}>
                <div className="admin-pic-frame">
                  <img src={shown} alt={slot.label} />
                  <span className={`admin-pic-badge ${custom ? "is-custom" : ""}`}>{custom ? "Your picture" : "Original picture"}</span>
                </div>
                <div className="admin-pic-body">
                  <h3>{slot.label}</h3>
                  <ImageUploadField folder="home" value={null} onChange={(url) => handleUpload(slot, url)} />
                  {savingKey === slot.key && <div className="admin-hint">Saving…</div>}
                  {custom && (
                    <button className="admin-btn admin-btn-sm" onClick={() => handleReset(slot.key)}>
                      Use the original picture again
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
