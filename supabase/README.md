# Al Nawras CMS — Setup Guide

Your site now has an admin panel at **`/admin`** for managing:
- Products (catalog, pricing, specs, images)
- Projects (portfolio shown on the Projects page)
- Systems & Solutions (equipment gallery images per system page)
- Home Page Pictures (the 6 hero carousel images)

It's backed by [Supabase](https://supabase.com) (a free-tier Postgres database + auth + file
storage). Edits made in `/admin` go live on the site immediately — no rebuild or redeploy needed.

**Until you complete the steps below, the site keeps working exactly as before** — it just shows
the images/data that were already bundled into the code. Nothing breaks if you skip this.

---

## 1. Create a Supabase project (~2 minutes)

1. Go to [supabase.com](https://supabase.com) → sign up (free) → **New Project**.
2. Pick any name/region, set a database password (save it somewhere), and wait for it to spin up.

## 2. Run the database schema (~1 minute)

1. In your Supabase project, open **SQL Editor** → **New query**.
2. Copy the entire contents of `supabase/schema.sql` from this project, paste it in, and click **Run**.
3. This creates the 4 content tables, sets up security rules (anyone can read, only logged-in
   admins can edit), and creates a public `media` storage bucket for uploaded images.

## 3. Get your API keys

In Supabase: **Settings → API**. You'll need:
- **Project URL**
- **anon public** key

## 4. Connect the site to Supabase

1. Copy `.env.example` to `.env`.
2. Fill in the two values from step 3:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. If you're running the site locally, restart `npm run dev`.
4. **For your live site (Vercel):** add these same two variables under
   **Project Settings → Environment Variables**, then redeploy.

## 5. Create your admin login

In Supabase: **Authentication → Users → Add user**. Set an email and password — this is what
you'll use to sign in at `yoursite.com/admin`. You can add more than one admin user later the same way.

## 6. (Optional, recommended) Seed your existing content

This copies everything that's currently hardcoded into the site — the full product catalog, the
project portfolio, and the systems equipment galleries — into Supabase, so the CMS starts out
populated instead of empty. Skip this if you'd rather start fresh and add content manually.

1. In Supabase: **Settings → API**, copy the **service_role** key (different from the anon key —
   keep this one secret, it's server-only, never put it in the site itself).
2. Add it to your `.env` file: `SUPABASE_SERVICE_ROLE_KEY=...`
3. From the project folder, run:
   ```
   npm install
   node --env-file=.env supabase/seed.js
   ```
4. You should see confirmation that products, projects, and system images were seeded. Home page
   hero images aren't seeded — they keep using their bundled defaults until you replace one in
   `/admin/home`.

## 6b. Already set up? Update the Systems & Solutions cards

The Systems & Solutions pages now use the same picture cards as the Brands / Products page (title,
description, optional brand tag), with new pictures. If your Supabase project already exists:

1. **Add the two new columns** — Supabase → **SQL Editor** → paste and run
   `supabase/migrations/001_system_images_card_fields.sql` (safe to run more than once).
2. **Load the new pictures and card text** — this replaces *only* the Systems & Solutions rows
   (products and projects are not touched) and saves a backup of the old rows first:
   ```
   node --env-file=.env supabase/seed-system-images.mjs            # preview, changes nothing
   node --env-file=.env supabase/seed-system-images.mjs --apply    # uploads pictures to the `media` bucket + writes rows
   ```
   It needs `SUPABASE_SERVICE_ROLE_KEY` in `.env` (step 6). Hard-refresh the site afterwards.
3. In **/admin/systems** you can now edit each card's title, brand tag, description and picture,
   and add new cards.

> Why step 2 matters: the public site shows whatever is in the `system_images` table and only
> falls back to the bundled pictures when the table is empty for a system.

## 6c. Sectors, Site Settings, Team, Certifications, Careers & Customers (October 2026)

The CMS menu now has every editable part of the website:

| CMS page | What it controls on the website |
|---|---|
| Products | Catalog, product pages |
| Projects | Projects page |
| Systems & Solutions | Equipment cards on each system page |
| Home Page Pictures | Hero carousel images |
| **Sectors We Serve** | Sliding sector cards on the home page |
| **Brand Partners** | Sliding brand logos above the footer (logo, order, link) |
| **Website Text** | Every heading, description and label on the website — English + Arabic |
| **Our Team** | About → Our Team |
| **Certifications** | Certifications on Home + About |
| **Careers** | Job openings on the Careers page |
| **Job Applications** | Applications + CVs from the Careers page (private CV storage, hiring stages, notes, CSV) — run `supabase/migration_job_applications.sql` once |
| **Enquiries** | Every message sent from the Contact page (status, notes, reply by email/WhatsApp, CSV export) — run `supabase/migration_enquiries.sql` once |
| **Customers** | Everyone who registered / signs in on the website (search + CSV export) |
| **Site Settings** | Phone numbers, email, WhatsApp number, social links, headline numbers |

**One-time setup** (Supabase → SQL Editor → paste → Run), in this order if not done before:
1. `supabase/customers_and_auth.sql` (skip if already run)
2. `supabase/migration_careers.sql` (skip if already run)
3. `supabase/migration_site_content.sql` — creates Sectors, Brand Partners, Website Text + Site Settings (pre-filled with what the
   website shows today), makes sure the Team/Certifications tables exist, and makes every website
   sign-up appear automatically in **Customers** with its last sign-in time.

**New partner products** (Honeywell / Teknoware / Uranus from the datasheets):
```
node --env-file=.env supabase/seed-partner-products.mjs            # preview
node --env-file=.env supabase/seed-partner-products.mjs --apply    # replace those 3 brands (backup saved first)
```

**Admin vs customer accounts:** only accounts with `profiles.is_admin = true` can open the CMS.
Customers who register on the website can't. To make a new admin:
```
update profiles set is_admin = true
where id = (select id from auth.users where email = 'admin@alnawras.com');
```

## 7. Sign in and start editing

Visit https://al-nawras-cms.vercel.app/admin (the website's `/admin` also redirects there), sign in with the user you created in step 5, and you're set.

---

### Notes

- **Image uploads** go to a `media` bucket in Supabase Storage (created automatically by the
  schema) — there's a free 1GB storage allowance on Supabase's free tier, which is a lot of
  product/project photos.
- **If Supabase isn't configured**, `/admin` shows a setup notice instead of crashing, and the
  public site quietly falls back to the original bundled content — so it's safe to deploy this
  before finishing setup.
- **Costs**: Supabase's free tier covers this comfortably for a site this size. If you outgrow it,
  paid tiers start around $25/month.
