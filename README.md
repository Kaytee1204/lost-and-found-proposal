# Hệ thống tìm kiếm đồ thất lạc bằng hình ảnh

## 1. Tên đề tài

* **Tên tiếng Việt:** Hệ thống tìm kiếm đồ thất lạc bằng hình ảnh
* **Tên tiếng Anh:** Web-Based Lost and Found Management and Image Matching System

---

## 2. Lý do chọn đề tài

Trong trường đại học, ký túc xá, thư viện, phòng lab, trung tâm thương mại... thường xảy ra tình trạng:
* Sinh viên đánh mất đồ.
* Người khác nhặt được nhưng không biết tìm chủ nhân.
* Thông tin đồ thất lạc được đăng rải rác trên Facebook, Zalo, group chat.
* Người mất phải đọc hàng loạt bài đăng để tìm đồ của mình.
* Mô tả bằng văn bản thường không chính xác.

**Ví dụ:**
* Người A mất: *“Một chiếc bình nước màu đen.”*
* Người B nhặt được: *“Tìm thấy bình giữ nhiệt ở phòng 302.”*

Hai người có thể đang nói về cùng một đồ vật, nhưng hệ thống tìm kiếm bằng từ khóa (keyword search) có thể không tìm thấy.

---

## 3. Vấn đề mà đề tài giải quyết

**Phát biểu bài toán:**
> *Làm thế nào để người dùng có thể tìm kiếm đồ thất lạc dựa trên hình ảnh của đồ vật thay vì chỉ dựa vào từ khóa hoặc mô tả bằng văn bản?*

Hệ thống giải quyết 3 vấn đề chính:

* **Vấn đề 1 — Khó tìm kiếm:** Thông tin đồ thất lạc nằm rải rác. Hệ thống tạo ra một nơi lưu trữ và tìm kiếm tập trung.
* **Vấn đề 2 — Mô tả không chính xác:** Người dùng có thể mô tả *“ví màu đen”* nhưng người nhặt lại đăng *“ví da màu tối”*. Keyword search khó xác định đây có thể là cùng một đồ vật.
* **Vấn đề 3 — Khó xác định đồ vật tương ứng:** Một người có thể upload ảnh chiếc ví của mình và muốn biết: *“Trong những đồ đã được tìm thấy, có chiếc nào giống chiếc này không?”* — Đây chính là phần AI có giá trị.

---

## 4. Ý tưởng sản phẩm

Hệ thống có hai loại bài đăng:

### a. Lost Item (Đồ thất lạc)
Người mất đồ đăng:
* Ảnh đồ vật (nếu có)
* Tên đồ vật
* Mô tả
* Thời gian mất
* Địa điểm mất
* Đặc điểm nhận dạng

### b. Found Item (Đồ nhặt được)
Người nhặt được đồ đăng:
* Ảnh đồ vật (chụp hiện trạng)
* Mô tả
* Thời gian tìm thấy
* Địa điểm tìm thấy
* Đặc điểm đồ vật

Sau đó hệ thống kết nối hai loại dữ liệu:

```text
Lost Item ────┐
              ├────> Image Matching ────> Ranking ────> Possible Matches
Found Items ──┘
```

---

## 5. Ví dụ workflow thực tế

Giả sử sinh viên A mất một chiếc balo.

* **Bước 1 — Đăng đồ thất lạc:** A upload ảnh balo, Tên: *Balo*, Màu: *Đen*, Địa điểm: *Library*, Ngày: *08/09/2026*.
* **Bước 2 — Một người khác tìm thấy:** Sinh viên B đăng ảnh balo, Tên: *Balo*, Địa điểm: *Library*, Ngày: *08/09/2026*.
* **Bước 3 — AI Matching:** Hệ thống phát hiện:
  ```text
  Possible Match:
  Lost Item #102  <=======>  Found Item #387
  - Image Similarity: 94%
  - Location: Same (Library)
  - Date: Same (08/09/2026)
  ```
* **Bước 4 — Người mất xem kết quả và gửi Claim:** Hệ thống hiển thị: *“Có khả năng đây là đồ vật bạn đã mất”*. A bấm **Claim Item** và gửi kèm thông tin xác minh (Ví dụ: *“Trong ngăn trước balo có một chiếc USB màu xanh”*).
* **Bước 5 — Người nhặt đối chiếu & Hai người tự trao đổi:**
  * B xem thông tin xác minh của A. Thấy đúng, B bấm **Chấp nhận (Approve)**.
  * Hệ thống mở kênh nhắn tin trực tiếp giữa A và B.
  * Hai bên tự trao đổi, hẹn gặp tại địa điểm thuận tiện để trao trả đồ luôn mà không cần chờ Admin can thiệp.
