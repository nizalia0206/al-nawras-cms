-- ============================================================
-- AL NAWRAS CMS — Site content + customers migration
-- Run ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- Safe to run more than once (everything is "if not exists" / "on conflict").
-- Requires customers_and_auth.sql to have been run before (profiles table).
--
-- Adds:
--   1. team_members + certifications tables (if they were never created)
--   2. industries      — "Sectors We Serve" cards on the home page
--   3. site_settings   — phones, email, WhatsApp, social links, stats
--   4. customers       — automatic sync with website sign-ups + last sign-in time
-- ============================================================

-- Helper used by every policy below: is the current user an admin?
-- (security definer so it can read profiles regardless of RLS)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin);
$$;

-- ------------------------------------------------------------
-- 1. TEAM + CERTIFICATIONS (columns match the website + CMS pages)
-- ------------------------------------------------------------
create table if not exists team_members (
  id text primary key,
  name text not null,
  role text not null,
  phone text,
  icon text default 'person',
  highlight boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists certifications (
  num text primary key,
  title text not null,
  description text not null,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table team_members enable row level security;
alter table certifications enable row level security;

drop policy if exists "public read team_members" on team_members;
create policy "public read team_members" on team_members for select using (true);
drop policy if exists "admins write team_members" on team_members;
create policy "admins write team_members" on team_members for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read certifications" on certifications;
create policy "public read certifications" on certifications for select using (true);
drop policy if exists "admins write certifications" on certifications;
create policy "admins write certifications" on certifications for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 2. INDUSTRIES / SECTORS WE SERVE
-- ------------------------------------------------------------
create table if not exists industries (
  id text primary key,
  title text not null,
  image text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table industries enable row level security;
drop policy if exists "public read industries" on industries;
create policy "public read industries" on industries for select using (true);
drop policy if exists "admins write industries" on industries;
create policy "admins write industries" on industries for all using (public.is_admin()) with check (public.is_admin());

-- Start the CMS with the sectors the website shows today (pictures are served by the website).
insert into industries (id, title, image, sort_order) values
  ('ind-hotels',        'Hotels & Hospitality',   'https://al-nawras-website.vercel.app/assets/industries/hotels.jpg',        0),
  ('ind-government',    'Government Buildings',   'https://al-nawras-website.vercel.app/assets/industries/government.jpg',    1),
  ('ind-offices',       'Offices & Towers',       'https://al-nawras-website.vercel.app/assets/industries/offices.jpg',       2),
  ('ind-manufacturing', 'Manufacturing Plants',   'https://al-nawras-website.vercel.app/assets/industries/manufacturing.jpg', 3),
  ('ind-healthcare',    'Healthcare Facilities',  'https://al-nawras-website.vercel.app/assets/industries/healthcare.jpg',    4),
  ('ind-residential',   'Residential Towers',     'https://al-nawras-website.vercel.app/assets/industries/residential.jpg',   5),
  ('ind-education',     'Schools & Universities', 'https://al-nawras-website.vercel.app/assets/industries/education.jpg',     6)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 3. SITE SETTINGS (one JSON row, id = 'main')
-- ------------------------------------------------------------
create table if not exists site_settings (
  id text primary key default 'main',
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;
drop policy if exists "public read site_settings" on site_settings;
create policy "public read site_settings" on site_settings for select using (true);
drop policy if exists "admins write site_settings" on site_settings;
create policy "admins write site_settings" on site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into site_settings (id, data) values ('main', '{
  "phone_sharjah": "+971 6 562 5425",
  "phone_dubai": "+971 4 333 5373",
  "phone_abudhabi": "+971 55 109 9886",
  "email": "info@nawrassystems.com",
  "website": "www.nawrassystems.com",
  "whatsapp": "971551099885",
  "linkedin": "https://ae.linkedin.com/in/al-nawras-91365b25b",
  "instagram": "",
  "x": "",
  "stat_projects": 1300,
  "stat_years": 20,
  "stat_offices": 3,
  "stat_brands": 6,
  "stat_sectors": 10,
  "stat_emirates": 7
}'::jsonb)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 4. CUSTOMERS — every website sign-up appears in Admin -> Customers
-- ------------------------------------------------------------
-- (customers table itself is created by customers_and_auth.sql)
alter table customers add column if not exists last_sign_in_at timestamptz;

-- New sign-up on the website -> customer row (name comes from the Register form).
create or replace function public.handle_new_customer()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.customers (id, email, full_name, created_at)
  values (new.id, new.email, nullif(new.raw_user_meta_data->>'full_name', ''), coalesce(new.created_at, now()))
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.customers.full_name, excluded.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_customer on auth.users;
create trigger on_auth_user_created_customer
  after insert on auth.users
  for each row execute procedure public.handle_new_customer();

-- Every sign-in updates "Last sign-in" in the CMS.
create or replace function public.handle_customer_sign_in()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.customers set last_sign_in_at = new.last_sign_in_at where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_signed_in on auth.users;
create trigger on_auth_user_signed_in
  after update of last_sign_in_at on auth.users
  for each row execute procedure public.handle_customer_sign_in();

-- Admins are staff, not customers: promoting someone removes them from the list.
create or replace function public.handle_admin_promoted()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_admin then
    delete from public.customers where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_admin on profiles;
create trigger on_profile_admin
  after insert or update of is_admin on profiles
  for each row execute procedure public.handle_admin_promoted();

-- Backfill: anyone who already signed up on the website but is missing from the list.
insert into public.customers (id, email, full_name, created_at, last_sign_in_at)
select u.id, u.email, nullif(u.raw_user_meta_data->>'full_name', ''), u.created_at, u.last_sign_in_at
from auth.users u
where not exists (select 1 from profiles p where p.id = u.id and p.is_admin)
on conflict (id) do update set last_sign_in_at = excluded.last_sign_in_at;

-- Remove any admin accounts that ended up in the customers list.
delete from public.customers c using profiles p where p.id = c.id and p.is_admin;

-- Admins can also update/delete customer rows from the CMS.
drop policy if exists "admins manage customers" on customers;
create policy "admins manage customers" on customers for all using (public.is_admin()) with check (public.is_admin());
