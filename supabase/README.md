# Al Nawras CMS — Setup Guide

Your site now has an admin panel at **`/admin`** for managing:
- Products (catalog, pricing, specs, images)
- Projects (portfolio shown on the Projects page)
- Systems & Solutions (equipment gallery images per system page)
- Home Page Pictures (the 6 hero carousel images)
- Customers (everyone who registers an account on the public site)

The public site also has customer accounts at **`/account/sign-in`** and
**`/account/register`**, so visitors can create a login, come back, and manage
their details.

It's backed by [Supabase](https://supabase.com) (a free-tier Postgres database + auth + file
storage). Edits made in `/admin` go live on the site immediately — no rebuild or redeploy needed.

**Until you complete the steps below, the site keeps working exactly as before** — it just shows
the images/data that were already bundled into the code. Nothing breaks if you skip this.

---

## 1. Create a Supabase project (~2 minutes)

1. Go to [supabase.com](https://supabase.com) → sign up (free) → **New Project**.
2. Pick any name/region, set a database password (save it somewhere), and wait for it to spin up.

## 2. Run the database schema (~2 minutes)

1. In your Supabase project, open **SQL Editor** → **New query**.
2. Copy the entire contents of `supabase/schema.sql` from this project, paste it in, and click **Run**.
3. This creates the 4 content tables, sets up security rules (anyone can read, only logged-in
   admins can edit), and creates a public `media` storage bucket for uploaded images.
4. Open **New query** again, copy the entire contents of `supabase/customers_and_auth.sql`, paste
   it in, and click **Run**. This adds the `customers` table (registered public accounts) and an
   admin-role system — see the notes inside that file for why this step matters, but in short: it
   makes sure that customers who register on the public site can never edit your products,
   projects, or photos, only admins can.

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

**If you ran `customers_and_auth.sql` before adding this user**, they'll default to a regular
(non-admin) account. Promote them to admin by running this in **SQL Editor**, swapping in their
email:

```sql
update profiles set is_admin = true
where id = (select id from auth.users where email = 'your-admin-email@example.com');
```

(Anyone who was already a Supabase user *before* you ran `customers_and_auth.sql` was
automatically marked as an admin, so this step is only needed for admins you add afterwards.)

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

## 8. ⚠️ Making a user an admin (required)

Your real website (`nawras-website-final`) now lets customers create their own accounts —
using the **same Supabase project** as this CMS. That means, by default, anyone who registers
on the public site could also try signing into `/admin` here with their own email/password.

To prevent that, `/admin` now checks for an `is_admin` flag on the user's account, which
customers can never set themselves (it requires your Supabase service_role key). **You must set
this flag on your own admin account(s), or you'll be locked out of `/admin` after this update.**

Run this once in Supabase → **SQL Editor** for each person who should have admin access:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"is_admin": true}'::jsonb
where email = 'your-admin-email@example.com';
```

Replace the email with the one you use to sign into `/admin`. After running it, sign out and
back in to `/admin` (or just refresh) for the change to take effect.

To do the same thing from the Supabase dashboard UI instead of SQL: **Authentication → Users →
click the user → User App Metadata → Edit** → add `{"is_admin": true}` → Save.

---

### Notes

- **Customer accounts**: visitors can register at `/account/register` and sign in at
  `/account/sign-in`. Their details land in the `customers` table and show up under
  **Customers** in `/admin`, with a CSV export button. Customers can only ever see and edit
  their own details — they cannot see other customers or touch products/projects/photos.
- **Image uploads** go to a `media` bucket in Supabase Storage (created automatically by the
  schema) — there's a free 1GB storage allowance on Supabase's free tier, which is a lot of
  product/project photos.
- **If Supabase isn't configured**, `/admin` shows a setup notice instead of crashing, and the
  public site quietly falls back to the original bundled content — so it's safe to deploy this
  before finishing setup.
- **Costs**: Supabase's free tier covers this comfortably for a site this size. If you outgrow it,
  paid tiers start around $25/month.
