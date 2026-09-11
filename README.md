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
* Mô tả bằng văn bản thường không chính xác và không đồng nhất.

**Ví dụ thực tế:**
* Người A mất: *“Một chiếc bình nước màu đen.”*
* Người B nhặt được: *“Tìm thấy bình giữ nhiệt ở phòng 302.”*

Hai người có thể đang nói về cùng một đồ vật, nhưng hệ thống tìm kiếm bằng từ khóa (keyword search) truyền thống rất dễ bỏ sót.

---

## 3. Vấn đề mà đề tài giải quyết

**Phát biểu bài toán:**
> *Làm thế nào để người dùng có thể tìm kiếm đồ thất lạc dựa trên hình ảnh của đồ vật thay vì chỉ dựa vào từ khóa hoặc mô tả bằng văn bản?*

Hệ thống giải quyết 3 vấn đề chính:

* **Vấn đề 1 — Khó tìm kiếm:** Thông tin đồ thất lạc nằm rải rác ở nhiều kênh khác nhau. Hệ thống tạo ra một nơi lưu trữ và tìm kiếm tập trung.
* **Vấn đề 2 — Mô tả không chính xác:** Người dùng có thể mô tả *“ví màu đen”* nhưng người nhặt lại đăng *“ví da màu tối”*. Keyword search khó xác định đây là cùng một món đồ.
* **Vấn đề 3 — Khó xác định đồ vật tương ứng:** Một người có thể tải lên ảnh chiếc ví của mình và muốn biết: *“Trong những đồ đã được tìm thấy, có chiếc nào giống chiếc này không?”* — Đây chính là giá trị cốt lõi của phần AI Matching.

---

## 4. Ý tưởng sản phẩm

Hệ thống quản lý hai loại bài đăng chính:

### a. Lost Item (Đồ thất lạc)
Người mất đồ đăng tải:
* Ảnh đồ vật (nếu có)
* Tên đồ vật
* Mô tả chi tiết
* Thời gian mất
* Địa điểm mất
* Đặc điểm nhận dạng

### b. Found Item (Đồ nhặt được)
Người nhặt được đồ đăng tải:
* Ảnh đồ vật (chụp hiện trạng)
* Mô tả
* Thời gian tìm thấy
* Địa điểm tìm thấy
* Đặc điểm đồ vật

Sau đó hệ thống kết nối hai luồng dữ liệu:

```text
Lost Item ────┐
              ├────> Image Matching ────> Ranking ────> Possible Matches
Found Items ──┘
```

---

## 5. Ví dụ workflow thực tế

Giả sử sinh viên A bị mất một chiếc balo trong trường.

* **Bước 1 — Đăng đồ thất lạc:** A tải lên ảnh balo, Tên: *Balo*, Màu: *Đen*, Địa điểm: *Library*, Ngày: *08/09/2026*.
* **Bước 2 — Người khác tìm thấy:** Sinh viên B nhặt được balo tại thư viện và đăng: Ảnh balo, Tên: *Balo*, Địa điểm: *Library*, Ngày: *08/09/2026*.
* **Bước 3 — AI Matching:** Hệ thống tự động so khớp và phát hiện:
  ```text
  Possible Match:
  Lost Item #102  <=======>  Found Item #387
  - Image Similarity: 94%
  - Location: Same (Library)
  - Date: Same (08/09/2026)
  ```
* **Bước 4 — Người mất xem kết quả:** Hệ thống hiển thị thông báo: *“Có khả năng đây là đồ vật bạn đã mất”*. Sau đó người dùng có thể gửi yêu cầu nhận lại đồ (Claim).

---

## 6. Các Actor trong hệ thống

### Actor 1 — User (Người dùng)
Có thể vừa là người mất đồ, vừa là người nhặt được đồ. Không cần tách riêng thành *Lost Person* và *Finder* vì một người dùng có thể đóng cả hai vai trò tại các thời điểm khác nhau.

