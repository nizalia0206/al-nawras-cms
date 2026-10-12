-- ============================================================
-- AL NAWRAS CMS — Contact form enquiries
-- Run ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- Safe to run more than once. Requires customers_and_auth.sql (profiles table).
--
-- Every message sent from the website's Contact page is saved here and shown
-- in the CMS under Admin -> Enquiries. Visitors can only SEND a message;
-- only admins can read, update or delete them.
-- ============================================================

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin);
$$;

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  email text not null,
  phone text,
  help_with text,
  message text not null,
  language text default 'en',
  customer_id uuid references auth.users(id) on delete set null,  -- set when a signed-in customer sends it
  status text not null default 'new',                              -- new | replied | closed
  notes text,                                                      -- internal notes (admins only)
  created_at timestamptz default now()
);

create index if not exists contact_messages_created_idx on contact_messages (created_at desc);

alter table contact_messages enable row level security;

-- Anyone on the website can send a message (no reading back, sensible size limits).
drop policy if exists "public send contact_messages" on contact_messages;
create policy "public send contact_messages" on contact_messages for insert
  with check (
    status = 'new'
    and notes is null
    and (customer_id is null or customer_id = auth.uid())
    and char_length(full_name) between 1 and 200
    and char_length(email) between 3 and 200
    and char_length(message) between 1 and 5000
  );

-- Admins manage everything.
drop policy if exists "admins manage contact_messages" on contact_messages;
create policy "admins manage contact_messages" on contact_messages for all
  using (public.is_admin()) with check (public.is_admin());

grant insert on contact_messages to anon, authenticated;
