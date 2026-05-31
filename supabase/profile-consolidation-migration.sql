-- One-time migration: consolidate client_profiles and tasker_profiles into users
-- Safe to run on an existing database that still has the old profile tables.

-- 1) Add new columns to users (idempotent)
alter table public.users add column if not exists bio text not null default '';
alter table public.users add column if not exists location text not null default 'Berlin';
alter table public.users add column if not exists is_verified boolean not null default false;

-- 1a) Ensure role/status naming is migrated first
do $$
begin
  -- Rename enum type if old name exists
  if exists (select 1 from pg_type where typname = 'cotasker_status')
     and not exists (select 1 from pg_type where typname = 'tasker_status') then
    execute 'alter type public.cotasker_status rename to tasker_status';
  end if;

  -- Rename enum value if still present
  begin
    execute 'alter type public.user_role rename value ''cotasker'' to ''tasker''';
  exception when others then
    null;
  end;

  -- Rename users status column if still old
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'co_tasker_status'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'tasker_status'
  ) then
    execute 'alter table public.users rename column co_tasker_status to tasker_status';
  end if;
end $$;

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
  if to_regclass('public.cotasker_profiles') is not null then
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
    from public.cotasker_profiles ct
    where ct.user_id = u.id;
  end if;

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

-- 3b) Backfill from old users column names if present
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'tasker_status'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'co_tasker_status'
  ) then
    execute 'update public.users set tasker_status = co_tasker_status::text::public.tasker_status where tasker_status is null';
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_skills') then
    execute 'update public.users set tasker_skills = cotasker_skills where tasker_skills = ''[]''::jsonb';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_categories') then
    execute 'update public.users set tasker_categories = cotasker_categories where tasker_categories = ''[]''::jsonb';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_rating') then
    execute 'update public.users set tasker_rating = cotasker_rating where tasker_rating = 5.00';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_review_count') then
    execute 'update public.users set tasker_review_count = cotasker_review_count where tasker_review_count = 0';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_completed_jobs') then
    execute 'update public.users set tasker_completed_jobs = cotasker_completed_jobs where tasker_completed_jobs = 0';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_response_time') then
    execute 'update public.users set tasker_response_time = cotasker_response_time where tasker_response_time = ''< 1 hour''';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_is_top_rated') then
    execute 'update public.users set tasker_is_top_rated = cotasker_is_top_rated';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_is_fast_responder') then
    execute 'update public.users set tasker_is_fast_responder = cotasker_is_fast_responder';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_total_earnings') then
    execute 'update public.users set tasker_total_earnings = cotasker_total_earnings where tasker_total_earnings = 0';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_availability') then
    execute 'update public.users set tasker_availability = cotasker_availability where tasker_availability = ''Flexible''';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_hourly_rate') then
    execute 'update public.users set tasker_hourly_rate = cotasker_hourly_rate where tasker_hourly_rate is null';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_qualifications') then
    execute 'update public.users set tasker_qualifications = cotasker_qualifications where tasker_qualifications = ''[]''::jsonb';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_languages') then
    execute 'update public.users set tasker_languages = cotasker_languages where tasker_languages = ''[]''::jsonb';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_transport') then
    execute 'update public.users set tasker_transport = cotasker_transport where tasker_transport is null';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'cotasker_portfolio') then
    execute 'update public.users set tasker_portfolio = cotasker_portfolio where tasker_portfolio = ''[]''::jsonb';
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
do $$
begin
  if to_regclass('public.client_profiles') is not null then
    execute 'drop policy if exists "Allow read access to client profiles" on public.client_profiles';
    execute 'drop policy if exists "Allow clients to manage own profile" on public.client_profiles';
  end if;

  if to_regclass('public.cotasker_profiles') is not null then
    execute 'drop policy if exists "Allow read access to co-tasker profiles" on public.cotasker_profiles';
    execute 'drop policy if exists "Allow co-taskers to manage own profile" on public.cotasker_profiles';
  end if;

  if to_regclass('public.tasker_profiles') is not null then
    execute 'drop policy if exists "Allow read access to tasker profiles" on public.tasker_profiles';
    execute 'drop policy if exists "Allow taskers to manage own profile" on public.tasker_profiles';
  end if;
end $$;

drop table if exists public.client_profiles;
drop table if exists public.cotasker_profiles;
drop table if exists public.tasker_profiles;