### Actor 2 — Admin (Quản trị viên)
Quản lý tổng thể:
* Quản lý bài đăng
* Quản lý tài khoản người dùng
* Xác minh và duyệt yêu cầu nhận đồ (Claim)
* Xử lý báo cáo vi phạm
* Theo dõi dữ liệu thống kê hệ thống

---

## 7. Các chức năng chính

### Module 1 — Đăng ký / Đăng nhập
* Đăng ký tài khoản (Register)
* Đăng nhập (Login) / Đăng xuất (Logout)
* Cập nhật thông tin cá nhân (Update profile)

### Module 2 — Đăng đồ thất lạc (Lost Item)
* **Input:** Loại đồ vật, Tên đồ vật, Hình ảnh, Mô tả, Màu sắc, Địa điểm mất, Thời gian mất, Đặc điểm nhận dạng thêm.
  * *Ví dụ:* Name: `Black Backpack` | Color: `Black` | Location: `Library` | Date: `08/09/2026` | Description: `Black backpack with a small red keychain.`
* **Output:** Bài đăng tạo thành công (Ví dụ: `Post ID: L102` | Status: `Searching`).

### Module 3 — Đăng đồ tìm thấy (Found Item)
* **Input:** Hình ảnh chụp hiện trạng, Mô tả, Địa điểm tìm thấy, Thời gian tìm thấy, Đặc điểm đồ vật.
* **Output:** Bài đăng tạo thành công (Ví dụ: `Post ID: F387` | Status: `Waiting for owner`).

### Module 4 — Tìm kiếm đồ vật
Người dùng có thể tìm kiếm linh hoạt theo 3 cách:
* **Cách 1 — Text:** Tìm theo từ khóa (Ví dụ: `black backpack`).
* **Cách 2 — Image:** Tải ảnh lên để tìm đồ tương đồng trực quan.
* **Cách 3 — Kết hợp:** Tìm kiếm kết hợp `Image + Location + Date`.

---

## 8. Chức năng AI quan trọng nhất: Image Similarity Matching

Hệ thống nhận ảnh truy vấn (*Query Image*), sau đó so sánh với các ảnh trong cơ sở dữ liệu:

```text
Query Image ──> [ So khớp với Image 1, Image 2, ..., Image N ] ──> Tính độ tương đồng
```

**Kết quả gợi ý (Output):**
```text
Possible Matches:
1. Found Item #387 ── Similarity: 94%
2. Found Item #412 ── Similarity: 83%
3. Found Item #291 ── Similarity: 76%
```

---

## 9. Định hướng tiếp cận AI: Không làm quá phức tạp

Hệ thống **không cần tự xây dựng hay nghiên cứu một mô hình nhận diện mới từ đầu**. Thay vào đó, tận dụng các mô hình trích xuất đặc trưng có sẵn (*Pretrained Model*):

```text
Image ──> Pretrained Model ──> Image Embedding ──> Vector Similarity ──> Ranking ──> Possible Matches
```

* **Mô hình tham khảo:** CLIP, MobileNet, ResNet hoặc các mô hình image embedding phổ biến.
* **Trọng tâm:** Tập trung vào xây dựng hệ thống matching và ứng dụng web hoàn chỉnh, không phải nghiên cứu thuật toán học sâu mới.

---

## 10. Không nên chỉ dựa vào AI (Multi-factor Matching)

Nếu chỉ dựa vào hình ảnh, hệ thống có thể gặp lỗi gợi ý sai:
* Ví dụ: AI trả về độ tương đồng ảnh là **92%**, nhưng một món đồ rơi ở *Hà Nội* còn món đồ nhặt được ở *Đà Nẵng*. Rõ ràng không nên gợi ý chúng ngang hàng nhau.

Vì vậy, hệ thống kết hợp đa yếu tố:
* **Image similarity** (Độ tương đồng hình ảnh)
* **Location similarity** (Độ gần về địa điểm)
* **Time similarity** (Độ gần về thời gian)
* **Text similarity** (Độ tương đồng tên và mô tả)

