"""End-to-end smoke test for the routes published by local Swagger/OpenAPI."""

import json
import sys
import uuid
from urllib.error import HTTPError
from urllib.request import Request, urlopen


BASE = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:8080"
results = []
spec = None


def request(label, method, path, body=None, token=None, expected=200, openapi_path=None):
    if spec is not None and openapi_path is not None:
        assert openapi_path in spec["paths"], f"Missing OpenAPI path: {openapi_path}"
        assert method.lower() in spec["paths"][openapi_path], f"Missing OpenAPI method: {method} {openapi_path}"
    payload = None if body is None else json.dumps(body).encode("utf-8")
    headers = {"Accept": "application/json"}
    if payload is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = "Bearer " + token
    req = Request(BASE + path, data=payload, headers=headers, method=method)
    try:
        with urlopen(req, timeout=20) as response:
            status = response.status
            raw = response.read()
    except HTTPError as error:
        status = error.code
        raw = error.read()
    try:
        data = json.loads(raw)
    except ValueError:
        data = raw.decode("utf-8", errors="replace")
    if status != expected:
        raise AssertionError(f"{label}: expected HTTP {expected}, got {status}: {str(data)[:500]}")
    if expected == 200 and isinstance(data, dict) and path.startswith("/api/"):
        assert data.get("success") is True, f"{label}: response success is not true: {data}"
    results.append((label, status))
    print(f"PASS {status} {label}")
    return data.get("data") if isinstance(data, dict) and path.startswith("/api/") else data


def check(label, condition):
    if not condition:
        raise AssertionError(label)
    results.append((label, "CHECK"))
    print(f"PASS CHECK {label}")


run_id = uuid.uuid4().hex[:10]
owner_email = f"swagger-owner-{run_id}@example.com"
finder_email = f"swagger-finder-{run_id}@example.com"
password = "Test@1234"

html = request("Swagger UI", "GET", "/swagger-ui.html")
check("Swagger UI loads", "swagger" in html.lower())
spec = request("OpenAPI JSON", "GET", "/v3/api-docs")
check("Swagger bearer scheme", spec["components"]["securitySchemes"]["bearerAuth"]["scheme"] == "bearer")
check("Claim route requires bearer", spec["paths"]["/api/v1/claims/sent"]["get"]["security"] == [{"bearerAuth": []}])

owner = request("Register owner", "POST", "/api/v1/auth/register",
                {"fullName": "Swagger Owner", "email": owner_email, "password": password},
                openapi_path="/api/v1/auth/register")
owner_token = owner["token"]
owner_id = owner["user"]["id"]
finder = request("Register finder", "POST", "/api/v1/auth/register",
                 {"fullName": "Swagger Finder", "email": finder_email, "password": password},
                 openapi_path="/api/v1/auth/register")
finder_token = finder["token"]
finder_id = finder["user"]["id"]
login = request("Login owner", "POST", "/api/v1/auth/login",
                {"email": owner_email, "password": password}, openapi_path="/api/v1/auth/login")
check("Login returns owner", login["user"]["id"] == owner_id)
me = request("Current user", "GET", "/api/v1/auth/me", token=owner_token,
             openapi_path="/api/v1/auth/me")
check("Current user ID", me["id"] == owner_id)
profile = request("Update profile", "PUT", "/api/v1/users/profile",
                  {"fullName": "Swagger Owner Updated", "address": "District 1"}, owner_token,
                  openapi_path="/api/v1/users/profile")
check("Profile updated", profile["fullName"] == "Swagger Owner Updated")

lost_body = {"itemName": "Black wallet", "category": "Wallet", "description": "Blue lining",
             "location": "Campus library", "eventDate": "2026-09-28",
             "imageUrl": "https://example.com/lost-wallet.jpg"}
lost = request("Create Lost item", "POST", "/api/v1/items/lost", lost_body, owner_token,
               openapi_path="/api/v1/items/lost")
lost_id = lost["id"]
check("Lost item and URL", lost["itemType"] == "LOST" and lost["imageUrl"] == lost_body["imageUrl"])
found_body = {"itemName": "Black wallet found", "category": "Wallet", "description": "Blue lining",
              "location": "Campus library", "eventDate": "2026-09-28",
              "imageUrl": "https://example.com/found-wallet.jpg"}
found = request("Create Found item", "POST", "/api/v1/items/found", found_body, finder_token,
                openapi_path="/api/v1/items/found")
