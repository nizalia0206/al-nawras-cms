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

## 7. Sign in and start editing

Visit `/admin` on your site, sign in with the user you created in step 5, and you're set.

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
