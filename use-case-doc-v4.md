# Use Case Doc (v4 — đã tối giản)
### Hệ thống tìm kiếm đồ thất lạc bằng hình ảnh

**Đã bỏ so với bản trước:** Refresh Token (chi tiết kỹ thuật, không phải use case), Đính kèm thêm ảnh (ngoài scope README), Cấu hình trọng số matching (hard-code thay vì làm UI cho admin).
**Đã gộp:** Text Search + Image Search + Combined Search → 1 use case "Tìm kiếm đồ vật" với 2 nhánh `<<extend>>`.

**Chuẩn phân loại:**

| Loại | Fields | Transactions |
|---|---|---|
| Simple | ≤ 7 | ≤ 3 |
| **Medium** | **≤ 15** | **≤ 7** |
| Complex | > 15 | > 7 |

**Trạng thái Item:** `LOST → FOUND → MATCHED → CLAIM_PENDING → IN_DISCUSSION → RETURNED / CLOSED`

---

## 1. Đăng ký tài khoản
**Actor:** User | **Fields (5):** fullName, email, phone, password, confirmPassword
**Transactions (5):**
1. User nhập form đăng ký
2. System kiểm tra email chưa tồn tại
3. System validate password & confirmPassword khớp
4. System hash password, tạo user (status PENDING_VERIFICATION)
5. System gửi email xác thực

---

## 2. Đăng nhập
**Actor:** User | **Fields (2):** email, password
**Transactions (4):**
1. User nhập email + password
2. System kiểm tra tài khoản & so khớp password
3. System sinh accessToken + refreshToken
4. System trả token về client

*Ghi chú kỹ thuật: việc làm mới accessToken bằng refreshToken là cơ chế nội bộ của client, không tách thành use case riêng.*

---

## 3. Quên mật khẩu / Đặt lại mật khẩu
**Actor:** User | **Fields (4):** email, token, newPassword, confirmPassword
**Transactions (6):**
1. User nhập email yêu cầu reset
2. System kiểm tra email tồn tại, sinh reset token
3. System gửi email chứa link reset
4. User nhập mật khẩu mới kèm token
5. System validate token còn hiệu lực & password hợp lệ
6. System cập nhật password, vô hiệu hóa token

---

## 4. Cập nhật hồ sơ cá nhân
**Actor:** User | **Fields (8):** fullName, phone, address, avatarUrl, bio, notifyByEmail, notifyByPush, preferredLanguage
**Transactions (5):**
1. User mở trang profile
2. System load dữ liệu hiện tại
3. User chỉnh sửa & submit
4. System validate dữ liệu
5. System lưu cập nhật

---

## 5. Đăng bài Lost Item
**Actor:** User | **Fields (15):** itemName, category, image, description, color, brand, size, material, lostLocation, lat, lng, lostDate, lostTime, additionalCharacteristics, contactPhone
**Transactions (6):**
1. User điền form + upload ảnh
2. System validate dữ liệu bắt buộc
3. System upload ảnh lên storage
4. System gọi embedding service: Tiền xử lý YOLOv8 Smart Crop + Trích xuất đặc trưng thị giác (CLIP ViT-B/16, 512D) + Trích xuất mô tả tiếng Việt (Multilingual CLIP, 512D) + Trích xuất màu sắc (Center HSV 32D)
5. System lưu record (kèm vector) vào DB, status LOST
6. System kích hoạt auto-matching nền, trả kết quả

---

## 6. Đăng bài Found Item
**Actor:** User | **Fields (15):** itemName, category, image, description, color, brand, itemCondition, material, foundLocation, lat, lng, foundDate, foundTime, additionalCharacteristics, contactPhone
**Transactions (6):** giống use case 5, khác status đầu ra = FOUND, hiển thị "Waiting for owner".

---

## 7. Chỉnh sửa bài đăng
**Actor:** User | **Fields (≤15, subset của UC5/UC6, bao gồm cả đổi ảnh)**
**Transactions (5):**
1. User mở form chỉnh sửa
2. System load dữ liệu hiện tại
3. User sửa (kể cả thay ảnh) & submit
4. System tính lại embedding nếu ảnh đổi
5. System lưu bản cập nhật, ghi log

---

## 8. Đóng / Đánh dấu đã nhận lại đồ (Returned)
**Actor:** User | **Fields (2):** status, reason
**Transactions (4):**
1. User (chủ bài đăng) chọn "Đã nhận lại đồ" sau khi hoàn tất trao đổi trực tiếp
2. System kiểm tra quyền sở hữu bài đăng
3. System cập nhật status → RETURNED hoặc CLOSED, đóng chat room liên quan
4. System ghi log & thông báo cho bên còn lại

---

## 9. Tìm kiếm đồ vật (Search Item)
**Actor:** User
Use case gốc là tìm bằng text; 2 nhánh mở rộng (`<<extend>>`):

**9a. Tìm bằng từ khóa (base flow)**
**Fields (5):** keyword, category, location, dateFrom, dateTo
**Transactions (4):**
1. User nhập từ khóa + filter
2. System parse query
3. System chạy full-text search (ts_rank)
4. System trả kết quả sắp xếp theo relevance

**9b. `<<extend>>` Tìm bằng hình ảnh**
**Fields (2):** image, topK
**Transactions (5):**
1. User upload ảnh cần tìm
2. System gửi ảnh sang embedding service
3. Embedding service trả vector 512 chiều
4. System query pgvector lấy top-K ứng viên
5. System trả kết quả kèm % similarity

