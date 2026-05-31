## Database Documentation

- `ERD.md`: Entity relationship diagram for the `public` schema.
- `data-dictionary.md`: Table-by-table purpose, key columns, enums, and access intent.
- `schema-changelog.md`: Human-readable history of schema/documentation updates.

### Suggested Workflow

1. Make schema changes in migration SQL.
2. Apply migration to Supabase.
3. Verify live schema (SQL editor or PostgREST introspection).
4. Update these docs in the same PR.

### Quick Live Table Check (SQL)

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```