found_id = found["id"]
check("Found item", found["itemType"] == "FOUND")
found_body["itemName"] = "Black wallet found near library"
updated = request("Update Found item", "PUT", f"/api/v1/items/{found_id}", found_body,
                  finder_token, openapi_path="/api/v1/items/{id}")
check("Item updated", updated["itemName"] == found_body["itemName"])
detail = request("Get item detail", "GET", f"/api/v1/items/{found_id}",
                 openapi_path="/api/v1/items/{id}")
check("Item detail ID", detail["id"] == found_id)
listing = request("Browse/filter items", "GET", "/api/v1/items?type=FOUND&keyword=wallet&page=0&size=10",
                  openapi_path="/api/v1/items")
check("Browse contains Found item", any(i["id"] == found_id for i in listing["content"]))
mine = request("My posts", "GET", "/api/v1/items/my-posts", token=finder_token,
               openapi_path="/api/v1/items/my-posts")
check("My posts ownership", any(i["id"] == found_id for i in mine["content"]) and
      all(i["id"] != lost_id for i in mine["content"]))
search = request("Text search", "POST", "/api/v1/search/text",
                 {"keyword": "wallet", "type": "FOUND", "page": 0, "size": 10}, owner_token,
                 openapi_path="/api/v1/search/text")
check("Text search finds item", any(i["id"] == found_id for i in search["content"]))

claim = request("Submit claim", "POST", f"/api/v1/items/{found_id}/claims",
                {"lostItemId": lost_id, "identifyingDetails": "Blue lining inside",
                 "evidenceImageUrl": "https://example.com/evidence.jpg"}, owner_token,
                openapi_path="/api/v1/items/{itemId}/claims")
claim_id = claim["id"]
check("Claim waiting", claim["status"] == "WAITING_FINDER_VERIFICATION")
sent = request("Sent claims", "GET", "/api/v1/claims/sent", token=owner_token,
               openapi_path="/api/v1/claims/sent")
check("Sent claims includes new claim", any(c["id"] == claim_id for c in sent))
received = request("Received claims", "GET", "/api/v1/claims/received", token=finder_token,
                   openapi_path="/api/v1/claims/received")
check("Received claims includes new claim", any(c["id"] == claim_id for c in received))
claim_detail = request("Claim detail", "GET", f"/api/v1/claims/{claim_id}", token=owner_token,
                       openapi_path="/api/v1/claims/{id}")
check("Claim detail ID", claim_detail["id"] == claim_id)
more = request("Request more info", "PATCH", f"/api/v1/claims/{claim_id}/respond",
               {"decision": "REQUEST_MORE_INFO", "responseNote": "What is inside?"}, finder_token,
               openapi_path="/api/v1/claims/{id}/respond")
check("More info status", more["status"] == "REQUEST_MORE_INFO")
reply = request("Reply to info request", "POST", f"/api/v1/claims/{claim_id}/info",
                {"content": "A blue library card"}, owner_token,
                openapi_path="/api/v1/claims/{id}/info")
check("Info reply content", reply["content"] == "A blue library card")
history = request("Claim info history", "GET", f"/api/v1/claims/{claim_id}/info", token=finder_token,
                  openapi_path="/api/v1/claims/{id}/info")
check("Info history has two entries", len(history) == 2)
approved = request("Approve claim", "PATCH", f"/api/v1/claims/{claim_id}/respond",
                   {"decision": "APPROVED", "responseNote": "Details match"}, finder_token,
                   openapi_path="/api/v1/claims/{id}/respond")
check("Claim approved", approved["status"] == "APPROVED")

rooms = request("List chat rooms", "GET", "/api/v1/chat/rooms", token=owner_token,
                openapi_path="/api/v1/chat/rooms")
room_id = next(r["id"] for r in rooms if r["claimId"] == claim_id)
message = request("Send chat message", "POST", f"/api/v1/chat/rooms/{room_id}/messages",
                  {"content": "Meet at library?"}, owner_token,
                  openapi_path="/api/v1/chat/rooms/{roomId}/messages")
check("Message content", message["content"] == "Meet at library?")
messages = request("Read chat history", "GET", f"/api/v1/chat/rooms/{room_id}/messages",
                   token=finder_token, openapi_path="/api/v1/chat/rooms/{roomId}/messages")