**Ví dụ tính điểm tổng hợp:**

| Tiêu chí | Điểm thành phần |
| :--- | :---: |
| Image similarity | 92 |
| Location similarity | 100 |
| Time similarity | 95 |
| Text similarity | 80 |
| **Final Match Score** | **93.4%** |

Cách tiếp cận này vừa sức thực hiện nhưng đem lại hiệu quả thực tế rất cao.

---

## 11. Chức năng xếp hạng kết quả (Ranking Engine)

Thay vì chỉ trả lời cứng nhắc “Có” hoặc “Không”, hệ thống đóng vai trò như một công cụ tìm kiếm thu nhỏ, trả về danh sách sắp xếp theo độ tương đồng giảm dần:

```text
Most Likely Matches:
1. Item #387 ── Match: 94%
2. Item #412 ── Match: 86%
3. Item #291 ── Match: 79%
```

---

## 12. Chức năng xem chi tiết đồ vật

Khi người dùng bấm vào một món đồ trong danh sách gợi ý (Ví dụ: `Item #387`), hệ thống hiển thị đầy đủ:
* Hình ảnh
* Mô tả chi tiết
* Địa điểm tìm thấy
* Ngày tìm thấy
* Các đặc điểm nhận dạng
* Điểm tương đồng (Similarity Score)
* Trạng thái hiện tại của đồ vật

---

## 13. Chức năng gửi yêu cầu nhận đồ (Claim Item)

Người dùng không thể chỉ bấm một nút *“Đây là đồ của tôi”* rồi lấy đồ. Thay vào đó, khi bấm **Claim Item**, người dùng phải cung cấp thông tin xác minh quyền sở hữu:

* *Ví dụ:* “Trong balo có một chiếc USB màu xanh” hoặc “Móc khóa hình con mèo màu đỏ”.
* **Kết quả:** Claim được gửi lên hệ thống với trạng thái: `Waiting for verification`.

---

## 14. Admin xác minh yêu cầu

Admin đóng vai trò người kiểm duyệt để đảm bảo tính minh bạch:

```text
Lost Item ──> Found Item ──> Claim ──> Verification (Admin kiểm tra)
```

Admin có thể:
* **Approve:** Chấp thuận yêu cầu nhận lại đồ.
* **Reject:** Từ chối yêu cầu nếu thông tin xác minh không khớp.
* **Request more information:** Yêu cầu người nhận cung cấp thêm bằng chứng chứng minh.

---

## 15. Quản lý trạng thái đồ vật (State Management)

Đồ vật trong hệ thống được quản lý qua các trạng thái rõ ràng:
* `LOST`: Đang thất lạc, đang tìm kiếm.
* `FOUND`: Đang nhặt được, chờ chủ nhân.
* `MATCHED`: Đã tìm thấy các đối tượng tương đồng tiềm năng.
* `CLAIM_PENDING`: Đang có người gửi yêu cầu nhận lại đồ, chờ xác minh.
* `RETURNED`: Đã xác minh và trao trả thành công cho chủ nhân.
* `CLOSED`: Bài đăng đã đóng / hoàn tất.

Cơ chế này giúp đề tài trở thành một sản phẩm quản lý hoàn chỉnh (*Product*), không chỉ dừng lại ở một demo tìm kiếm ảnh đơn thuần.

---

## 16. Giới hạn phạm vi của AI

Đề tài cam kết rõ ràng trong proposal:
* **Không cam kết:** Nhận diện chính xác 100% đồ vật hoặc tự động khẳng định danh tính chủ nhân món đồ (ví dụ AI không tự khẳng định: *“Đây là balo của bạn Nguyễn Văn A”*).
* **Cam kết thực hiện:** Tìm kiếm, so khớp và xếp hạng các hình ảnh trong cơ sở dữ liệu có mức độ tương đồng cao nhất với hình ảnh truy vấn. Quyết định xác minh cuối cùng vẫn thuộc về con người (người dùng và admin).

