# Database V2

Flyway migration: `src/main/resources/db/migration/V2__expand_lost_found_schema.sql`.

## Decisions

- Keep the V1 UUID keys and existing `users`/`items` rows. Existing column names stay in place so the current JPA entities continue to work.
- Accept email or phone as an account identifier. `users.email` is unique without regard to case or surrounding whitespace when present. Email verification is deferred; V1 `ACTIVE` users remain active.
- Keep Lost and Found posts in `items`, distinguished by `item_type`. AI suggestions live in `item_matches`; finding a suggestion alone does not change the post status.
- Store at most one main item image in the existing `image_url` column. Claim and report evidence each have their own optional image URL.
- Store official province/ward codes separately from optional item coordinates. `coordinate_source = WARD_CENTROID` denotes an estimated position. Existing free-text `location` is retained.
- Store image/text/HSV vectors in pgvector and track extraction state and model version. Search uploads are temporary and have no table.
- Allow many claims for a Found post, but only one approved claim. A claim can optionally link a Lost post owned by its sender. `claim_exchanges` stores requests for more information.
- A chat room belongs to an approved claim. `handovers` stores a proposal and the other party's confirmation. Application code must enforce participant permissions and close the room after confirmation.
- Notifications are stored in the database. Email and push delivery are deferred. Reports have explicit foreign keys to one user, item, or claim target.
- Soft deletion can use `deleted_at` on users/items; application queries must exclude those rows. Claims, messages, reports, and admin logs have no cascading delete.
- V2 replaces V1's cascading `items.user_id` foreign key with `ON DELETE RESTRICT`, removes the duplicate phone index, and removes the `items.status = LOST` default so new Found posts must explicitly provide their correct initial status. These corrections were merged before V2 was first applied to the current database.

## Before applying V2

1. Back up the existing database. Do not run Flyway `clean`; the application configuration now disables it.
2. Ensure the server has the `vector` extension package installed and the migration user may run `CREATE EXTENSION vector`. Compose now defaults to `pgvector/pgvector:pg18-trixie`, matching the major version and Debian base of the existing database inspected on 2026-09-29. Set `SAGASU_POSTGRES_IMAGE=pgvector/pgvector:pg17-trixie` for a fresh PostgreSQL 17 environment. For an existing volume, select an image matching its **current major version**; changing an existing volume from PostgreSQL 18 to 17 is not an in-place downgrade.
3. Review existing emails for duplicates ignoring case/whitespace. The unique index will reject duplicates rather than discard or rewrite accounts.
4. Seed `provinces` and `wards` from a verified administrative dataset before enabling the province/ward dropdown. V2 creates the schema but does not embed a dated external dataset.

The migration adds database structure only. New JPA entities, services, API flows, authorization checks, and administrative seed data must be implemented separately. The current backend still uses phone for registration/login and a single item image.