* **Bước 6 — Hoàn tất trao trả:** Sau khi nhận lại đồ, người đăng bài đánh dấu **Đã nhận lại đồ (Returned)** để đóng bài đăng.

---

## 6. Các Actor trong hệ thống

### Actor 1 — User (Người dùng)
Có thể vừa là người mất đồ, vừa là người nhặt được đồ. Không cần tách thành *Lost Person* và *Finder* vì một người có thể đóng cả hai vai trò.
* Đăng tin đồ thất lạc / đồ nhặt được.
* Tìm kiếm theo từ khóa hoặc hình ảnh.
* Xem danh sách gợi ý tương đồng từ AI.
* Gửi Claim kèm thông tin xác minh quyền sở hữu.
* Đối chiếu thông tin xác minh của người khác gửi đến (nếu mình là người nhặt).
* Nhắn tin trực tiếp giữa hai bên để hẹn gặp trao trả đồ.

### Actor 2 — Admin (Quản trị viên)
* Quản lý bài đăng và người dùng trên hệ thống.
* **Không làm trung gian duyệt từng claim** (để hai người dùng tự xác minh và trao trả trực tiếp cho nhau, giúp hệ thống không bị chậm trễ hay quá tải).
* **Chỉ can thiệp khi có tranh chấp/báo cáo:** Xử lý các báo cáo vi phạm (report) khi có hành vi gian lận hoặc tranh chấp, khóa tài khoản vi phạm.
* Quản lý dữ liệu và theo dõi thống kê hệ thống.

---

## 7. Các chức năng chính

### Module 1 — Đăng ký / Đăng nhập
User:
* Register (Đăng ký)
* Login (Đăng nhập)
* Logout (Đăng xuất)
* Update profile (Cập nhật thông tin cá nhân)

### Module 2 — Đăng đồ thất lạc (Lost Item)
* **Input:** Item type, Item name, Image, Description, Color, Lost location, Lost date/time, Additional characteristics.
  * *Ví dụ:* Name: `Black Backpack` | Color: `Black` | Location: `Library` | Date: `08/09/2026` | Description: `Black backpack with a small red keychain.`
* **Output:** Lost item posted successfully (`Post ID: L102` | Status: `Searching`).

### Module 3 — Đăng đồ tìm thấy (Found Item)
* **Input:** Image, Description, Found location, Found date/time, Item characteristics.
* **Output:** Found item posted (`Post ID: F387` | Status: `Waiting for owner`).

### Module 4 — Tìm kiếm đồ vật
Người dùng có thể tìm bằng:
* **Cách 1 — Text:** Nhập từ khóa (Ví dụ: `black backpack`).
* **Cách 2 — Image:** Upload ảnh (Ví dụ: `[Ảnh balo]`).
* **Cách 3 — Kết hợp:** Tìm kiếm kết hợp `Image + Location + Date`.

### Module 5 — Trao đổi & Xác minh trực tiếp giữa 2 người
* Gửi yêu cầu nhận đồ (Claim Item) kèm câu trả lời xác minh chi tiết ẩn.
* Người nhặt đối chiếu và phản hồi (Approve / Reject / Request info).
* Nhắn tin nội bộ trực tiếp giữa hai người để hẹn gặp trao trả đồ.

---

## 8. Chức năng AI quan trọng nhất: Image Similarity Matching

Hệ thống nhận ảnh truy vấn (*Query Image*), sau đó tìm trong cơ sở dữ liệu:
```text
Query Image ──> [ Image 1, Image 2, Image 3, ..., Image N ] ──> Tính mức độ tương đồng
```

**Output ví dụ:**
```text
Possible Matches:
1. Found Item #387 ── Similarity: 94%
2. Found Item #412 ── Similarity: 83%
3. Found Item #291 ── Similarity: 76%
```

---

## 9. AI không nên làm quá nhiều

Không cần tự xây một mô hình nhận diện mọi đồ vật trên thế giới. Thay vào đó có thể sử dụng image embedding / model có sẵn.

**Pipeline xử lý:**
```text
Image ──> Pretrained Vision Model ──> Image Embedding ──> Vector Similarity ──> Ranking ──> Possible Matches
```

