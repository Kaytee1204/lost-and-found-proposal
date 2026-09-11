# lost-and-found-proposal

Dưới đây là toàn bộ nội dung tài liệu đề tài đã được chuẩn hóa và cập nhật đầy đủ, đồng nhất 100% theo đúng quy trình: **Xác thực bằng câu hỏi riêng $\rightarrow$ Hai bên tự trao đổi $\rightarrow$ Admin chỉ can thiệp xử lý khi có báo cáo tranh chấp/gian lận**.

---

# Hệ thống tìm kiếm đồ thất lạc bằng hình ảnh

## 1. Tên đề tài

* **Tên tiếng Việt:** Hệ thống tìm kiếm đồ thất lạc bằng hình ảnh


* **Tên tiếng Anh:** Web-Based Lost and Found Search and Image Matching System



---

## 2. Lý do chọn đề tài

Trong trường đại học, ký túc xá, thư viện, phòng lab, trung tâm thương mại và các khu vực công cộng thường xảy ra tình trạng:

* Sinh viên/người dùng đánh mất đồ.


* Người khác nhặt được nhưng không biết cách tìm chủ nhân.


* Thông tin đồ thất lạc bị phân tán trên Facebook, Zalo, group chat hoặc các kênh liên lạc rời rạc.


* Người mất phải tốn thời gian lội qua hàng loạt bài đăng để tìm kiếm.


* Mô tả bằng văn bản giữa người mất và người nhặt thường không đồng nhất.



**Ví dụ:**

* Người A mất: *"Một chiếc ví da màu đen."*

* Người B nhặt được: *"Tìm thấy một chiếc ví màu tối ở phòng 302."*


Cả hai người có thể đang nhắc về cùng một đồ vật, nhưng việc tìm kiếm chỉ dựa trên keyword đơn thuần rất dễ bỏ sót kết quả. Ngoài ra, người mất thường có sẵn hình ảnh đồ vật của mình và cần đối chiếu xem trong các đồ vật nhặt được có món nào tương đồng hay không.

Vì vậy, hệ thống được xây dựng nhằm hỗ trợ người dùng **tìm kiếm đồ thất lạc bằng văn bản, hình ảnh và thông tin ngữ cảnh**, đồng thời xếp hạng các kết quả tiềm năng nhất để người dùng xác minh.

---

## 3. Vấn đề mà đề tài giải quyết

**Bài toán cốt lõi:**

> *Làm thế nào để người dùng có thể tìm kiếm và xác định các đồ vật có khả năng tương ứng dựa trên hình ảnh, văn bản và thông tin ngữ cảnh thay vì chỉ dựa vào từ khóa rời rạc?*
> 

Hệ thống tập trung giải quyết 3 vấn đề chính:

### Vấn đề 1 — Thông tin phân tán, khó tìm kiếm

Cung cấp một nền tảng tập trung duy nhất để người dùng:

* Đăng thông tin đồ thất lạc (Lost Item).


* Đăng thông tin đồ nhặt được (Found Item).


* Tìm kiếm, lọc và nhận gợi ý kết quả tương đồng.


* Thực hiện xác minh quyền sở hữu và hẹn nhận lại đồ trực tiếp.



### Vấn đề 2 — Mô tả ngữ nghĩa không đồng nhất

Người dùng có thói quen dùng từ khác nhau khi miêu tả (ví dụ: *"ví đen"* vs *"ví da tối màu"*). Hệ thống kết hợp chuẩn hóa các trường thông tin:

* Tên đồ vật (Item name).


* Danh mục (Category).


* Màu sắc (Color).


* Mô tả chi tiết (Description).


* Đặc điểm nhận dạng (Identifying characteristics).



Nhờ đó, công cụ hỗ trợ cả **keyword search** lẫn **text similarity**.

### Vấn đề 3 — Khó xác thực và tìm kiếm trực quan

Người mất có ảnh đồ vật muốn đối chiếu trực quan với kho dữ liệu đồ nhặt được. Hệ thống tích hợp **Image Matching**, trích xuất vector đặc trưng để xếp hạng mức độ tương đồng và đề xuất các ứng viên tiềm năng (candidates).

---

## 4. Ý tưởng sản phẩm

