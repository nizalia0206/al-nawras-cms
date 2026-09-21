// Replace ONLY the Systems & Solutions pictures in Supabase (`system_images`) with the
// ones in supabase/systemImagesSeed.js + /public/assets/systems/. Unlike seed.js it does
// NOT touch products or projects, so it is safe to run on a live, edited database.
//
// WHY YOU NEED THIS: the public site shows whatever rows are in `system_images` and only
// falls back to the bundled pictures when the table is empty for a system.
//
// SAFE BY DEFAULT: without --apply it only prints what it would do. With --apply it first
// saves the current rows to supabase/backup-system-images-<time>.json, then replaces the
// rows for the six system keys.
//
// Usage (from the project root; needs SUPABASE_SERVICE_ROLE_KEY in .env, like seed.js):
//   node --env-file=.env supabase/seed-system-images.mjs                  # preview
//   node --env-file=.env supabase/seed-system-images.mjs --apply          # upload to Storage + write rows (recommended)
//   node --env-file=.env supabase/seed-system-images.mjs --apply --relative
//        # no upload: store site-relative paths (/assets/systems/…). Works only where
//        # those files are hosted — i.e. the public site and this CMS, not a third origin.
//
// Run supabase/migrations/001_system_images_card_fields.sql first (adds description + brand).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { SYSTEM_IMAGES_SEED } from "./systemImagesSeed.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPLY = process.argv.includes("--apply");
const RELATIVE = process.argv.includes("--relative");
const BUCKET = "media"; // the bucket created by schema.sql and used by the admin uploads

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const rows = SYSTEM_IMAGES_SEED.map((r) => ({ ...r }));
const keys = [...new Set(rows.map((r) => r.system_key))];
const file = (src) => path.join(root, "public", src);

const missing = rows.filter((r) => !fs.existsSync(file(r.src)));
if (missing.length) {
  console.error("Missing picture files:\n" + missing.map((m) => "  " + m.src).join("\n"));
  process.exit(1);
}

console.log(`${rows.length} pictures across ${keys.length} systems`);
console.log(RELATIVE ? "Mode: site-relative paths (no upload)" : `Mode: upload to Storage bucket "${BUCKET}" → systems/<system>/…`);
for (const k of keys) console.log(`  ${k.padEnd(20)} ${rows.filter((r) => r.system_key === k).length}`);

if (!APPLY) {
  console.log("\nPREVIEW ONLY — nothing was changed. Re-run with --apply to write to Supabase.");
  process.exit(0);
}
if (!url || !serviceKey) {
  console.error("\nMissing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env (see supabase/README.md step 6).");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// 1) back up whatever is there now
const { data: existing, error: readErr } = await supabase.from("system_images").select("*").in("system_key", keys);
if (readErr) { console.error("Could not read system_images:", readErr.message); process.exit(1); }
const backup = path.join(root, "supabase", `backup-system-images-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
fs.writeFileSync(backup, JSON.stringify(existing, null, 2));
console.log(`\nBacked up ${existing.length} existing rows → ${path.relative(root, backup)}`);

// 2) upload pictures (unless --relative)
if (!RELATIVE) {
  for (const r of rows) {
    const objectPath = "systems/" + r.src.replace("/assets/systems/", "");
    const { error } = await supabase.storage.from(BUCKET).upload(objectPath, fs.readFileSync(file(r.src)), {
      contentType: "image/jpeg", upsert: true, cacheControl: "31536000",
    });
    if (error) { console.error(`Upload failed for ${objectPath}: ${error.message}`); process.exit(1); }
    r.src = supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
  }
  console.log(`Uploaded ${rows.length} pictures to "${BUCKET}"`);
}

// 3) replace the rows
const { error: delErr } = await supabase.from("system_images").delete().in("system_key", keys);
if (delErr) { console.error("Delete failed:", delErr.message); process.exit(1); }

let { error: insErr } = await supabase.from("system_images").insert(rows);
if (insErr && /description|brand/i.test(insErr.message)) {
  console.warn("! No description/brand columns yet — run supabase/migrations/001_system_images_card_fields.sql, then re-run. Inserting names + pictures only for now.");
  ({ error: insErr } = await supabase.from("system_images").insert(rows.map(({ description, brand, ...r }) => r)));
}
if (insErr) {
  console.error("Insert failed:", insErr.message, `\nThe old rows are saved in ${path.relative(root, backup)} — restore them before retrying.`);
  process.exit(1);
}
console.log(`Done — ${rows.length} rows written. Hard-refresh the site and /admin/systems.`);
