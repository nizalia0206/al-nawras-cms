-- ============================================================
-- Tightens team_members and certifications to the same is_admin
-- security model as customers_and_auth.sql.
--
-- Run this AFTER both migration_team_certifications.sql AND
-- customers_and_auth.sql. If you run it before customers_and_auth.sql
-- (i.e. the `profiles` table doesn't exist yet), it will fail —
-- run customers_and_auth.sql first.
-- ============================================================

drop policy if exists "admins write team_members" on team_members;
create policy "admins write team_members" on team_members for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "admins write certifications" on certifications;
create policy "admins write certifications" on certifications for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));