Hệ thống quản lý hai luồng dữ liệu chính:

### a. Lost Item (Đồ thất lạc)

Người mất đăng tải:

* Hình ảnh (nếu có).


* Tên đồ vật, Danh mục, Màu sắc.


* Thời gian, địa điểm thất lạc.


* Mô tả và đặc điểm nhận dạng.



### b. Found Item (Đồ nhặt được)

Người nhặt đăng tải:

* Hình ảnh chụp hiện trạng đồ vật.


* Tên đồ vật, Danh mục, Màu sắc.


* Thời gian, địa điểm nhặt được.


* Mô tả tổng quan bên ngoài.


* **Lưu ý bảo mật:** Người nhặt được khuyến nghị *không công khai các chi tiết ẩn quan trọng* (như nội dung bên trong ví, số seri, móc khóa bên trong ngăn phụ) để dùng làm bằng chứng đối chất khi có người gửi yêu cầu nhận lại đồ.

---

## 5. Workflow thực tế

Giả sử sinh viên A bị mất một chiếc balo trong trường.

### Bước 1 — Đăng đồ thất lạc

A tạo bài đăng:

* **Tên:** Black Backpack


* **Category:** Backpack | **Màu:** Black


* **Địa điểm:** University Library | **Ngày:** 08/09/2026


* **Mô tả:** *"Black backpack with a small red cat-shaped keychain attached to the zipper. There is a small scratch near the left side."*

* **Hệ thống tạo:** Lost Item `#L102` (Status: `LOST`)



### Bước 2 — Người khác đăng đồ nhặt được

Sinh viên B nhặt được balo tại thư viện và đăng:

* **Tên:** Black Backpack


* **Category:** Backpack | **Màu:** Black


* **Địa điểm:** University Library | **Ngày:** 08/09/2026


* **Mô tả bên ngoài:** *"Black backpack with a red cat-shaped keychain. Found near the second-floor reading area."*

* **Hệ thống tạo:** Found Item `#F387` (Status: `FOUND`)



### Bước 3 — AI Matching tự động

Hệ thống sử dụng mô hình embedding (như CLIP) để vector hóa ảnh và thông tin của `#F387`, tự động so khớp và gợi ý cho A các candidate tương đồng nhất:

1. Found Item `#F387` — Image Similarity: 0.92


2. Found Item `#F412` — Image Similarity: 0.83


3. Found Item `#F291` — Image Similarity: 0.76



### Bước 4 — Hybrid Ranking

Kết hợp đa yếu tố theo trọng số:


$$\text{Final Score} = 0.60 \times \text{Image} + 0.15 \times \text{Text} + 0.15 \times \text{Location} + 0.10 \times \text{Time}$$


$\rightarrow$ Found Item `#F387` đạt Match Score: **0.928** (Xếp hạng Top-1 Candidate).

### Bước 5 — Người dùng chọn Candidate

A duyệt danh sách gợi ý, xem chi tiết bài đăng `#F387` và nhận thấy hình ảnh cũng như thời gian/địa điểm trùng khớp với đồ của mình.

### Bước 6 — Xác thực bằng câu hỏi riêng (Private Verification)

A bấm **Claim Item**. Để chứng minh quyền sở hữu, A phải trả lời câu hỏi xác thực hoặc cung cấp đặc điểm bảo mật ẩn mà chỉ chủ sở hữu thực sự mới biết:

* *Câu hỏi từ người nhặt (hoặc form xác thực):* *"Trong ngăn trước/bên trong balo có chứa đồ vật gì đặc biệt?"*
* *A cung cấp câu trả lời:* *"Trong ngăn kéo phía trước có một chiếc USB SanDisk màu xanh và một thẻ giữ xe số 42."*
* **Hệ thống tạo:** Claim `#C501` (Trạng thái: `PENDING_VERIFICATION`).

### Bước 7 — Kiểm tra câu hỏi & Hai bên tự trao đổi

Người nhặt (B) nhận thông báo và đối chiếu câu trả lời:

* **Nếu Sai:** B bấm **Từ chối (Reject/Decline)** $\rightarrow$ Hệ thống hủy claim, bảo vệ tài sản khỏi việc nhận nhầm hoặc gian lận.
* **Nếu Đúng:** B bấm **Chấp nhận (Accept)** $\rightarrow$ Hệ thống lập tức kích hoạt luồng **Chat nội bộ** giữa hai người.
* Hai bên tự nhắn tin trao đổi chi tiết, hẹn thời gian và địa điểm an toàn trong khuôn viên để gặp mặt trao trả đồ.

### Bước 8 — Hoàn tất trao trả & Xử lý báo cáo (nếu có)

* **Trường hợp thành công:** Sau khi gặp mặt và nhận lại đồ, người đăng bài đánh dấu **Hoàn tất (Returned)** $\rightarrow$ Bài đăng chuyển thành `CLOSED`.


* **Trường hợp có gian lận / tranh chấp:** Nếu trong quá trình trao đổi phát sinh hành vi vòi tiền chuộc, mạo danh, quấy rối hoặc không chịu trả:
1. Người dùng gửi **Báo cáo (Report)** kèm lịch sử chat và bằng chứng vi phạm.
2. **Admin tiếp nhận xử lý:** Kiểm tra lịch sử hệ thống, áp dụng chế tài cảnh cáo hoặc khóa tài khoản vi phạm vĩnh viễn.



---

## 6. Vai trò của các Actor

### Actor 1 — User (Người dùng)

Một người dùng có thể đồng thời là người mất đồ hoặc người nhặt được đồ.

* Quản lý tài khoản cá nhân.


* Đăng tải bài viết Lost Item và Found Item.


* Tìm kiếm theo từ khóa, hình ảnh hoặc tìm kiếm kết hợp (Hybrid).


* Xem danh sách Candidate được AI đề xuất.


* Gửi Claim và trả lời câu hỏi xác thực quyền sở hữu.
* Đối chiếu câu trả lời xác thực của người claim (nếu là người nhặt).
* Nhắn tin (Chat) nội bộ trực tiếp giữa hai bên để hẹn gặp trao trả đồ.
* Xác nhận hoàn tất trả đồ hoặc gửi Báo cáo vi phạm (Report) khi có tranh chấp.

### Actor 2 — Admin (Quản trị viên)

* Quản lý tài khoản người dùng và nội dung bài đăng.


* Theo dõi số liệu thống kê hoạt động hệ thống.


* **Không làm trung gian duyệt từng claim** và không can thiệp quyết định quyền sở hữu tài sản.


* **Chỉ can thiệp khi có tranh chấp:** Tiếp nhận và xử lý các Report vi phạm, đối soát lịch sử tin nhắn, khóa bài đăng hoặc khóa tài khoản vi phạm chính sách.



---

## 7. Các chức năng chính của hệ thống

1. **Quản lý người dùng:** Đăng ký, đăng nhập, bảo mật thông tin tài khoản.


2. **Đăng tin Lost / Found:** Nhập dữ liệu phân loại, hình ảnh, thời gian, vị trí và thiết lập câu hỏi/thông tin xác thực riêng tư.


3. **Tìm kiếm đa phương thức:**
* Text search qua tên, danh mục, màu sắc, mô tả.


* Image search qua ảnh truy vấn.


* Hybrid search kết hợp ảnh, từ khóa, không gian và thời gian.




4. **Hệ thống AI Matching & Ranking:** Tự động đề xuất danh sách Top-K candidates phù hợp nhất.


5. **Cơ chế Private Verification (Câu hỏi riêng):** Cho phép người mất nhập câu trả lời xác thực bí mật để người nhặt đối chiếu.
6. **Hệ thống Chat nội bộ User-to-User:** Kênh trao đổi riêng tư chỉ mở khi câu hỏi xác thực được chấp thuận.
7. **Module Báo cáo & Quản trị:** Cho phép người dùng report hành vi xấu và cung cấp công cụ để Admin kiểm duyệt, khóa tài khoản.



---

## 8. Kiến trúc AI & Image Matching

* **Không tự train mô hình Vision từ đầu:** Tận dụng **Pretrained Vision Model** hiện đại (ví dụ: CLIP, MobileNet, ResNet) để trích xuất đặc trưng hình ảnh (Image Embeddings).


