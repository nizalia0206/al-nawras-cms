-- Systems & Solutions cards now show a short description and an optional brand tag
-- (same card as the Brands / Products page).
--
-- ALREADY HAVE A LIVE DATABASE? Run this once: Supabase → SQL Editor → New query →
-- paste → Run. It is safe to run more than once. (New installs get these columns from
-- schema.sql, so they don't need this file.)

alter table system_images add column if not exists description text;
alter table system_images add column if not exists brand text;
