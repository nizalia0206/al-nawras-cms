// Seeds your Supabase project with the site's existing static content, so
// the CMS starts out populated instead of empty.
//
// Usage (from the project root):
//   1. Create a `.env` file (copy `.env.example`) and also add:
//        SUPABASE_SERVICE_ROLE_KEY=... (Settings -> API -> service_role key — keep secret, never commit)
//   2. Run:  node --env-file=.env supabase/seed.js
//
// Safe to re-run — it upserts, so running it twice won't duplicate rows.

import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../src/data/products.js";
import { FALLBACK_PROJECTS } from "../src/data/projectsFallback.js";
import { SYSTEM_IMAGES_SEED } from "./systemImagesSeed.js";

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
    "Add them to your .env file, then run: node --env-file=.env supabase/seed.js"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seedProducts() {
  const rows = PRODUCTS.map((p, i) => {
    const { priceUnit, ...rest } = p;
    return { ...rest, price_unit: priceUnit ?? null, sort_order: i };
  });
  const { error } = await supabase.from("products").upsert(rows);
  if (error) throw error;
  console.log(`✓ Seeded ${rows.length} products`);
}

async function seedProjects() {
  const rows = FALLBACK_PROJECTS.map((p, i) => ({ ...p, sort_order: i }));
  const { error } = await supabase.from("projects").upsert(rows);
  if (error) throw error;
  console.log(`✓ Seeded ${rows.length} projects`);
}

async function seedSystemImages() {
  // Clear existing rows first so re-running doesn't leave stale duplicates
  // (system_images has no natural unique key to upsert against).
  const { error: delErr } = await supabase.from("system_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw delErr;
  let { error } = await supabase.from("system_images").insert(SYSTEM_IMAGES_SEED);
  if (error && /description|brand/i.test(error.message)) {
    // Older database without the card columns — seed the basics and say how to fix it.
    console.warn(
      "! system_images has no description/brand columns yet — seeding names + pictures only.\n" +
      "  Run supabase/migrations/001_system_images_card_fields.sql in the SQL Editor, then re-run this seed."
    );
    ({ error } = await supabase
      .from("system_images")
      .insert(SYSTEM_IMAGES_SEED.map(({ description, brand, ...row }) => row)));
  }
  if (error) throw error;
  console.log(`✓ Seeded ${SYSTEM_IMAGES_SEED.length} system images`);
}

async function main() {
  console.log("Seeding Supabase from bundled static data…\n");
  await seedProducts();
  await seedProjects();
  await seedSystemImages();
  console.log("\nDone. Open /admin on your site to manage this content.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