* **Vector Similarity Search:** Lưu trữ và tìm kiếm vector tương đồng (Cos-similarity) trên cơ sở dữ liệu vector để trích xuất Top-K candidate.


* **Multi-factor Hybrid Ranking:** Tránh phụ thuộc hoàn toàn vào thị giác máy tính bằng cách kết hợp:
* Image Similarity


* Text Similarity (So khớp tên, màu sắc, danh mục)


* Location Similarity (Độ gần về địa lý)


* Time Similarity (Độ gần về mốc thời gian mất/nhặt)





---

## 9. Quản lý trạng thái (State Management)

* **Trạng thái của Item:**
* `LOST`: Đang thất lạc.


* `FOUND`: Đang chờ tìm chủ nhân.


* `RETURNED`: Đã trao trả thành công.


* `CLOSED`: Bài đăng kết thúc / Đã đóng.




* **Trạng thái của Claim:**
* `PENDING_VERIFICATION`: Đang chờ người nhặt đối chiếu câu trả lời xác thực.
* `REJECTED`: Câu trả lời xác thực không khớp.
* `IN_DISCUSSION`: Xác thực đúng, hai bên đang trong phiên chat trao đổi.
* `RESOLVED`: Đã nhận lại đồ thành công.
* `REPORTED`: Đang có báo cáo tranh chấp / gian lận.



---

## 10. Đánh giá hiệu năng AI (Evaluation)

Hệ thống đo lường hiệu quả mô hình gợi ý candidate bằng tập dữ liệu thực nghiệm kiểm thử:

* **Top-1 Accuracy:** Tỉ lệ đồ vật chính xác nằm ngay vị trí đầu tiên trong danh sách đề xuất.


* **Top-5 Accuracy:** Tỉ lệ đồ vật chính xác nằm trong nhóm 5 kết quả đầu tiên.


* **Precision@K:** Đo lường mật độ các kết quả thực sự liên quan trong K vị trí đầu.


* **A/B Testing đối soát:** So sánh hiệu quả giữa Image Only vs Hybrid Search (Image + Text + Context) để chứng minh tính ưu việt của việc kết hợp đa yếu tố.



---

## 11. Giới hạn phạm vi đề tài (Scope Constraints)

Để đồ án khả thi và đúng trọng tâm kỹ thuật:

* **Không** triển khai nhận diện khuôn mặt người (Face Recognition).


* **Không** tích hợp camera giám sát realtime hoặc object tracking phức tạp.


* **Không** để AI tự động quyết định ai là chủ nhân món đồ.


* **Không** crawler dữ liệu tự do từ mạng xã hội (Facebook/TikTok).


* Tập trung hoàn thiện kiến trúc nền tảng Web-based tối ưu trải nghiệm tìm kiếm, matching và giải quyết claim trực tiếp giữa người dùng.



---

## 12. Sơ đồ tổng quan luồng hệ thống

```text
                        NGƯỜI DÙNG ĐĂNG TIN
                   (Ảnh + mô tả: Mất / Nhặt được)
                                │
                                ▼
                       AI MATCHING TỰ ĐỘNG
                    (CLIP embedding + Xếp hạng)
                                │
                                ▼
                     NGƯỜI DÙNG CHỌN CANDIDATE
                       (Từ danh sách gợi ý)
                                │
                                ▼
                    XÁC THỰC BẰNG CÂU HỎI RIÊNG
                     (Chỉ chủ sở hữu mới biết)
                                │
                        ┌───────┴───────┐
                 (Sai)  │               │ (Đúng)
                        ▼               ▼
                     TỪ CHỐI     HAI BÊN TỰ TRAO ĐỔI
                                (Chat, hẹn gặp trả đồ)
                                        │
                        ┌───────────────┴───────────────┐
          (Hoàn tất)    │                               │ (Có tranh chấp)
                        ▼                               ▼
               TRẢ ĐỒ THÀNH CÔNG               NGƯỜI DÙNG GỬI BÁO CÁO
              (RETURNED / CLOSED)          (Nghi ngờ gian lận / Tranh chấp)
                                                        │
                                                        ▼
                                               ADMIN XỬ LÝ BÁO CÁO
                                          (Xem lịch sử, khoá tài khoản)

```
