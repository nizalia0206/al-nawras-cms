-- ============================================================
-- AL NAWRAS CMS — Job applications from the Careers page (with CV upload)
-- Run ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- Safe to run more than once. Requires customers_and_auth.sql (profiles table).
--
-- Applicants can only SEND an application and upload their CV.
-- CVs are stored in a PRIVATE bucket ("cvs"): only admins can open them,
-- through short-lived download links created by the CMS.
-- ============================================================

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin);
$$;

create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  job_title text not null,
  dept text,
  location text,
  full_name text not null,
  email text not null,
  phone text not null,
  experience text,
  cover_note text,
  cv_path text,            -- file inside the private "cvs" bucket
  cv_name text,            -- original file name
  language text default 'en',
  customer_id uuid references auth.users(id) on delete set null,
  status text not null default 'new',   -- new | shortlisted | interview | hired | rejected
  notes text,                            -- internal notes (admins only)
  created_at timestamptz default now()
);

create index if not exists job_applications_created_idx on job_applications (created_at desc);

alter table job_applications enable row level security;

drop policy if exists "public send job_applications" on job_applications;
create policy "public send job_applications" on job_applications for insert
  with check (
    status = 'new'
    and notes is null
    and (customer_id is null or customer_id = auth.uid())
    and char_length(full_name) between 1 and 200
    and char_length(email) between 3 and 200
    and char_length(phone) between 3 and 40
    and coalesce(char_length(cover_note), 0) <= 3000
  );

drop policy if exists "admins manage job_applications" on job_applications;
create policy "admins manage job_applications" on job_applications for all
  using (public.is_admin()) with check (public.is_admin());

grant insert on job_applications to anon, authenticated;

-- ---------- Private CV storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cvs', 'cvs', false, 5242880,
  array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- anyone may upload a CV (cannot list, read, overwrite or delete)
drop policy if exists "public upload cvs" on storage.objects;
create policy "public upload cvs" on storage.objects for insert
  with check (bucket_id = 'cvs');

-- only admins can open / delete CVs
drop policy if exists "admins read cvs" on storage.objects;
create policy "admins read cvs" on storage.objects for select
  using (bucket_id = 'cvs' and public.is_admin());

drop policy if exists "admins delete cvs" on storage.objects;
create policy "admins delete cvs" on storage.objects for delete
  using (bucket_id = 'cvs' and public.is_admin());
