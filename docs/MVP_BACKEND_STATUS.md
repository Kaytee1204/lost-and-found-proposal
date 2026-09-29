# MVP backend status

## Current scope

1. Register and sign in with email or phone. JWT requests check the account's current role and status.
2. Create, edit, browse, filter, and close Lost/Found posts. An optional `imageUrl` is an externally hosted HTTPS link (maximum 500 characters). The backend stores the link only; it does not upload, download, or process the image.
3. Search posts by keyword and metadata through `GET /api/v1/items` or `POST /api/v1/search/text`.
4. Submit a claim with private identifying details, request more information, approve/reject it, use participant-only REST chat, and confirm a two-party handover. Confirmation marks linked posts `RETURNED` and closes the room.
5. Receive in-app notifications, submit reports, and let admins review reports, lock accounts, close posts, and view basic counts.

Claim `evidenceImageUrl` and report `evidenceImageUrl` also accept externally hosted HTTPS links. The backend validates URL syntax and stores each link without fetching it. The cloud provider integration can be added later without changing these request fields.

## Run

```powershell
docker compose --profile app up -d --build
```

PostgreSQL listens on `localhost:5432`, the backend on `localhost:8080`, and Swagger UI is at `http://localhost:8080/swagger-ui.html`. For local backend development, run `docker compose up -d` followed by `.\mvnw.cmd spring-boot:run`. Use [the Postman test guide](POSTMAN_TEST_GUIDE.md) for a complete API walkthrough.

## Verified

- Maven tests and packaging pass against the existing PostgreSQL database and applied Flyway V1/V2 migrations.
- A Docker HTTP flow passed with externally hosted image URLs for posts, claim evidence, and report evidence, followed by text search, chat, and confirmed handover. Temporary test data was removed.
- Swagger no longer lists upload or AI image search endpoints. Compose runs only PostgreSQL and the backend.

## Deferred

- Image upload and cloud upload integration. The client supplies the URL for now.
- AI image matching and its service/API endpoints. The applied Flyway V2 schema still contains vector columns for future work; this backend does not read or write them.
- WebSocket chat, email/push notification delivery, and province/ward seed data.
