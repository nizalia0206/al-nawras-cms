-- ============================================================
-- AL NAWRAS CMS — Customer accounts & admin-role migration
-- Run this AFTER schema.sql: SQL Editor -> New query -> paste -> Run
-- ============================================================

-- ------------------------------------------------------------
-- WHY THIS FILE EXISTS
-- The original schema.sql let ANY logged-in Supabase user write to
-- products/projects/system_images/home_hero_slides, using the check
-- `auth.role() = 'authenticated'`. That was safe while the only
-- people who could log in were the admins you added by hand.
--
-- Now that the public site lets visitors self-register (Sign In /
-- Register), every registered customer is ALSO "authenticated" in
-- Supabase's eyes. Left unchanged, those old policies would let any
-- customer edit or delete your products, projects and photos.
--
-- This migration adds a `profiles` table with an `is_admin` flag,
-- and tightens every CMS-write policy to require is_admin = true
-- instead of just being logged in.
-- ------------------------------------------------------------

-- ---------- PROFILES (one row per Supabase Auth user; marks admins) ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "users read own profile" on profiles;
create policy "users read own profile" on profiles for select using (auth.uid() = id);

-- Auto-create a profile row (is_admin defaults to false) whenever
-- someone signs up, whether from /admin or the public Register page.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, is_admin) values (new.id, false)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill profile rows for any Supabase Auth users that already existed
-- before this migration ran (e.g. admins you added manually earlier).
insert into public.profiles (id, is_admin)
select id, true from auth.users
on conflict (id) do nothing;
-- ^ existing users are marked is_admin = true, since before this migration
-- the only people who could log in at all were the admins you created by
-- hand in Authentication -> Users. New signups from the public Register
-- page default to is_admin = false (see the trigger above).

-- ---------- CUSTOMERS (public-facing registered accounts) ----------
create table if not exists customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  company text,
  created_at timestamptz default now()
);

alter table customers enable row level security;

drop policy if exists "customers read own row" on customers;
create policy "customers read own row" on customers for select using (auth.uid() = id);

drop policy if exists "customers insert own row" on customers;
create policy "customers insert own row" on customers for insert with check (auth.uid() = id);

drop policy if exists "customers update own row" on customers;
create policy "customers update own row" on customers for update using (auth.uid() = id);

drop policy if exists "admins read all customers" on customers;
create policy "admins read all customers" on customers for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
);

-- ============================================================
-- SECURITY FIX: tighten the existing CMS tables to require is_admin,
-- not merely "authenticated" (see explanation at the top of this file).
-- ============================================================
drop policy if exists "admins write products" on products;
create policy "admins write products" on products for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "admins write projects" on projects;
create policy "admins write projects" on projects for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "admins write system_images" on system_images;
create policy "admins write system_images" on system_images for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "admins write home_hero_slides" on home_hero_slides;
create policy "admins write home_hero_slides" on home_hero_slides for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects for insert
  with check (
    bucket_id = 'media'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects for update
  using (
    bucket_id = 'media'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects for delete
  using (
    bucket_id = 'media'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ============================================================
-- Making someone an admin after this migration
-- ============================================================
-- New admins you add via Authentication -> Add user still default to
-- is_admin = false (they're customers until promoted). After they sign
-- in at least once (so their profiles row exists), promote them with:
--
--   update profiles set is_admin = true
--   where id = (select id from auth.users where email = 'admin@alnawras.com');
