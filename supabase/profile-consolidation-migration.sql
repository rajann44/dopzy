-- One-time migration: consolidate client_profiles and tasker_profiles into users
-- Safe to run on an existing database that still has the old profile tables.

-- 1) Add new columns to users (idempotent)
alter table public.users add column if not exists bio text not null default '';
alter table public.users add column if not exists location text not null default 'Berlin';
alter table public.users add column if not exists is_verified boolean not null default false;

alter table public.users add column if not exists tasker_skills jsonb not null default '[]'::jsonb;
alter table public.users add column if not exists tasker_categories jsonb not null default '[]'::jsonb;
alter table public.users add column if not exists tasker_rating numeric(3,2) not null default 5.00;
alter table public.users add column if not exists tasker_review_count integer not null default 0;
alter table public.users add column if not exists tasker_completed_jobs integer not null default 0;
alter table public.users add column if not exists tasker_response_time text not null default '< 1 hour';
alter table public.users add column if not exists tasker_is_top_rated boolean not null default false;
alter table public.users add column if not exists tasker_is_fast_responder boolean not null default false;
alter table public.users add column if not exists tasker_total_earnings numeric(10,2) not null default 0;
alter table public.users add column if not exists tasker_availability text not null default 'Flexible';
alter table public.users add column if not exists tasker_hourly_rate numeric(10,2);
alter table public.users add column if not exists tasker_qualifications jsonb not null default '[]'::jsonb;
alter table public.users add column if not exists tasker_languages jsonb not null default '[]'::jsonb;
alter table public.users add column if not exists tasker_transport text;
alter table public.users add column if not exists tasker_portfolio jsonb not null default '[]'::jsonb;

-- 2) Backfill shared client/profile fields if old tables exist
do $$
begin
  if to_regclass('public.client_profiles') is not null then
    update public.users u
    set
      bio = coalesce(nullif(u.bio, ''), coalesce(cp.bio, '')),
      location = coalesce(nullif(u.location, ''), cp.location, 'Berlin'),
      is_verified = u.is_verified or coalesce(cp.is_verified, false)
    from public.client_profiles cp
    where cp.user_id = u.id;
  end if;
end $$;

-- 3) Backfill tasker fields if old table exists
do $$
begin
  if to_regclass('public.tasker_profiles') is not null then
    update public.users u
    set
      bio = coalesce(nullif(u.bio, ''), coalesce(ct.bio, '')),
      location = coalesce(nullif(u.location, ''), ct.location, 'Berlin'),
      tasker_skills = coalesce(ct.skills, '[]'::jsonb),
      tasker_categories = coalesce(ct.categories, '[]'::jsonb),
      tasker_rating = coalesce(ct.rating, 5.00),
      tasker_review_count = coalesce(ct.review_count, 0),
      tasker_completed_jobs = coalesce(ct.completed_jobs, 0),
      tasker_response_time = coalesce(ct.response_time, '< 1 hour'),
      tasker_availability = coalesce(ct.availability, 'Flexible'),
      tasker_hourly_rate = ct.hourly_rate,
      tasker_qualifications = coalesce(ct.qualifications, '[]'::jsonb),
      tasker_languages = coalesce(ct.languages, '[]'::jsonb),
      tasker_transport = ct.transport,
      tasker_portfolio = coalesce(ct.portfolio, '[]'::jsonb),
      is_verified = u.is_verified
    from public.tasker_profiles ct
    where ct.user_id = u.id;
  end if;
end $$;

-- 4) Add/refresh check constraint for rating bounds
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_tasker_rating_check'
  ) then
    alter table public.users
      add constraint users_tasker_rating_check
      check (tasker_rating >= 1.00 and tasker_rating <= 5.00);
  end if;
end $$;

-- 5) Remove old policies/tables (if present)
drop policy if exists "Allow read access to client profiles" on public.client_profiles;
drop policy if exists "Allow clients to manage own profile" on public.client_profiles;
drop policy if exists "Allow read access to tasker profiles" on public.tasker_profiles;
drop policy if exists "Allow taskers to manage own profile" on public.tasker_profiles;

drop table if exists public.client_profiles;
drop table if exists public.tasker_profiles;
