-- ============================================================
-- Migration: adds Team Members + Certifications management.
-- Safe to run even if you already ran the original schema.sql —
-- everything here uses "if not exists" / "on conflict do nothing".
-- Run in Supabase: SQL Editor -> New query -> paste -> Run
-- ============================================================

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

drop policy if exists "public read certifications" on certifications;
create policy "public read certifications" on certifications for select using (true);

drop policy if exists "admins write team_members" on team_members;
create policy "admins write team_members" on team_members for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admins write certifications" on certifications;
create policy "admins write certifications" on certifications for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