* **Ví dụ dùng:** CLIP, MobileNet, ResNet hoặc các image embedding model có sẵn.
* **Định hướng:** Tập trung vào xây dựng hệ thống matching, không phải nghiên cứu một model Computer Vision mới.

---

## 10. Không nên chỉ dựa vào AI (Multi-factor Matching)

Đây là điểm có thể làm đề tài tốt hơn.

Ví dụ AI cho:
* Image similarity = 92%

Nhưng hai đồ vật:
* Một cái được tìm thấy ở *Hà Nội*.
* Một cái được tìm thấy ở *Đà Nẵng*.

Rõ ràng không nên recommend chúng ngang nhau. Vì vậy hệ thống kết hợp đa yếu tố:
* Image similarity
* Location similarity
* Time similarity
* Text similarity

**Ví dụ tính điểm:**

| Tiêu chí | Điểm thành phần |
| :--- | :---: |
| Image similarity | 92 |
| Location similarity | 100 |
| Time similarity | 95 |
| Text similarity | 80 |
| **Final Match Score** | **93.4%** |

Đây là một điểm rất tốt về mặt kỹ thuật nhưng vẫn vừa sức thực hiện.

---

## 11. Chức năng xếp hạng kết quả

Thay vì chỉ trả kết quả cứng nhắc: *“Có / Không”*, hệ thống trả về danh sách được xếp hạng:

```text
Most Likely Matches:
1. Item #387 ── Match: 94%
2. Item #412 ── Match: 86%
3. Item #291 ── Match: 79%
```

Điều này tạo thành một search engine nhỏ cho đồ thất lạc.

---

## 12. Chức năng xem chi tiết đồ vật

Khi người dùng click vào một món đồ (Ví dụ: `Item #387`), hệ thống hiển thị:
* Ảnh đồ vật
* Mô tả
* Địa điểm tìm thấy
* Ngày tìm thấy
* Đặc điểm nhận dạng
* Similarity score
* Trạng thái hiện tại

---

## 13. Chức năng gửi yêu cầu nhận đồ (Claim Item)

Người dùng không nên chỉ click: *“Đây là đồ của tôi”*. Thay vào đó, người mất bấm **Claim Item** và phải cung cấp thông tin xác minh quyền sở hữu:

* *Ví dụ:* “Trong balo có một chiếc USB màu xanh” hoặc “Móc khóa hình con mèo màu đỏ”.
* **Output:** Claim submitted. Status: `Waiting for finder verification`.

---

## 14. Hai bên tự xác minh & Trao đổi trực tiếp (Không qua Admin duyệt)

Để hệ thống vận hành nhanh chóng và không tạo nút thắt cổ chai cho Admin:

```text
Người mất gửi Claim ──> Người nhặt kiểm tra thông tin ──> Chấp nhận ──> Kích hoạt Chat trực tiếp
```

1. **Người nhặt xem thông tin xác minh:** Người nhặt đối chiếu câu trả lời của người mất với đồ vật thực tế đang giữ.
2. **Người nhặt phản hồi:**
   * **Approve (Chấp nhận):** Nếu thông tin xác minh trùng khớp.
   * **Reject (Từ chối):** Nếu thông tin xác minh sai.
   * **Request more information:** Nếu muốn người mất cung cấp thêm chi tiết để chắc chắn.
3. **Hai bên tự trao đổi và trao trả:**
   * Khi người nhặt bấm **Approve**, hệ thống lập tức mở luồng chat trực tiếp giữa hai bên.
   * Hai người tự nhắn tin hẹn thời gian, địa điểm gặp mặt để trao trả đồ luôn.
   * **Admin không can thiệp vào từng giao dịch.** Admin chỉ đóng vai trò phân xử khi một trong hai bên gửi báo cáo (Report) gian lận hoặc tranh chấp.

---

## 15. Quản lý trạng thái đồ vật

Đồ vật trong hệ thống có các trạng thái:
* `LOST`: Đang thất lạc, đang tìm kiếm.
* `FOUND`: Đã nhặt được, đang chờ chủ nhân.
* `MATCHED`: Đã tìm thấy các đối tượng tương đồng.
* `CLAIM_PENDING`: Đang có người gửi yêu cầu nhận lại đồ, chờ người nhặt đối chiếu.
* `IN_DISCUSSION`: Người nhặt đã đồng ý, hai bên đang trao đổi để hẹn trả đồ.
* `RETURNED`: Đã trao trả thành công cho chủ nhân.
* `CLOSED`: Bài đăng hoàn tất / Đã đóng.

