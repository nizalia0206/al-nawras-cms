import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import ImageUploadField from "./ImageUploadField";

const SLOTS = [
  { key: "fire-fighting", label: "Fire Fighting Systems slide" },
  { key: "fire-alarm", label: "Fire Alarm Systems slide" },
  { key: "voice-evacuation", label: "Voice Evacuation slide" },
  { key: "emergency-lighting", label: "Emergency Lighting slide" },
  { key: "elv", label: "ELV Systems slide" },
  { key: "smoke-management", label: "Smoke Management slide" },
];

export default function AdminHome() {
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("home_hero_slides").select("*");
    if (!error && data) {
      const map = {};
      for (const row of data) map[row.slide_key] = row.image_url;
      setOverrides(map);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  async function handleUpload(slotKey, label, url) {
    setSavingKey(slotKey);
    await supabase.from("home_hero_slides").upsert({ slide_key: slotKey, label, image_url: url });
    setOverrides((o) => ({ ...o, [slotKey]: url }));
    setSavingKey("");
  }

  async function handleReset(slotKey) {
    if (!confirm("Revert to the default image for this slide?")) return;
    await supabase.from("home_hero_slides").delete().eq("slide_key", slotKey);
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
        <div className="admin-notice">
          Supabase isn't connected yet. Connect it to manage these images — see{" "}
          <code>supabase/README.md</code>.
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Home Page Pictures</h1>
      <p className="admin-sub">
        Replace the background image for each slide of the homepage hero carousel. Leave a slide
        untouched to keep its default image.
      </p>

      {loading ? (
        <div className="admin-empty">Loading…</div>
      ) : (
        SLOTS.map((slot) => (
          <div className="admin-card" key={slot.key}>
            <div className="admin-field-row">
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13.5, marginBottom: 8 }}>
                  {slot.label}
                </label>
                <ImageUploadField
                  folder="home"
                  value={overrides[slot.key] || null}
                  onChange={(url) => handleUpload(slot.key, slot.label, url)}
                />
                {savingKey === slot.key && <div className="admin-hint">Saving…</div>}
              </div>
              <div>
                {overrides[slot.key] ? (
                  <>
                    <div className="admin-hint" style={{ marginBottom: 8 }}>Custom image is live on the site.</div>
                    <button className="admin-btn admin-btn-sm" onClick={() => handleReset(slot.key)}>
                      Revert to default image
                    </button>
                  </>
                ) : (
                  <div className="admin-hint">Currently showing the default bundled image.</div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}
