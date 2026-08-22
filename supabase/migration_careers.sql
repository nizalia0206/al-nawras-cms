-- ============================================================
-- Adds the `job_postings` table for the Careers page, with the
-- same is_admin security model as the rest of the CMS (see
-- customers_and_auth.sql). Run this once, after customers_and_auth.sql
-- has already been run (it relies on the `profiles` table existing).
-- ============================================================

create table if not exists job_postings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  dept text not null,
  type text default 'Full-time',
  location text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table job_postings enable row level security;

drop policy if exists "public read job_postings" on job_postings;
create policy "public read job_postings" on job_postings for select using (true);

drop policy if exists "admins write job_postings" on job_postings;
create policy "admins write job_postings" on job_postings for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));
