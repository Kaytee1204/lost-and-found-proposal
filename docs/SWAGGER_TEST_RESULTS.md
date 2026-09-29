# Kết quả kiểm thử API theo Swagger/OpenAPI

**Ngày chạy:** 29/09/2026

**Môi trường:** Docker Compose local, backend `http://localhost:8080`, PostgreSQL local

**Cách chạy:** [scripts/swagger_smoke.py](../scripts/swagger_smoke.py) tải `/v3/api-docs`, kiểm tra đường dẫn/phương thức rồi gửi HTTP request tương đương **Try it out** của Swagger UI. Trang Swagger UI cũng trả HTTP 200. Bài kiểm thử được chạy tự động qua HTTP; không thao tác thủ công trong trình duyệt.

**Kết quả:** 75/75 kiểm tra thành công, script kết thúc với mã 0.

| Nhóm | Kết quả đã kiểm tra |
| --- | --- |
| Swagger | Trang UI mở được; OpenAPI có `bearerAuth`; endpoint claim yêu cầu Bearer JWT |
| Authentication/Profile | Đăng ký hai user, đăng nhập, `/me`, cập nhật profile |
| Item/Search | Tạo Lost/Found bằng URL HTTPS, sửa/xem bài, lọc danh sách, bài của tôi, tìm kiếm văn bản, đóng bài riêng |
| Claim | Gửi/xem claim, yêu cầu thêm thông tin, trả lời, xem lịch sử, duyệt claim |
| Chat/Handover | Xem phòng, gửi/đọc tin nhắn, đề xuất và xác nhận bàn giao; bài Found chuyển `RETURNED` |
| Notifications/Reports/Admin | Xem và đánh dấu thông báo, tạo report, admin xem report/dashboard rồi `DISMISS` report |
| Phân quyền/validation | Thiếu token → 401; user không phải admin và sai chủ bài → 403; URL ảnh HTTP, claim rỗng và `RETURNED` trực tiếp → 400 |

Các ID từ lần chạy này: `run_id=f0015a49a0`, `owner=75ec8fd0-969c-4d37-9c38-a40b467938f0`, `finder=33f35518-96ff-48be-9c8a-5b3a79e34982`, `lost=dd4fcbf8-dfc1-444e-845e-dcb17b4c95a9`, `found=484ba01a-d006-42ba-a261-66e5bdf70251`, `claim=9d72f740-773e-4fe6-bc41-071fcbc0ce43`, `room=a147dfa6-4b4b-404d-b161-1f335fd2e6f6`, `report=4fc890e2-31b5-437a-a13f-9212fe498c04`.

Chạy lại bằng:

```powershell
docker compose --profile app up -d --build
python scripts/swagger_smoke.py
```

Script tạo email ngẫu nhiên cho mỗi lượt chạy, nhưng **không xóa dữ liệu thử** khỏi database local. Các URL `https://example.com/...` được dùng để xác minh việc lưu link, không kiểm tra ảnh có tải được từ cloud.
