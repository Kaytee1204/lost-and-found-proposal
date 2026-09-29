# MVP Backend Implementation Plan

**Goal:** Complete the backend flow from registering a user and posting an item with an external image URL to text search, claiming, chatting, confirming return, and handling reports.

**Architecture:** Keep the existing Spring Boot layers and Flyway migrations. Store relational data and external image URLs in PostgreSQL. Image upload and AI matching are deferred by the current product decision.

**Source:** `docs/SDD_SPRINGBOOT_BACKEND_MVP.md`, `docs/DATABASE_V2.md`, and the user-approved V2 decisions in this conversation.

## Slices and review gates

1. **Build and authentication:** restore a reliable build, support phone or email registration/login, enforce unique identifiers and locked/deleted account behavior. Check: focused tests and full Maven test command.
2. **Items and image links:** map V2 fields, accept external HTTPS image URLs, edit and close endpoints, and validate status transitions and ownership. Check: tests plus API smoke flow.
3. **Search:** text search and metadata filters. Image matching is deferred.
4. **Claims, chat, and return:** peer verification, one approved claim per Found item, participant-only messaging, two-party handover, and notifications. Check: end-to-end workflow test.
5. **Reports and admin:** report submission, admin resolution and lock actions, basic dashboard counts, API documentation. Check: role/permission tests and full build.

All five backend slices have been implemented and reviewed. See `docs/MVP_BACKEND_STATUS.md` for verified flows and MVP limits.

## Scope rules

- Keep existing UUID keys and Flyway history; add later schema changes only through new migrations.
- Do not expose AI or upload endpoints until those features are requested again.
- Preserve existing user changes in `pom.xml`, application bootstrap, and configuration.
- At each slice, report files changed, checks run, and remaining gaps before moving to the next slice.
