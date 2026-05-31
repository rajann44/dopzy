-- ============================================================================
-- SEED DATA FOR DOPZY
-- Run this in your Supabase SQL Editor to populate the users and tasks.
-- All passwords are set to "123456"
-- ============================================================================

-- ─── 1. DECLARE TEMPORARY VARIABLES FOR ID RETRIEVAL ───────────────────────
do $$
declare
  client_id uuid := 'a1111111-1111-1111-1111-111111111111';
  cotasker_id uuid := 'b2222222-2222-2222-2222-222222222222';
  admin_id uuid := 'c3333333-3333-3333-3333-333333333333';
begin

  -- ─── 2. INSERT INTO AUTH.USERS (With Encrypted Passwords) ─────────────────
  
  -- Insert Client User
  insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  values (
    client_id,
    'client@dopzy.com',
    crypt('123456', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name": "Sarah Client"}'::jsonb,
    'authenticated',
    'authenticated'
  ) on conflict (id) do nothing;

  -- Insert Co-tasker User
  insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  values (
    cotasker_id,
    'cotasker@dopzy.com',
    crypt('123456', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name": "Marcus Tasker"}'::jsonb,
    'authenticated',
    'authenticated'
  ) on conflict (id) do nothing;

  -- Insert Admin User
  insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  values (
    admin_id,
    'admin@dopzy.com',
    crypt('123456', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name": "Dopzy Administrator"}'::jsonb,
    'authenticated',
    'authenticated'
  ) on conflict (id) do nothing;

  -- ─── 3. UPDATE PUBLIC.USERS WITH CORRECT ROLES ────────────────────────────
  -- The on_auth_user_created trigger automatically creates the profiles,
  -- so we update them with their specific roles and status values:

  update public.users
  set role = 'client', name = 'Sarah Client'
  where id = client_id;

  update public.users
  set role = 'cotasker', co_tasker_status = 'approved', name = 'Marcus Tasker'
  where id = cotasker_id;

  update public.users
  set role = 'admin', name = 'Dopzy Administrator'
  where id = admin_id;

  -- Insert cotasker profile details
  insert into public.cotasker_profiles (user_id, bio, skills, categories, location, rating, review_count, completed_jobs, availability, hourly_rate)
  values (
    cotasker_id,
    'Experienced local handyman specializing in flat-pack furniture assembly, wall mounting, and basic repairs. Quick responder and reliable service.',
    '["Furniture Assembly", "Wall Mounting", "Painting", "Basic Plumbing"]'::jsonb,
    '["Handy Person", "Furniture Assembly", "Repairs"]'::jsonb,
    'Berlin',
    4.9,
    14,
    28,
    'Flexible hours, weekends available',
    35.00
  ) on conflict (user_id) do nothing;

  -- ─── 4. SEED SAMPLE TASKS ──────────────────────────────────────────────────
  
  -- Task 1: Clean 3-room apartment (Approved)
  insert into public.tasks (id, title, description, category, location, address, date, time, budget_type, budget, client_id, status, moderation_status)
  values (
    'e1111111-1111-1111-1111-111111111111',
    'Deep clean 3-room apartment',
    'Need a thorough cleaning of a 3-room apartment in Kreuzberg before moving out. Kitchen, bathroom, windows, and floors need to be spotless. Cleaning materials should be provided by you.',
    'Cleaning',
    'Berlin',
    'Kreuzberg, 10999',
    current_date + interval '5 days',
    '10:00',
    'fixed',
    150.00,
    client_id,
    'open',
    'approved'
  ) on conflict (id) do nothing;

  -- Task 2: Help mounting shelves and mirror (Pending moderation)
  insert into public.tasks (id, title, description, category, location, address, date, time, budget_type, budget, client_id, status, moderation_status)
  values (
    'e2222222-2222-2222-2222-222222222222',
    'Mount 3 Ikea shelves & bathroom mirror',
    'Looking for a handy person to mount 3 floating shelves in the living room (brick wall) and a large mirror in the bathroom (tiled wall). Please bring your own drill, wall plugs, and screws.',
    'Handy Person',
    'Berlin',
    'Mitte, 10115',
    current_date + interval '3 days',
    '14:00',
    'fixed',
    80.00,
    client_id,
    'open',
    'pending'
  ) on conflict (id) do nothing;

end $$;
