-- ============================================================
-- Website review updates — November 2026
-- Run once in the Supabase SQL editor (safe to re-run).
--
-- The website reads team members, partner names and any text edited in
-- Admin → Website Text from the database, so these rows have to change too,
-- otherwise the old values keep overriding the new defaults in the code.
-- ============================================================

begin;

-- 1. Team members (Minutes of Meeting, 24-10-2026) -------------------------
--    Replaces the team list with the six members from the meeting minutes.
delete from team_members;
insert into team_members (id, name, role, phone, icon, highlight, sort_order) values
  ('mg', 'Eng. Mohamed Ghazy',   'Managing Director',                    '+971 50 4544361',  'person',  false, 0),
  ('yg', 'Eng. Yasser Ghazy',    'General Manager',                      '+971 55 1099879',  'hardhat', false, 1),
  ('ag', 'Eng. Amr Ghazy',       'Sales & Business Development Manager', '+971 55 1099885',  'person',  false, 2),
  ('kf', 'Eng. Kamal Fathy',     'Projects Manager',                     '+971 55 838 7748', 'hardhat', false, 3),
  ('mm', 'Eng. Mahmoud Megahed', 'Product Manager',                      '',                 'hardhat', false, 4),
  ('th', 'Mr. Tarek Haikal',     'Procurement Manager',                  '+971 55 1099884',  'person',  false, 5);

-- 2. Partner name: "Uranus Cable (Rewire)" -> "Uranus Fire Resistant Cables"
update partners
   set name = 'Uranus Fire Resistant Cables'
 where supplier = 'uranus' or name ilike 'uranus cable%';

-- 3. Saved text overrides that still hold the OLD wording.
--    Only rows whose text is still the old default are removed, so the new
--    wording from the code shows. Anything the team deliberately rewrote stays.
delete from site_text where key = 'hero.h1line1'                    and en = 'Think Safety.';
delete from site_text where key = 'hero.h1brand'                    and en = 'Al Nawras.';
delete from site_text where key = 'hero.statBrands'                 and en = 'Global Brand Partners';
delete from site_text where key = 'about.statBrands'                and en = 'Brand Partners';
delete from site_text where key = 'brands.eyebrow'                  and en = 'Brand Partners';
delete from site_text where key = 'pages.about.overview.statBrands' and en = 'Global Brand Partners';
delete from site_text where key = 'pages.about.founder.badgeLabel'  and en = 'Message from the Managing Director';
delete from site_text where key = 'pages.products.desc'             and en like '%Uranus Cable and KD Pipes%';
delete from site_text where key = 'pages.systems.emergencyLighting.desc' and en like 'Central battery systems and DALI-addressable%';
delete from site_text where key = 'pages.systems.elv.desc'          and en like 'Structured cabling, CCTV, access control and BMS%';

commit;