---

## 17. Bộ dữ liệu thử nghiệm (Dataset để test)

Xây dựng một bộ dataset nhỏ phục vụ kiểm thử thực nghiệm cho đồ án:
* **Quy mô:** Khoảng 10–20 loại đồ vật phổ biến (balo, ví, bình nước, dù, tai nghe, điện thoại, laptop, mắt kính, chìa khóa, sổ tay...).
* **Số lượng:** Mỗi loại thu thập 30–50 ảnh ở các góc chụp và điều kiện ánh sáng khác nhau.
* **Kiểm thử:** Tạo các cặp ảnh *Same Item* (cùng một món đồ) và *Different Item* (hai món đồ khác nhau) để đánh giá độ chính xác của thuật toán so khớp.

---

## 18. Phương pháp đánh giá AI (Evaluation)

Khả năng gợi ý và matching của hệ thống được đánh giá qua các chỉ số định lượng cụ thể:

* **Top-1 Accuracy:** Tỉ lệ món đồ đúng nằm ngay ở vị trí đầu tiên trong danh sách đề xuất.
* **Top-5 Accuracy:** Tỉ lệ món đồ đúng xuất hiện trong top 5 kết quả đầu tiên.
* **Precision@K:** Đo lường có bao nhiêu kết quả trong K vị trí đầu thực sự liên quan.

*Ví dụ mục tiêu thử nghiệm:* Với 100 ảnh truy vấn (query images), đạt **Top-1 Accuracy $\ge$ 75%** và **Top-5 Accuracy $\ge$ 90%**. Đây là kết quả định lượng rõ ràng, rất thuyết phục khi trình bày báo cáo.

---

## 19. Những chức năng KHÔNG làm (Out of Scope)

Để đảm bảo tính khả thi và đúng tiến độ đồ án, hệ thống kiên quyết không làm các chức năng sau:
* Không làm nhận diện khuôn mặt người (Face Recognition).
* Không tích hợp camera giám sát realtime.
* Không làm object tracking phức tạp qua video.
* Không để AI tự động phán quyết chủ nhân món đồ.
* Không tích hợp mạng xã hội bên ngoài (Facebook, TikTok) hay crawler dữ liệu tự do trên Internet.
* Không làm đồng thời cả Mobile App và Web App (tập trung làm tốt Web App).
* Không tự huấn luyện mô hình thị giác máy tính từ đầu.

---

## 20. Bảng tóm tắt phạm vi hệ thống (Scope Summary)

| Phân hệ | Các chức năng chính |
| :--- | :--- |
| **Người dùng (User)** | - Đăng ký / Đăng nhập / Cập nhật hồ sơ.<br>- Đăng tin đồ thất lạc (Lost Item).<br>- Đăng tin đồ nhặt được (Found Item).<br>- Tìm kiếm bằng văn bản, bằng hình ảnh hoặc kết hợp.<br>- Xem kết quả matching và xem chi tiết đồ vật.<br>- Gửi yêu cầu nhận lại đồ (Claim Item) kèm thông tin xác minh.<br>- Theo dõi trạng thái đồ vật. |
| **Trí tuệ nhân tạo (AI Engine)** | - Trích xuất đặc trưng hình ảnh (Image Embedding) từ Pretrained Model.<br>- Tính toán độ tương đồng vector (Image Similarity).<br>- Kết hợp đa yếu tố: Ảnh + Địa điểm + Thời gian + Văn bản (Multi-factor Matching).<br>- Xếp hạng danh sách kết quả phù hợp nhất (Ranking). |
| **Quản trị viên (Admin)** | - Quản lý danh sách bài đăng.<br>- Kiểm tra thông tin xác minh và xử lý yêu cầu nhận đồ (Approve / Reject / Request info).<br>- Quản lý và cập nhật trạng thái đồ vật.<br>- Xử lý báo cáo vi phạm.<br>- Dashboard thống kê dữ liệu hệ thống. |
