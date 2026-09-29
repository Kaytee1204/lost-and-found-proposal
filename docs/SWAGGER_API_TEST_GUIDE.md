# Hướng dẫn kiểm thử API MVP trên Swagger UI

Tài liệu này áp dụng cho backend hiện tại. Ảnh được lưu bằng **URL HTTPS**; chưa có API upload ảnh hoặc AI matching. Hãy dùng database local/dev vì các bước dưới đây tạo dữ liệu thật.

## 1. Khởi động và đăng nhập trên Swagger

Chạy tại thư mục gốc dự án:

```powershell
docker compose --profile app up -d --build
```

Mở [Swagger UI](http://localhost:8080/swagger-ui.html). Nếu trang chưa lên, kiểm tra `http://localhost:8080/v3/api-docs` và log container `docker compose --profile app logs backend`.

Với mỗi API: mở endpoint → **Try it out** → nhập path/query hoặc JSON body → **Execute**. Kết quả thành công có HTTP `200`, `success: true`, `code: 200`; dữ liệu nằm trong `data`.

Sau khi gọi `POST /api/v1/auth/register` hoặc `/login`, sao chép **`data.token`**. Nhấn **Authorize** (biểu tượng ổ khóa) ở đầu trang, dán **chỉ chuỗi token**, không thêm `Bearer `; Swagger tự thêm tiền tố này. Nhấn **Authorize** rồi **Close**. Khi chuyển giữa các tài khoản, mở lại Authorize, thay token, xác nhận rồi mới gọi API tiếp theo. Swagger UI không tự lưu ID trả về: hãy chép các UUID vào bảng dưới để dán ở các bước sau.

| Giá trị | Lấy từ đâu |
| --- | --- |
| `ownerToken`, `ownerId` | Đăng ký người mất đồ; `data.token`, `data.user.id` |
| `finderToken`, `finderId` | Đăng ký người nhặt được đồ |
| `lostItemId`, `foundItemId` | `data.id` của hai bài đăng |
| `claimId` | `data.id` khi gửi claim |
| `roomId` | `data[0].id` từ danh sách phòng chat |
| `reportId`, `notificationId` | `data.id` của report và phần tử trong danh sách thông báo |

Hai tài khoản thử nghiệm phải có email/số điện thoại **chưa dùng**. Ví dụ dưới đây dùng email; đổi phần `001` trước mỗi lần chạy lại. Mật khẩu phải có ít nhất 8 ký tự, một chữ số và một ký tự đặc biệt. Ngày `eventDate` dùng định dạng `YYYY-MM-DD`. URL ảnh mẫu chỉ kiểm tra việc **lưu link**, không bảo đảm tải được ảnh thật.

## 2. Tài khoản và bài đăng

### 2.1. Tạo owner và finder

Gọi `POST /api/v1/auth/register` hai lần, chưa cần token.

**Owner — người mất đồ:**

```json
{
  "fullName": "Test Owner",
  "email": "swagger-owner-001@example.com",
  "password": "Test@1234"
}
```

**Finder — người nhặt được đồ:**

```json
{
  "fullName": "Test Finder",
  "email": "swagger-finder-001@example.com",
  "password": "Test@1234"
}
```

Lưu riêng hai token và ID. Có thể kiểm tra `POST /api/v1/auth/login` bằng body `{"email":"swagger-owner-001@example.com","password":"Test@1234"}`; API cũng nhận `phone` thay `email`. Đổi sang `ownerToken`, gọi `GET /api/v1/auth/me` và xác nhận `data.id = ownerId`.

Gọi `PUT /api/v1/users/profile` với token owner:

```json
{
  "fullName": "Test Owner Updated",
  "address": "District 1, Ho Chi Minh City",
  "preferredLanguage": "vi"
}
```

Kết quả: `data.fullName` và `data.address` được cập nhật.

### 2.2. Tạo, xem và tìm bài đăng

Với `ownerToken`, gọi `POST /api/v1/items/lost`:

```json
{
  "itemName": "Black wallet",
  "category": "Wallet",
  "description": "Black leather wallet with blue lining",
  "location": "Campus library",
  "eventDate": "2026-09-28",
  "imageUrl": "https://example.com/lost-wallet.jpg"
}
```

Lưu `data.id` thành `lostItemId`; `data.itemType = LOST`, `data.status = LOST`, `data.imageUrl` bằng URL đã gửi.

Chuyển sang `finderToken`, gọi `POST /api/v1/items/found`:

```json
{
  "itemName": "Black wallet found at library",
  "category": "Wallet",
  "description": "Wallet found near the library entrance",
  "location": "Campus library",
  "eventDate": "2026-09-28",
  "imageUrl": "https://example.com/found-wallet.jpg"
}
```

Lưu `foundItemId`; `data.itemType = FOUND`, `data.status = FOUND`. Gọi `PUT /api/v1/items/{id}` với `id = foundItemId`, vẫn dùng token finder, và gửi lại đầy đủ các trường cần giữ vì đây là cập nhật toàn bộ:

```json
{
  "itemName": "Black wallet found near campus library",
  "category": "Wallet",
  "description": "Wallet with blue lining",
  "location": "Campus library",
  "eventDate": "2026-09-28",
  "imageUrl": "https://example.com/found-wallet.jpg"
}
```

Kiểm tra `data.itemName` mới. Sau đó thử các API đọc sau:

| API | Nhập trên Swagger | Kết quả cần thấy |
| --- | --- | --- |
| `GET /api/v1/items/{id}` | `id = foundItemId`; có thể bỏ token | Đúng bài Found, `data.id = foundItemId` |
| `GET /api/v1/items` | `type=FOUND`, `keyword=wallet`, `page=0`, `size=10`; bỏ trống bộ lọc khác | `data.content` chứa bài Found; có thông tin phân trang |
| `GET /api/v1/items/my-posts` | Dùng `finderToken` | Chứa bài Found của finder, không chứa bài Lost của owner |
| `POST /api/v1/search/text` | Dùng một token bất kỳ; body bên dưới | `data.content` chứa bài Found |

Body tìm kiếm văn bản:

```json
{
  "keyword": "wallet",
  "type": "FOUND",
  "category": "Wallet",
  "page": 0,
  "size": 10
}
```

`GET /api/v1/items` cho phép lọc thêm `status`, `provinceCode`, `fromDate`, `toDate`; `sortBy` chỉ nhận `createdAt`, `eventDate`, `itemName`; `direction` nhận `asc` hoặc `desc`. Không cần điền `provinceCode`/`wardCode` trong bài mẫu vì database local có thể chưa seed dữ liệu địa giới.

## 3. Claim, trao đổi, chat và bàn giao

**Giữ nguyên bài Found đang mở** cho luồng này. Chuyển sang `ownerToken`, gọi `POST /api/v1/items/{itemId}/claims` với `itemId = foundItemId`:

```json
{
  "lostItemId": "DAN-LOST-ITEM-ID-VAO-DAY",
  "identifyingDetails": "Blue lining inside the wallet",
  "evidenceImageUrl": "https://example.com/wallet-evidence.jpg",
  "note": "I lost this near the library"
}
```

Thay chuỗi mẫu bằng UUID thật. Lưu `data.id` thành `claimId`. Kỳ vọng `data.status = WAITING_FINDER_VERIFICATION`. `lostItemId` có thể bỏ qua nếu không liên kết bài Lost.

| Thứ tự | Token | API và dữ liệu nhập | Kết quả cần thấy |
| ---: | --- | --- | --- |
| 1 | owner | `GET /api/v1/claims/sent` | Có `claimId` |
| 2 | finder | `GET /api/v1/claims/received` | Có `claimId` |
| 3 | finder | `PATCH /api/v1/claims/{id}/respond`, `id=claimId`, body `{"decision":"REQUEST_MORE_INFO","responseNote":"What is inside?"}` | `status = REQUEST_MORE_INFO` |
| 4 | owner | `GET /api/v1/claims/{id}`, `id=claimId` | Xem được claim của mình |
| 5 | owner | `POST /api/v1/claims/{id}/info`, body `{"content":"A blue library card"}` | Có `data.content`; claim quay lại trạng thái chờ finder |
| 6 | finder | `GET /api/v1/claims/{id}/info` | Có câu hỏi và câu trả lời |
| 7 | finder | `PATCH /api/v1/claims/{id}/respond`, body `{"decision":"APPROVED","responseNote":"Details match"}` | `status = APPROVED`; phòng chat được tạo |
| 8 | owner | `GET /api/v1/chat/rooms` | Tìm phòng có `claimId`; lưu `roomId` |
| 9 | owner | `POST /api/v1/chat/rooms/{roomId}/messages`, body `{"content":"Can we meet at the library?"}` | Có `data.id`, `data.content` |
| 10 | finder | `GET /api/v1/chat/rooms/{roomId}/messages` | Thấy tin nhắn vừa gửi |
| 11 | finder | `POST /api/v1/claims/{id}/handover/propose` | `data.status = PROPOSED` |
| 12 | owner | `POST /api/v1/claims/{id}/handover/confirm` | `data.status = CONFIRMED` |
| 13 | bất kỳ | `GET /api/v1/items/{id}`, `id=foundItemId` | `data.status = RETURNED` |

Người xác nhận bàn giao phải **khác** người đề xuất. Sau khi xác nhận, phòng chat đóng và cả bài Lost đã liên kết cũng chuyển `RETURNED`. Muốn thử nhánh `REJECTED`, hãy tạo **bài Found và claim mới**; claim đã `APPROVED` không thể đổi quyết định.

## 4. Thông báo, report và admin

Chuyển sang `ownerToken`, gọi `GET /api/v1/notifications`; chọn một `data[].id` chưa đọc làm `notificationId`, rồi gọi `PATCH /api/v1/notifications/{id}/read`. Kết quả `data.read = true`.

Gọi `POST /api/v1/reports` với `ownerToken`:

```json
{
  "targetType": "ITEM",
  "targetId": "DAN-FOUND-ITEM-ID-VAO-DAY",
  "reason": "TEST_REPORT",
  "description": "Swagger manual test"
}
```

Thay UUID mẫu; lưu `data.id` thành `reportId`, `data.status = PENDING`. `targetType` nhận `ITEM`, `USER` hoặc `CLAIM` với `targetId` tương ứng.

Tài khoản admin được seed cho database local bởi Flyway: số điện thoại `0987654321`, mật khẩu `admin`. Gọi `POST /api/v1/auth/login` với body `{"phone":"0987654321","password":"admin"}`, lưu `data.token` rồi Authorize lại bằng token admin. Nếu môi trường đã đổi mật khẩu thì dùng thông tin admin của môi trường đó.

| API | Cách thử | Kết quả cần thấy |
| --- | --- | --- |
| `GET /api/v1/admin/reports` | Dùng admin token | Danh sách có `reportId` đang `PENDING` |
| `GET /api/v1/admin/dashboard` | Dùng admin token | `data.users`, `items`, `claims`, `pendingReports` là các số đếm |
| `PATCH /api/v1/admin/reports/{id}/resolve` | `id=reportId`, body `{"action":"DISMISS","adminNote":"Test only"}` | `data.status = DISMISSED` |

Các action khác là `RESOLVE`, `LOCK_USER`, `CLOSE_ITEM`. Dùng `DISMISS` trong luồng mẫu để tránh khóa tài khoản hoặc đóng bài thử ngoài ý muốn. Sau khi xử lý report, owner có thể gọi lại `GET /api/v1/notifications` để thấy thông báo mới.

## 5. Đóng bài và kiểm tra lỗi

Tạo **một bài Lost mới**, không gắn claim. Dùng token của người tạo, gọi `PATCH /api/v1/items/{id}/close` với body `{"status":"CLOSED","reason":"Test complete"}`; kết quả `data.status = CLOSED`. Không dùng bài trong luồng claim vì bài đó đã `RETURNED`.

Các trường hợp lỗi nên thử riêng sau luồng chính:

| Trường hợp | Thao tác | HTTP kỳ vọng |
| --- | --- | ---: |
| Thiếu token | Gọi `GET /api/v1/auth/me` sau khi Logout ở Swagger | 401 |
| Sai chủ bài | Dùng owner token để `PUT /api/v1/items/{foundItemId}` | 403 |
| Không phải admin | Dùng owner token gọi `GET /api/v1/admin/dashboard` | 403 |
| URL ảnh sai | Tạo bài với `"imageUrl":"http://example.com/a.jpg"` | 400 |
| Claim thiếu chi tiết | Gửi claim với `"identifyingDetails":""` | 400 |
| Trạng thái không hợp lệ | Gọi `PATCH /api/v1/items/{id}/close` với `{"status":"RETURNED"}` trên bài mới | 400 |

`imageUrl` và `evidenceImageUrl`, nếu có, phải là URL HTTPS dài tối đa 500 ký tự. Swagger UI chỉ gửi link, backend không tải ảnh từ link. Các API không có trong MVP này: `/api/v1/images`, `/api/v1/search/image`, `/api/v1/items/{id}/matches`.

Đối chiếu request/response chi tiết bằng [OpenAPI JSON](http://localhost:8080/v3/api-docs) hoặc [hướng dẫn Postman](POSTMAN_TEST_GUIDE.md).

Xem [kết quả kiểm thử Swagger/OpenAPI đã chạy](SWAGGER_TEST_RESULTS.md) và [script chạy lại](../scripts/swagger_smoke.py).
