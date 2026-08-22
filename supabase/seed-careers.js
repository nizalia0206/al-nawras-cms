// Seeds `job_postings` with the current hardcoded job listings, so the
// CMS starts out populated with exactly what's already live — nothing
// changes on the site, it just becomes editable in /admin/careers.
//
// Usage: node --env-file=.env supabase/seed-careers.js
import { createClient } from "@supabase/supabase-js";
import { jobs } from "../src/data/content.js";

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seedCareers() {
  // Clear existing rows first so re-running doesn't leave stale duplicates
  // (job_postings has no natural unique key to upsert against).
  const { error: delErr } = await supabase
    .from("job_postings")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw delErr;

  const rows = jobs.map((j, i) => ({
    title: j.title,
    dept: j.dept,
    type: j.type || "Full-time",
    location: j.location,
    sort_order: i,
  }));
  const { error } = await supabase.from("job_postings").insert(rows);
  if (error) throw error;
  console.log(`✓ Seeded ${rows.length} job postings`);
}

seedCareers().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
