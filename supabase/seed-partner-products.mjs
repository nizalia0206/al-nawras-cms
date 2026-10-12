// Replaces the Honeywell, Teknoware and Uranus products in the CMS `products` table
// with the 76 products taken from the official partner datasheets
// (data in supabase/partner-products.json). Other brands are not touched.
//
//   node --env-file=.env supabase/seed-partner-products.mjs           # preview only
//   node --env-file=.env supabase/seed-partner-products.mjs --apply   # write to Supabase
//
// Needs VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env (see README step 6).
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}
const apply = process.argv.includes("--apply");
const BRANDS = ["honeywell", "teknoware", "uranus"];
const rows = JSON.parse(fs.readFileSync(new URL("./partner-products.json", import.meta.url), "utf8"));
const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: existing, error: readErr } = await supabase.from("products").select("*");
if (readErr) { console.error(readErr.message); process.exit(1); }
const old = existing.filter((p) => BRANDS.includes(p.supplier));
const startOrder = Math.max(0, ...existing.filter((p) => !BRANDS.includes(p.supplier)).map((p) => p.sort_order || 0)) + 1;

console.log(`Current products: ${existing.length} (${old.length} Honeywell/Teknoware/Uranus will be replaced)`);
console.log(`New products to add: ${rows.length}`);
if (!apply) { console.log("\nPreview only — run again with --apply to make the change."); process.exit(0); }

fs.writeFileSync(new URL(`./backup-products-${Date.now()}.json`, import.meta.url), JSON.stringify(existing, null, 1));
const { error: delErr } = await supabase.from("products").delete().in("supplier", BRANDS);
if (delErr) { console.error(delErr.message); process.exit(1); }
const { error: insErr } = await supabase.from("products").insert(rows.map((r, i) => ({ ...r, sort_order: startOrder + i })));
if (insErr) { console.error(insErr.message); process.exit(1); }
console.log(`✓ Replaced ${old.length} old products with ${rows.length} datasheet products (backup saved in supabase/).`);
