## Schema Changelog

### 2026-06-01 (Single-table profile consolidation)
- Consolidated profile model into `public.users` as the single source of truth.
- Added profile columns to `users`:
  - Shared fields: `bio`, `location`, `is_verified`
  - Co-tasker fields: `tasker_skills`, `tasker_categories`, `tasker_rating`, `tasker_review_count`, `tasker_completed_jobs`, `tasker_response_time`, `tasker_is_top_rated`, `tasker_is_fast_responder`, `tasker_total_earnings`, `tasker_availability`, `tasker_hourly_rate`, `tasker_qualifications`, `tasker_languages`, `tasker_transport`, `tasker_portfolio`
- Removed standalone profile tables from schema definition:
  - `public.client_profiles`
  - `public.tasker_profiles`
- Updated app data access to read/write profile data from `users`.

### 2026-06-01
- Added database documentation scaffold:
  - `docs/database/ERD.md`
  - `docs/database/data-dictionary.md`
  - `docs/database/schema-changelog.md`
- Verified live Supabase `public` tables via PostgREST/OpenAPI introspection:
  - `chat_messages`
  - `chat_requests`
  - `conversations`
  - `notifications`
  - `offers`
  - `reviews`
  - `tasks`
  - `users`
  - `wallet_transactions`
- Comparison result at that time: `supabase/migration.sql` matched the live table set and key enum model.

### Process Notes
- Source of truth: keep schema changes in SQL migrations first, then apply to Supabase.
- Documentation update rule: update ERD + data dictionary in the same PR as schema changes.
