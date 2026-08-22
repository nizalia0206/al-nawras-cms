// Bulk-uploads the Systems & Solutions gallery images to Supabase storage
// and populates `system_images` with correct public URLs.
//
// This replaces the old systemImagesSeed.js approach, which pointed at
// "/assets/systems/..." — a public/ path that was never actually created,
// so those rows 404'd on the live site instead of showing the images.
//
// Usage (from the al-nawras project root):
//   1. Make sure `.env` has VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
//      (Settings -> API -> service_role key — keep secret, never commit).
//   2. Run:
//        node --env-file=.env supabase/uploadSystemImages.js /path/to/nawras-website-final
//      (pass the path to the nawras-website-final repo checkout on your machine —
//      the one containing src/assets/systems/...)
//
// Safe to re-run: it clears existing system_images rows first, then
// re-uploads (upsert:true), so it won't duplicate storage files or rows.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteRepoPath = process.argv[2];

if (!url || !serviceKey) {
  console.error(
    "Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
    "Add them to your .env file, then run: node --env-file=.env supabase/uploadSystemImages.js <path-to-nawras-website-final>"
  );
  process.exit(1);
}

if (!siteRepoPath) {
  console.error(
    "Missing path to nawras-website-final.\n" +
    "Usage: node --env-file=.env supabase/uploadSystemImages.js /path/to/nawras-website-final"
  );
  process.exit(1);
}

const assetsDir = path.join(siteRepoPath, "src", "assets", "systems");
if (!fs.existsSync(assetsDir)) {
  console.error(`Could not find ${assetsDir} — check the path you passed.`);
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

// Same metadata as the old systemImagesSeed.js, but `file` is now a real
// local path under src/assets/systems/ that we read and upload ourselves.
const ITEMS = [
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 0, name: "Complete Fire Pump Set", file: "fire-pump/Fire_pump_set.png" },
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 1, name: "Diesel Engine-Driven Fire Pump", file: "fire-pump/Diesel_Engine_Driven_Fire_Pump.png" },
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 2, name: "Electric Motor-Driven Fire Pump", file: "fire-pump/Electric_Motor_Driven_Fire_Pump.png" },
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 3, name: "Vertical Turbine Fire Pump", file: "fire-pump/Vertical_Turbine_Fire_Pump.png" },

  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 0, name: "Fire Hose Reel & Cabinets", file: "fire-fighting/Fire_Hose_Reel_and_Cabinets.png" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 1, name: "Fire Hydrants", file: "fire-fighting/Fire_hydrant.png" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 2, name: "Landing Valves", file: "fire-fighting/Landing_valve.png" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 3, name: "Dry & Wet Riser Systems", file: "fire-fighting/Dry_wet_riser_systems.png" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 4, name: "Automatic Sprinklers", file: "fire-fighting/Sprinklers.png" },

  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 0, name: "Suppression Cylinders", file: "fire-suppression/fs1.png" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 1, name: "Nozzles & Manifolds", file: "fire-suppression/fs2.png" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 2, name: "Suppression Control Panel", file: "fire-suppression/fs3.png" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 3, name: "Detection & Release Devices", file: "fire-suppression/fs4.png" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 4, name: "Portable Fire Extinguishers", file: "fire-extinguisher/Fire_extinguisher.png" },

  { system_key: "fire-alarm", group_title: "", group_order: 0, sort_order: 0, name: "Addressable Fire Alarm Control Panel", file: "fire-alarm/fe1.png" },
  { system_key: "fire-alarm", group_title: "", group_order: 0, sort_order: 1, name: "Smoke Detectors & Notification Devices", file: "fire-alarm/fe2.png" },

  { system_key: "voice-evacuation", group_title: "", group_order: 0, sort_order: 0, name: "Ceiling & Wall Speakers", file: "public-address/pas1.png" },
  { system_key: "voice-evacuation", group_title: "", group_order: 0, sort_order: 1, name: "PA Amplifiers & Control Rack", file: "public-address/pas2.png" },

  { system_key: "emergency-lighting", group_title: "", group_order: 0, sort_order: 0, name: "Central Battery System Panel", file: "emergency-light/el1.png" },
  { system_key: "emergency-lighting", group_title: "", group_order: 0, sort_order: 1, name: "Exit & Emergency Luminaires", file: "emergency-light/el2.png" },
  { system_key: "emergency-lighting", group_title: "", group_order: 0, sort_order: 2, name: "Emergency Bulkhead Luminaires", file: "emergency-light/el3.png" },

  { system_key: "elv", group_title: "", group_order: 0, sort_order: 0, name: "Access Control Readers & Turnstiles", file: "access-control/acs1.png" },
  { system_key: "elv", group_title: "", group_order: 0, sort_order: 1, name: "Dome & Bullet Cameras", file: "cctv/cc1.png" },
  { system_key: "elv", group_title: "", group_order: 0, sort_order: 2, name: "PTZ & NVR Camera Systems", file: "cctv/cc2.png" },

  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 0, name: "Fire & Smoke Dampers", file: "smoke-management/sms1.png" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 1, name: "Damper Actuators", file: "smoke-management/sms2.png" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 2, name: "Smoke Extraction Fans", file: "smoke-management/sms3.png" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 3, name: "Smoke Control Panel", file: "smoke-management/sms4.png" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 4, name: "Ductwork & Louvres", file: "smoke-management/sms5.png" },
];

function contentTypeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function main() {
  console.log(`Uploading system images from ${assetsDir}\n`);

  // Clear old rows (including any leftover broken ones from the previous
  // seed script) so this run is the single source of truth.
  const { error: delErr } = await supabase
    .from("system_images")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw delErr;

  const rows = [];
  for (const item of ITEMS) {
    const localPath = path.join(assetsDir, item.file);
    if (!fs.existsSync(localPath)) {
      console.warn(`⚠ Skipping missing file: ${localPath}`);
      continue;
    }
    const buffer = fs.readFileSync(localPath);
    const storagePath = `systems/${item.file}`;

    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(storagePath, buffer, {
        contentType: contentTypeFor(item.file),
        cacheControl: "3600",
        upsert: true,
      });
    if (upErr) throw upErr;

    const { data } = supabase.storage.from("media").getPublicUrl(storagePath);

    rows.push({
      system_key: item.system_key,
      group_title: item.group_title,
      group_order: item.group_order,
      sort_order: item.sort_order,
      name: item.name,
      src: data.publicUrl,
    });
    console.log(`✓ Uploaded ${item.file}`);
  }

  const { error: insErr } = await supabase.from("system_images").insert(rows);
  if (insErr) throw insErr;

  console.log(`\nDone. Inserted ${rows.length} system_images rows with real storage URLs.`);
}

main().catch((err) => {
  console.error("Upload failed:", err.message || err);
  process.exit(1);
});