**9c. `<<extend>>` Kết hợp ảnh + location + thời gian**
**Fields (6):** image, keyword, location, dateFrom, dateTo, category
**Transactions (7):**
1. User upload ảnh + nhập filter
2. System trích xuất đa phương thức: CLIP ViT-B/16 (ảnh), Multilingual CLIP (từ khóa tiếng Việt) và Center HSV (màu sắc)
3. System query pgvector theo tương đồng thị giác
4. System áp dụng Ràng buộc Nhân quả Thời gian (t_found >= t_lost - 1 ngày)
5. System tính điểm không gian (Spatial Consistency) và đo màu sắc HSV (giải quyết mù màu)
6. System áp dụng Thuật toán Trọng số Thích ứng Động (Dynamic Adaptive Weighting) + Bộ lọc Ngưỡng Thị giác Cứng (Visual Gating >= 0.55) + Phạt phi tuyến
7. System trả kết quả xếp hạng theo final score (loại bỏ ứng viên vi phạm Gating)

---

## 10. Xem chi tiết đồ vật
**Actor:** User | **Fields (0 input)**
**Transactions (3):**
1. User chọn xem chi tiết 1 item
2. System load thông tin đầy đủ + similarity breakdown (nếu có)
3. System trả dữ liệu hiển thị

---

## 11. Gửi Claim (Người mất xác minh quyền sở hữu)
**Actor:** User (claimer) | **Fields (7):** identifyingDetails, additionalPhoto, contactPhone, contactEmail, preferredMeetingTime, preferredMeetingLocation, note
**Transactions (5):**
1. User chọn "Claim item" trên một Found Item
2. User điền thông tin xác minh
3. System validate & upload ảnh bổ sung (nếu có)
4. System tạo claim (status WAITING_FINDER_VERIFICATION), item → CLAIM_PENDING
5. System thông báo cho finder

---

## 12. Người nhặt đối chiếu & phản hồi Claim
**Actor:** User (finder) | **Fields (2):** decision, responseNote
**Transactions (5):**
1. Finder xem danh sách claim gửi đến
2. Finder xem chi tiết thông tin xác minh
3. Finder đối chiếu với đồ vật thực tế
4. Finder quyết định APPROVE / REJECT / REQUEST_MORE_INFO
5. System cập nhật claim & item; nếu APPROVE → tạo chat room, item → IN_DISCUSSION

---

## 13. Nhắn tin trực tiếp giữa hai bên
**Actor:** User (claimer & finder) | **Fields (1):** messageContent
**Transactions (4):**
1. System tự động tạo chat room khi claim được Approve
2. User gửi tin nhắn
3. System lưu & phát realtime cho bên còn lại
4. System trả lịch sử chat khi mở lại room

---

## 14. Theo dõi trạng thái Claim & bài đăng
**Actor:** User | **Fields (0 input)**
**Transactions (3):**
1. User mở trang "Đơn của tôi"
2. System load danh sách claim + bài đăng kèm trạng thái
3. System trả kết quả kèm lịch sử thay đổi trạng thái

---

## 15. Nhận & xem thông báo
**Actor:** User | **Fields (1):** notificationId
**Transactions (5):**
1. System tạo notification khi có match mới / finder phản hồi / tin nhắn mới
2. System gửi push/email
3. User mở app thấy badge
4. System trả danh sách notification
5. User đánh dấu đã đọc

---

## 16. Gửi báo cáo vi phạm / tranh chấp
**Actor:** User | **Fields (5):** targetType, targetId, reason, description, evidenceImage
**Transactions (5):**
1. User chọn "Report" trên bài đăng / claim / user khác
2. User chọn lý do + mô tả + bằng chứng (tùy chọn)
3. System validate dữ liệu
4. System lưu report, liên kết đối tượng bị báo cáo
5. System đưa vào hàng đợi Admin, xác nhận với user

---

## 17. Admin xử lý báo cáo & tranh chấp
**Actor:** Admin | **Fields (2):** action, adminNote
**Transactions (6):**
1. Admin xem danh sách report chờ xử lý
2. Admin xem chi tiết report (kèm bài đăng/claim/chat liên quan)
3. Admin xem lịch sử report trước đó
4. Admin quyết định hành động xử lý
5. System áp dụng hành động
6. System ghi log & thông báo các bên liên quan

---

## 18. Quản lý người dùng (Admin)
**Actor:** Admin | **Fields (2):** status, reason
**Transactions (5):**
1. Admin xem danh sách user, tìm kiếm/lọc
2. Admin xem chi tiết hoạt động của user
3. Admin quyết định LOCKED/ACTIVE
4. System cập nhật trạng thái tài khoản
5. System gửi thông báo cho user

---

## 19. Xem dashboard thống kê (Admin)
**Actor:** Admin | **Fields (2):** dateFrom, dateTo
**Transactions (5):**
1. Admin chọn khoảng thời gian
2. System truy vấn số lượng item theo trạng thái
3. System tính peer resolution rate
4. System tính độ chính xác thu hồi Top-1 / Top-3 Recall (Recall@1, Recall@3) và MRR (Mean Reciprocal Rank)
5. System tổng hợp trả dữ liệu biểu đồ

