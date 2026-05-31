## Schema Changelog

### 2026-06-01
- Added database documentation scaffold:
  - `docs/database/ERD.md`
  - `docs/database/data-dictionary.md`
  - `docs/database/schema-changelog.md`
- Verified live Supabase `public` tables via PostgREST/OpenAPI introspection:
  - `chat_messages`
  - `chat_requests`
  - `client_profiles`
  - `conversations`
  - `cotasker_profiles`
  - `notifications`
  - `offers`
  - `reviews`
  - `tasks`
  - `users`
  - `wallet_transactions`
- Comparison result: `supabase/migration.sql` already matches the live table set and key enum model (no table-level drift detected).

### Process Notes
- Source of truth: keep schema changes in SQL migrations first, then apply to Supabase.
- Documentation update rule: update ERD + data dictionary in the same PR as schema changes.
