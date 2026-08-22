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
import { team, certifications } from "../src/data/content.js";

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

// NOTE: system_images is intentionally NOT seeded here.
// systemImagesSeed.js pointed at "/assets/systems/..." assuming those files
// were copied into nawras-website-final/public — they never were, so any
// site with rows in system_images was serving 404s instead of the bundled
// fallback gallery images. If system_images is empty, the systems pages
// fall back to their bundled images automatically, which is correct and
// requires no seeding.
//
// To manage these images from the CMS, either:
//   1. Add them one by one via Admin -> Systems & Solutions -> "+ Add Image"
//      (uploads to Supabase storage and stores a real public URL), or
//   2. Run `node --env-file=.env supabase/uploadSystemImages.js <path-to-nawras-website-final>`
//      to bulk-upload the existing gallery images to storage and populate
//      system_images with correct URLs in one go.

async function seedTeam() {
  const rows = team.map((p, i) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    phone: p.phone || null,
    icon: p.icon || "person",
    highlight: p.highlight || false,
    sort_order: i,
  }));
  const { error } = await supabase.from("team_members").upsert(rows);
  if (error) throw error;
  console.log(`✓ Seeded ${rows.length} team members`);
}

async function seedCertifications() {
  const rows = certifications.map((c, i) => ({
    num: c.num,
    title: c.title,
    description: c.desc,
    image_url: c.image || null,
    sort_order: i,
  }));
  const { error } = await supabase.from("certifications").upsert(rows);
  if (error) throw error;
  console.log(`✓ Seeded ${rows.length} certifications`);
}

async function main() {
  console.log("Seeding Supabase from bundled static data…\n");
  await seedProducts();
  await seedProjects();
  await seedTeam();
  await seedCertifications();
  console.log("\nDone. Open /admin on your site to manage this content.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});