check("Message in history", any(m["id"] == message["id"] for m in messages))
proposed = request("Propose handover", "POST", f"/api/v1/claims/{claim_id}/handover/propose",
                   token=finder_token, openapi_path="/api/v1/claims/{id}/handover/propose")
check("Handover proposed", proposed["status"] == "PROPOSED" and proposed["proposedBy"] == finder_id)
confirmed = request("Confirm handover", "POST", f"/api/v1/claims/{claim_id}/handover/confirm",
                    token=owner_token, openapi_path="/api/v1/claims/{id}/handover/confirm")
check("Handover confirmed", confirmed["status"] == "CONFIRMED")
returned = request("Returned item detail", "GET", f"/api/v1/items/{found_id}",
                   openapi_path="/api/v1/items/{id}")
check("Found item returned", returned["status"] == "RETURNED")

notifications = request("List notifications", "GET", "/api/v1/notifications", token=owner_token,
                        openapi_path="/api/v1/notifications")
notification_id = next(n["id"] for n in notifications if not n["read"])
read = request("Mark notification read", "PATCH", f"/api/v1/notifications/{notification_id}/read",
               token=owner_token, openapi_path="/api/v1/notifications/{id}/read")
check("Notification marked read", read["read"] is True)
report = request("Submit report", "POST", "/api/v1/reports",
                 {"targetType": "ITEM", "targetId": found_id, "reason": "TEST_REPORT",
                  "description": "Swagger smoke test"}, owner_token,
                 openapi_path="/api/v1/reports")
report_id = report["id"]
check("Report pending", report["status"] == "PENDING")
admin = request("Login admin", "POST", "/api/v1/auth/login",
                {"phone": "0987654321", "password": "admin"}, openapi_path="/api/v1/auth/login")
admin_token = admin["token"]
pending = request("Admin pending reports", "GET", "/api/v1/admin/reports", token=admin_token,
                  openapi_path="/api/v1/admin/reports")
check("Admin finds report", any(r["id"] == report_id for r in pending))
dashboard = request("Admin dashboard", "GET", "/api/v1/admin/dashboard", token=admin_token,
                    openapi_path="/api/v1/admin/dashboard")
check("Dashboard counts", dashboard["users"] >= 3 and dashboard["items"] >= 2 and dashboard["claims"] >= 1)
resolved = request("Dismiss report", "PATCH", f"/api/v1/admin/reports/{report_id}/resolve",
                   {"action": "DISMISS", "adminNote": "Test only"}, admin_token,
                   openapi_path="/api/v1/admin/reports/{id}/resolve")
check("Report dismissed", resolved["status"] == "DISMISSED")

extra = request("Create separate Lost item", "POST", "/api/v1/items/lost", lost_body, owner_token,
                openapi_path="/api/v1/items/lost")
closed = request("Close separate item", "PATCH", f"/api/v1/items/{extra['id']}/close",
                 {"status": "CLOSED", "reason": "Test complete"}, owner_token,
                 openapi_path="/api/v1/items/{id}/close")
check("Item closed", closed["status"] == "CLOSED")

request("Reject missing token", "GET", "/api/v1/auth/me", expected=401,
        openapi_path="/api/v1/auth/me")
request("Reject non-admin", "GET", "/api/v1/admin/dashboard", token=owner_token, expected=403,
        openapi_path="/api/v1/admin/dashboard")
request("Reject wrong owner", "PUT", f"/api/v1/items/{found_id}", found_body, owner_token,
        expected=403, openapi_path="/api/v1/items/{id}")
bad_body = {**lost_body, "imageUrl": "http://example.com/not-https.jpg"}
request("Reject HTTP image URL", "POST", "/api/v1/items/lost", bad_body, owner_token,
        expected=400, openapi_path="/api/v1/items/lost")
request("Reject empty claim details", "POST", f"/api/v1/items/{extra['id']}/claims",
        {"identifyingDetails": ""}, owner_token, expected=400,
        openapi_path="/api/v1/items/{itemId}/claims")
request("Reject direct RETURNED", "PATCH", f"/api/v1/items/{lost_id}/close",
        {"status": "RETURNED"}, owner_token, expected=400,
        openapi_path="/api/v1/items/{id}/close")

print(f"SUMMARY: {len(results)} checks passed; run_id={run_id}; owner={owner_id}; finder={finder_id}; "
      f"lost={lost_id}; found={found_id}; claim={claim_id}; room={room_id}; report={report_id}")
