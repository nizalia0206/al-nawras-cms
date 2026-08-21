-- ============================================================
-- AL NAWRAS CMS — Supabase schema
-- Run this once in your Supabase project: SQL Editor -> New query -> paste -> Run
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- PRODUCTS ----------
create table if not exists products (
  id text primary key,
  name text not null,
  supplier text not null,
  category text not null,
  price numeric,
  price_unit text,
  images text[] default '{}',
  short text,
  description text,
  specs jsonb default '[]',
  tags text[] default '{}',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- PROJECTS ----------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ref text,
  category text not null,
  status text default 'Completed',
  location text,
  year text,
  client text,
  scope text,
  tags text[] default '{}',
  image text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- SYSTEMS & SOLUTIONS (equipment gallery images) ----------
-- system_key is one of: fire-fighting, fire-alarm, voice-evacuation,
-- emergency-lighting, elv, smoke-management
-- group_title groups images within a system page (Fire Fighting has
-- multiple groups e.g. "Fire Pump Sets"; other systems use one group,
-- leave group_title as '').
create table if not exists system_images (
  id uuid primary key default gen_random_uuid(),
  system_key text not null,
  group_title text default '',
  group_order integer default 0,
  name text not null,
  src text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- HOME PAGE PICTURES (hero carousel slide images) ----------
create table if not exists home_hero_slides (
  slide_key text primary key,
  label text,
  image_url text not null,
  updated_at timestamptz default now()
);

-- ---------- TEAM MEMBERS ----------
create table if not exists team_members (
  id text primary key,
  name text not null,
  role text not null,
  phone text,
  icon text default 'person', -- 'person' | 'hardhat'
  highlight boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- CERTIFICATIONS ----------
create table if not exists certifications (
  num text primary key,
  title text not null,
  description text not null,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security: anyone can read, only logged-in admins can write
-- ============================================================
alter table products enable row level security;
alter table projects enable row level security;
alter table system_images enable row level security;
alter table home_hero_slides enable row level security;
alter table team_members enable row level security;
alter table certifications enable row level security;

create policy "public read products" on products for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read system_images" on system_images for select using (true);
create policy "public read home_hero_slides" on home_hero_slides for select using (true);
create policy "public read team_members" on team_members for select using (true);
create policy "public read certifications" on certifications for select using (true);

create policy "admins write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admins write projects" on projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admins write system_images" on system_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admins write home_hero_slides" on home_hero_slides for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admins write team_members" on team_members for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admins write certifications" on certifications for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for uploaded images (products, projects, systems, home)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select
  using (bucket_id = 'media');
create policy "admins upload media" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admins update media" on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admins delete media" on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