Điều này giúp hệ thống trở thành một product hoàn chỉnh, thay vì chỉ là công cụ tìm kiếm ảnh.

---

## 16. Phạm vi AI nên giới hạn

Đây là phần đặc biệt quan trọng cần ghi rõ trong proposal:
* **Không cam kết:** Nhận diện chính xác đồ vật hoặc tự khẳng định ai là chủ nhân món đồ (Ví dụ AI không nhất thiết phải biết: *“Đây là chiếc balo của Nguyễn Văn A”*).
* **Cam kết thực hiện:** Tìm kiếm và xếp hạng các hình ảnh có mức độ tương đồng cao với hình ảnh truy vấn (Ví dụ AI chỉ cần biết: *“Ảnh này tương đồng cao với ảnh Found Item #387”*).

Quyết định xác minh và trao trả cuối cùng hoàn toàn thuộc về người dùng đối chất với nhau.

---

## 17. Dataset để test

Có thể tạo dataset nhỏ phục vụ kiểm thử đồ án:
* **Quy mô:** Khoảng 10–20 loại đồ vật phổ biến (backpack, wallet, bottle, umbrella, headphones, phone, laptop, glasses, keys, notebook...).
* **Số lượng:** Mỗi loại từ 30–50 ảnh ở các góc chụp khác nhau.
* **Kiểm thử:** Tạo các cặp ảnh *Same Item* và *Different Item* để kiểm tra khả năng matching của mô hình.

---

## 18. Đánh giá AI như thế nào?

Đây là điểm rất quan trọng vì AI recommendation/matching phải có đánh giá định lượng:
* **Top-1 Accuracy:** Trong kết quả đầu tiên có phải đúng đồ vật không?
* **Top-5 Accuracy:** Trong 5 kết quả đầu tiên có đồ vật đúng không?
* **Precision@K:** Có bao nhiêu kết quả được trả về là relevant?

*Ví dụ mục tiêu thử nghiệm:* Với 100 query images, đạt **Top-1 Accuracy = 78%** và **Top-5 Accuracy = 91%**. Đây là kết quả rất dễ trình bày và thuyết phục trong báo cáo.

---

## 19. Những chức năng KHÔNG nên làm (Out of Scope)

Để đồ án đúng trọng tâm và khả thi:
* Nhận diện khuôn mặt (Face Recognition).
* Camera realtime.
* Object tracking qua video.
* AI tự động xác định chủ nhân.
* Tích hợp Facebook / TikTok.
* Crawler toàn Internet.
* Làm cả Mobile App + Web App cùng lúc (chỉ tập trung Web App).
* Tự train model Computer Vision từ đầu.

---

## 20. Bảng tóm tắt phạm vi hệ thống (Scope Summary)

| Phân hệ | Các chức năng chính |
| :--- | :--- |
| **Người dùng (User)** | - Đăng ký / Đăng nhập / Cập nhật hồ sơ.<br>- Đăng đồ thất lạc (Lost Item).<br>- Đăng đồ tìm thấy (Found Item).<br>- Tìm kiếm bằng text, bằng hình ảnh hoặc kết hợp.<br>- Xem kết quả matching và chi tiết đồ vật.<br>- Gửi Claim kèm thông tin xác minh.<br>- **Người nhặt tự đối chiếu xác minh Claim (Approve / Reject / Request info).**<br>- **Hai bên trực tiếp chat trao đổi và hẹn gặp trao trả đồ.**<br>- Cập nhật trạng thái đồ vật (`RETURNED`).<br>- Gửi báo cáo (Report) khi có tranh chấp hoặc gian lận. |
| **Trí tuệ nhân tạo (AI)** | - Image embedding (từ model có sẵn).<br>- Image similarity.<br>- Multi-factor matching (Ảnh + Địa điểm + Thời gian + Văn bản).<br>- Ranking xếp hạng danh sách gợi ý. |
| **Quản trị viên (Admin)** | - Quản lý bài đăng.<br>- Quản lý người dùng.<br>- **Không duyệt từng claim thủ công.**<br>- Tiếp nhận và xử lý báo cáo vi phạm (Report) khi có tranh chấp.<br>- Quản lý dữ liệu và Dashboard thống kê hệ thống. |
