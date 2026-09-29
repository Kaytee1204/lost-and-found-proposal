# Hướng dẫn kiểm thử MVP bằng Postman

Tài liệu này dùng cho backend hiện tại: ảnh được truyền bằng URL HTTPS, tìm kiếm bằng chữ và bộ lọc, chưa có API upload ảnh hoặc AI matching.

## 1. Chuẩn bị

Tại thư mục dự án, chạy:

```powershell
docker compose --profile app up -d --build
```

Kiểm tra `http://localhost:8080/v3/api-docs` trả về JSON. Trong Postman, mở workspace, chọn **Use resources or import → Import**, rồi chọn file [lost-and-found_postman_collection.json](lost-and-found_postman_collection.json). Collection đã có 32 request và các script lưu token/ID. Bạn có thể chạy từng request theo số thứ tự hoặc chọn collection → **Run → Functional → Run manually → Start run**. Postman chạy request theo thứ tự trong collection. Xem thêm [cách import](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data) và [Collection Runner](https://learning.postman.com/docs/tests-and-scripts/run-tests/run-tests-manually).

Collection dùng **collection variables**, không cần tạo Postman Environment. Các script lưu token/ID bằng [`pm.collectionVariables.set`](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-variables). `baseUrl` mặc định là `http://localhost:8080`; sửa biến này nếu backend chạy ở nơi khác. Chọn body dạng **raw → JSON** nếu tự tạo request. Các request cần đăng nhập đã có header `Authorization: Bearer {{ownerToken}}`, `{{finderToken}}` hoặc `{{adminToken}}`.

| Biến | Được tạo ở bước | Công dụng |
| --- | --- | --- |
| `runId`, `eventDate` | 01 | Tạo email duy nhất và ngày đăng tin cho mỗi lượt chạy |
| `ownerToken`, `ownerId` | 01 | Tài khoản người mất đồ |
| `finderToken`, `finderId` | 02 | Tài khoản người nhặt được đồ |
| `lostItemId`, `foundItemId` | 05–06 | Hai bài đăng cần liên kết |
| `claimId`, `roomId` | 12, 20 | Claim và phòng chat |
| `reportId`, `notificationId` | 26, 31 | Báo cáo và thông báo |
| `adminToken` | 27 | Tài khoản admin |

`imageUrl` và `evidenceImageUrl` trong collection là URL `https://example.com/...` để thử việc lưu link. Backend **không tải ảnh từ URL**; muốn xem ảnh thật trên client, hãy thay bằng link ảnh cloud có thể truy cập.

## 2. Chạy luồng chính

Chạy **01 → 32 theo thứ tự**. Mỗi request có Postman test kiểm tra HTTP `200` và `success: true`; các bước quan trọng còn kiểm tra trạng thái hoặc lưu ID tự động.

| Bước | Vai trò | Thao tác | Kết quả cần thấy |
| --- | --- | --- | --- |
| 01–04 | Owner, finder | Đăng ký hai tài khoản, xem `/me`, cập nhật profile | Có hai JWT và hai user ID riêng |
| 05–07 | Owner, finder | Đăng bài Lost, Found, rồi sửa bài Found | `data.imageUrl` giữ nguyên URL HTTPS; ID được lưu |
| 08–11 | Owner | Duyệt bài, tìm bằng chữ, xem bài của mình và chi tiết Found | Kết quả tìm có bài Found vừa tạo |
| 12–13 | Owner → finder | Gửi claim, finder xem claim nhận được | `data.status` là `WAITING_FINDER_VERIFICATION`; `identifyingDetails` chỉ xem qua API của người tham gia |
| 14–16 | Finder → owner | Yêu cầu thêm thông tin, owner trả lời, finder xem lịch sử | Claim chuyển `REQUEST_MORE_INFO`, rồi quay về `WAITING_FINDER_VERIFICATION` |
| 17–19 | Finder, owner | Chấp nhận claim, xem chi tiết và danh sách đã gửi | Claim là `APPROVED`; phòng chat được tạo |
| 20–22 | Owner, finder | Lấy phòng chat, gửi tin, đọc lịch sử | Có `roomId`; tin nhắn xuất hiện trong lịch sử |
| 23–25 | Finder → owner | Finder đề xuất, owner xác nhận bàn giao, xem bài Found | Handover là `CONFIRMED`; bài Found là `RETURNED`; phòng chat đóng |
| 26–30 | Owner, admin | Gửi report, admin xem, dismiss, xem dashboard | Report là `DISMISSED`; dashboard có các số đếm |
| 31–32 | Owner | Xem thông báo và đánh dấu đã đọc | `data.read` là `true` |

### Cấu trúc response

Response thành công có dạng:

```json
{
  "success": true,
  "code": 200,
  "message": "...",
  "data": {},
  "timestamp": "..."
}
```

Với API danh sách bài đăng, `data` có `content`, `page`, `size`, `totalElements`, `totalPages`, `last`. Với API claim/chat/report, `data` là DTO tương ứng, không phải JPA entity.

### Ví dụ body quan trọng

Tạo bài Lost hoặc Found (`POST /api/v1/items/lost` hoặc `/found`):

```json
{
  "itemName": "Black wallet",
  "description": "Black leather wallet with blue lining",
  "location": "Campus library",
  "eventDate": "2026-09-29",
  "imageUrl": "https://cdn.example.com/wallet.jpg"
}
```

`itemName` và `eventDate` là bắt buộc. `imageUrl` có thể bỏ qua; nếu cung cấp thì phải là URL HTTPS, tối đa 500 ký tự. Khi dùng `provinceCode`/`wardCode`, mã phải có trong bảng địa giới; hiện chưa có dữ liệu seed, nên ví dụ dùng `location` dạng chữ.

Gửi claim (`POST /api/v1/items/{{foundItemId}}/claims`):

```json
{
  "lostItemId": "{{lostItemId}}",
  "identifyingDetails": "Blue lining in the inner pocket",
  "evidenceImageUrl": "https://cdn.example.com/evidence.jpg"
}
```

`identifyingDetails` là bắt buộc. Finder phản hồi tại `PATCH /api/v1/claims/{{claimId}}/respond` với `decision` là `REQUEST_MORE_INFO`, `APPROVED` hoặc `REJECTED`. Khi chọn `REQUEST_MORE_INFO`, `responseNote` phải có câu hỏi. Owner trả lời ở `POST /api/v1/claims/{{claimId}}/info` với body `{"content":"A blue library card"}`.

Admin xử lý report tại `PATCH /api/v1/admin/reports/{{reportId}}/resolve` với `action` là `DISMISS`, `RESOLVE`, `LOCK_USER` hoặc `CLOSE_ITEM`. Collection dùng `DISMISS` để tránh khóa tài khoản thử.

## 3. Kiểm thử lỗi và phân quyền

Các bước dưới đây nên chạy riêng sau luồng chính, không chèn giữa các bước 01–32:

Với hai ca “người lạ”, đăng ký thêm một tài khoản bằng `POST /api/v1/auth/register` và dùng token của tài khoản đó. Với ca đóng bài, tạo một bài Found mới chưa có claim.

| Thử nghiệm | Cách thực hiện | Kỳ vọng |
| --- | --- | --- |
| URL ảnh nội bộ | Tạo bài với `"imageUrl":"/api/v1/images/a.jpg"` | HTTP `400` |
| Claim không có chi tiết | Gửi claim với `identifyingDetails` rỗng | HTTP `400` |
| Người lạ xem claim | Gọi `GET /api/v1/claims/{{claimId}}` bằng token không thuộc owner/finder | HTTP `403` |
| Người lạ đọc chat | Gọi `GET /api/v1/chat/rooms/{{roomId}}/messages` bằng token người lạ | HTTP `403` |
| Owner gọi admin API | Gọi `GET /api/v1/admin/reports` bằng `ownerToken` | HTTP `403` |
| Đánh dấu `RETURNED` trực tiếp | `PATCH /api/v1/items/{{idBaiMoi}}/close` với `{"status":"RETURNED"}` | HTTP `400`; phải hoàn tất handover để có `RETURNED` |

Muốn thử đóng bài thủ công, hãy tạo **một bài khác chưa có claim**, rồi gọi `PATCH /api/v1/items/{{id}}/close` với `{"status":"CLOSED"}`. Không dùng bài Found của luồng chính vì nó đang đi qua claim và handover.

## 4. Admin và dữ liệu thử

Bước 27 dùng tài khoản admin được seed trong Flyway V1 ở môi trường local: `0987654321` / `admin`. Nếu mật khẩu đã được đổi, sửa collection variables `adminPhone` và `adminPassword` trước khi chạy. Không chạy collection với tài khoản hoặc database production.

Các request tạo user, item, claim, chat và report thật trong database; backend hiện chưa có API xóa dữ liệu thử. Dùng database dev/test riêng, hoặc dọn các bản ghi có email `owner-<runId>@example.com` và `finder-<runId>@example.com` sau khi kiểm thử.

Swagger tại `http://localhost:8080/swagger-ui.html` giúp xem thêm schema request/response. Hiện không có `/api/v1/images`, `/api/v1/search/image` hoặc `/api/v1/items/{id}/matches`.
