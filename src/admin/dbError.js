// Turns raw Supabase errors into plain instructions for the CMS user.
const SETUP_FILE = {
  industries: "migration_site_content.sql",
  site_settings: "migration_site_content.sql",
  team_members: "migration_site_content.sql",
  certifications: "migration_site_content.sql",
  job_postings: "migration_careers.sql",
  contact_messages: "migration_enquiries.sql",
  job_applications: "migration_job_applications.sql",
  customers: "customers_and_auth.sql",
  profiles: "customers_and_auth.sql",
};

export function dbError(error) {
  const msg = (error && (error.message || String(error))) || "Something went wrong.";
  const m = msg.match(/table '(?:public\.)?([a-z_]+)'/i) || msg.match(/relation "(?:public\.)?([a-z_]+)" does not exist/i);
  if (m) {
    const file = SETUP_FILE[m[1]] || "migration_site_content.sql";
    return `This section isn't set up in the database yet. In Supabase open SQL Editor → New query, paste the contents of supabase/${file}, click Run, then refresh this page.`;
  }
  if (/row-level security|permission denied/i.test(msg)) {
    return "Your account isn't allowed to change this. Make sure it's marked as an admin (see supabase/README.md) and that the SQL setup files have been run.";
  }
  return msg;
}
