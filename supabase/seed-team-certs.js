import { createClient } from "@supabase/supabase-js";
import { team, certifications } from "../src/data/content.js";

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

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
  await seedTeam();
  await seedCertifications();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});