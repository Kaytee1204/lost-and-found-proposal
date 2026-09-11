# Hệ thống tìm kiếm đồ thất lạc bằng hình ảnh

> **Web-Based Lost and Found Search and Image Matching System**  
> Đề tài giải pháp nền tảng web hỗ trợ tìm kiếm đồ thất lạc kết hợp mô hình thị giác máy tính (Computer Vision), tìm kiếm ngữ nghĩa đa phương thức (Multimodal Matching) và cơ chế đối soát quyền sở hữu bảo mật phi tập trung (Decentralized Verification).

---

## 1. Tên đề tài

* **Tên tiếng Việt:** Hệ thống tìm kiếm đồ thất lạc bằng hình ảnh
* **Tên tiếng Anh:** Web-Based Lost and Found Search and Image Matching System
* **Môi trường triển khai mục tiêu:** Khuôn viên trường đại học, ký túc xá, thư viện, tòa nhà công cộng, khu phức hợp.

---

## 2. Lý do chọn đề tài

Tại các môi trường tập trung đông người như trường đại học, ký túc xá, thư viện và các khu vực sinh hoạt chung, tình trạng thất lạc đồ diễn ra với tần suất cao và thường gặp các bất cập sau:

1. **Thông tin phân tán và dễ trôi bài:**
   * Thông tin tìm đồ bị rải rác trên nhiều hội nhóm mạng xã hội (Facebook Group, Zalo, diễn đàn sinh viên).
   * Bài đăng nhanh chóng bị trôi sau vài giờ, người mất tốn rất nhiều thời gian lội tìm thủ công và thường xuyên bỏ sót tin.

2. **Mô tả ngữ nghĩa không đồng nhất (Semantic Gap):**
   * *Người mất mô tả:* "Một chiếc ví da màu đen gập đôi."
   * *Người nhặt mô tả:* "Nhặt được ví nam màu tối rơi ở phòng 302."
   * Việc tìm kiếm chỉ dựa vào từ khóa chính xác (exact keyword search) rất dễ bỏ sót kết quả dù cả hai đang mô tả cùng một món đồ.

3. **Khó khăn trong việc xác thực trực quan:**
   * Người mất thường có sẵn hình ảnh đồ vật cũ (ảnh kỷ niệm, hóa đơn, ảnh từng chụp), nhưng không có công cụ tự động đối chiếu hình ảnh này với kho dữ liệu các món đồ đã được nhặt.

4. **Nút thắt cổ chai trong phê duyệt (Administrative Bottleneck):**
   * Các hệ thống truyền thống thường bắt buộc quản trị viên (Admin) hoặc bảo vệ phải kiểm tra và xác minh thủ công từng món đồ, gây quá tải, chậm trễ và không thể mở rộng quy mô.

Vì vậy, đề tài đề xuất xây dựng một hệ thống tập trung hỗ trợ người dùng **tìm kiếm đồ thất lạc đa phương thức (kết hợp hình ảnh, văn bản, không gian và thời gian)**, đồng thời áp dụng **quy trình đối soát quyền sở hữu bằng câu hỏi riêng tư do hai bên tự thực hiện**.

---

## 3. Vấn đề mà đề tài giải quyết

**Bài toán cốt lõi:**
> *Làm thế nào để người dùng có thể tìm kiếm, xác định và nhận lại đồ thất lạc với độ chính xác cao dựa trên hình ảnh, ngữ nghĩa văn bản và ngữ cảnh (thời gian, địa điểm), đồng thời đảm bảo tính an toàn, bảo mật và ngăn ngừa gian lận?*

Hệ thống tập trung giải quyết 3 vấn đề chính:

### Vấn đề 1 — Thông tin phân tán, khó tìm kiếm
Cung cấp một nền tảng tập trung duy nhất để chuẩn hóa dữ liệu:
* Đăng tin đồ thất lạc (*Lost Item*).
* Đăng tin đồ nhặt được (*Found Item*).
* Tự động gợi ý danh sách ứng viên tiềm năng (Candidate List) có độ trùng khớp cao nhất.

### Vấn đề 2 — Khoảng cách ngữ nghĩa trong mô tả
Người dùng có thói quen diễn đạt khác nhau. Hệ thống kết hợp chuẩn hóa các trường thông tin danh mục (Category, Color, Metadata) và áp dụng **Text Semantic Embedding** để hiểu được sự tương đồng về nghĩa thay vì chỉ so khớp ký tự rời rạc.

### Vấn đề 3 — Khó xác thực và đối chiếu trực quan
Ứng dụng mô hình nền tảng thị giác (Vision-Language Model) để trích xuất vector đặc trưng hình ảnh, hỗ trợ tìm kiếm bằng ảnh (Image-to-Image Search) và tìm kiếm chữ - ảnh (Text-to-Image Search).

---

## 4. Ý tưởng sản phẩm & Luồng dữ liệu

Hệ thống quản lý hai luồng dữ liệu chính với quy tắc bảo mật thông tin rõ ràng:

### a. Lost Item (Đồ thất lạc)
Người mất đăng tải:
* **Hình ảnh:** Ảnh chụp đồ vật trước đó (nếu có, không bắt buộc).
* **Thông tin phân loại:** Tên đồ vật, Danh mục, Màu sắc chủ đạo.
* **Ngữ cảnh thất lạc:** Thời gian đánh rơi, Địa điểm thất lạc (Tòa nhà, Phòng/Khu vực).
* **Mô tả chi tiết:** Các đặc điểm nhận dạng bên ngoài.

### b. Found Item (Đồ nhặt được)
Người nhặt đăng tải:
* **Hình ảnh hiện trạng:** Ảnh chụp thực tế đồ vật nhặt được (bắt buộc).
* **Thông tin phân loại:** Tên đồ vật, Danh mục, Màu sắc.
* **Ngữ cảnh nhặt được:** Thời gian nhặt, Địa điểm nhặt được.
* **Mô tả tổng quan bên ngoài:** Chỉ mô tả các đặc điểm có thể nhận thấy bên ngoài.
* **Câu hỏi xác thực bí mật (Private Verification):** Người nhặt thiết lập một câu hỏi kiểm tra về chi tiết ẩn mà chỉ chủ sở hữu thực sự mới biết.  
  * *Nguyên tắc bảo mật:* Người nhặt **không công khai các chi tiết ẩn quan trọng** (như số seri, hình nền điện thoại, đồ vật bên trong ngăn kéo phụ, thông tin giấy tờ kẹp bên trong) để dùng làm căn cứ đối chất khi có người gửi yêu cầu nhận lại đồ (Claim).

---

## 5. Quy trình nghiệp vụ thực tế (Workflow)

Quy trình vận hành khép kín gồm 8 bước từ khi đăng tin đến khi hoàn tất bàn giao:

```
[Người mất A] Đăng Lost Item (#L102)
                     │
                     ▼
[Người nhặt B] Đăng Found Item (#F387) + Thiết lập câu hỏi xác thực ẩn
                     │
                     ▼
       HỆ THỐNG AI MATCHING & DYNAMIC HYBRID RANKING
   (Tiền xử lý cắt vật thể + So khớp Đa phương thức + Ngữ cảnh)
                     │
                     ▼
[Hệ thống] Gợi ý danh sách Top-K Candidates cho A
                     │
                     ▼
[A kiểm tra Candidate #F387] Gửi Claim & Trả lời câu hỏi xác thực bí mật
                     │
                     ▼
[B đối chiếu câu trả lời]
       ├── [Sai / Khác biệt] ──> Bấm REJECT (Hủy claim; áp dụng rate-limit nếu cố tình đoán mò)
       └── [Đúng / Trùng khớp] ──> Bấm ACCEPT
                     │
                     ▼
        KÍCH HOẠT PHIÊN CHAT NỘI BỘ
   (Gợi ý địa điểm bàn giao an toàn: Bàn bảo vệ / Thư viện)
                     │
                     ▼
               GẶP MẶT TRAO TRẢ
       ├── [Thành công] ──> Đánh dấu RETURNED & Đóng bài (CLOSED)
       └── [Có tranh chấp/Gian lận] ──> Gửi REPORT kèm bằng chứng ──> ADMIN xử lý
```

### Chi tiết kịch bản:
* **Bước 1 — Đăng đồ thất lạc:** Sinh viên A đánh rơi balo và tạo bài đăng `#L102` (Trạng thái: `LOST`).
* **Bước 2 — Người khác đăng đồ nhặt được:** Sinh viên B nhặt được balo tại thư viện và đăng bài `#F387` (Trạng thái: `FOUND`), kèm ảnh và câu hỏi ẩn: *"Trong ngăn khóa phụ phía trước có những đồ vật gì?"*.
* **Bước 3 — AI Matching tự động:** Hệ thống tiền xử lý ảnh (cắt vùng vật thể), trích xuất vector đặc trưng và so khớp với kho dữ liệu đồ vật.
* **Bước 4 — Dynamic Hybrid Ranking:** Thuật toán tính điểm tương đồng tổng hợp dựa trên ảnh, văn bản, địa điểm và thời gian. Bài `#F387` đạt điểm cao nhất và được gợi ý cho A ở vị trí Top-1.
* **Bước 5 — A gửi Claim:** A xem ảnh bài `#F387`, nhận thấy balo của mình và bấm **Claim Item**. A trả lời câu hỏi: *"Trong ngăn khóa phụ có một USB màu đỏ và một thẻ gửi xe số 42"*.
* **Bước 6 — B đối soát & kích hoạt Chat:** B nhận câu trả lời, đối chiếu với balo thực tế thấy chính xác. B bấm **Chấp nhận (Accept)**. Hệ thống lập tức mở kênh chat nội bộ giữa A và B.
* **Bước 7 — Trao đổi và hẹn gặp:** Hai bên nhắn tin hẹn gặp tại một điểm an toàn trong trường (ví dụ: Bàn trực bảo vệ sảnh A) để trao trả.
* **Bước 8 — Hoàn tất trao trả & Xử lý báo cáo (nếu có):**
  * *Trường hợp thành công:* A nhận lại đồ, bài đăng chuyển thành `RETURNED` và chuyển sang `CLOSED`.
  * *Trường hợp phát sinh gian lận:* Nếu đối phương có hành vi vòi tiền chuộc hoặc chiếm giữ trái phép, người dùng bấm **Báo cáo (Report)** kèm lịch sử chat để Admin xử lý kỷ luật.

---

## 6. Vai trò của các Actor

### Actor 1 — User (Người dùng / Sinh viên)
Một người dùng có thể đóng vai trò người mất hoặc người nhặt:
* Quản lý tài khoản và xác minh danh tính qua email trường đại học.
* Đăng tải và quản lý các bài viết Lost Item và Found Item.
* Tìm kiếm đồ vật theo từ khóa, tải ảnh tìm kiếm hoặc lọc theo thời gian, địa điểm.
* Xem danh sách ứng viên (Candidates) do AI gợi ý.
* Gửi Claim và trả lời câu hỏi xác thực quyền sở hữu.
* Đối soát câu trả lời xác thực của người khác gửi đến (nếu là người nhặt).
* Nhắn tin trực tiếp qua luồng chat nội bộ khi yêu cầu được chấp thuận.
* Đánh dấu hoàn tất trao trả hoặc gửi Báo cáo vi phạm (Report) khi có tranh chấp.

### Actor 2 — Admin (Quản trị viên)
* Quản lý tài khoản người dùng và giám sát nội dung đăng tải.
* Theo dõi thống kê hoạt động của hệ thống (tỷ lệ ghép nối thành công, thời gian xử lý trung bình).
* **Không làm trung gian duyệt từng claim** (giúp hệ thống mở rộng quy mô, không bị nghẽn).
* **Chỉ can thiệp khi có tranh chấp:** Tiếp nhận và xử lý Report, đối soát lịch sử tin nhắn và câu hỏi xác thực, áp dụng chế tài cảnh cáo hoặc khóa vĩnh viễn tài khoản vi phạm.

---

## 7. Các chức năng chính của hệ thống

1. **Quản lý người dùng & Định danh:** Đăng ký, đăng nhập, phân quyền và xác minh tài khoản người dùng nội bộ trường.
2. **Đăng tin Lost / Found chuẩn hóa:** Biểu mẫu nhập liệu phân loại rõ ràng (tên, danh mục, màu sắc, vị trí, thời gian) và thiết lập câu hỏi bảo mật riêng tư.
3. **Tìm kiếm đa phương thức (Multimodal Search):**
   * Tìm kiếm theo từ khóa / ngữ nghĩa mô tả.
   * Tìm kiếm bằng hình ảnh truy vấn (Image Search).
   * Lọc kết hợp đa chiều (Hybrid Filter) theo không gian và thời gian.
4. **Hệ thống AI Matching & Ranking:** Tự động đề xuất danh sách Top-K candidates phù hợp nhất khi có bài đăng mới.
5. **Cơ chế Private Verification (Câu hỏi riêng):** Quản lý luồng gửi - duyệt câu trả lời bí mật, tích hợp chống dò đoán tự động.
6. **Hệ thống Chat nội bộ User-to-User:** Kênh trao đổi riêng tư chỉ mở khi câu hỏi xác thực được chấp thuận, tích hợp gợi ý điểm hẹn an toàn.
7. **Module Báo cáo & Quản trị (Trust & Moderation):** Cơ chế khiếu nại, xem xét bằng chứng và xử lý tài khoản vi phạm chính sách.

---

## 8. Kiến trúc AI & Mô hình Matching

### 8.1. Nguyên lý trích xuất đặc trưng đa phương thức
* **Không tự huấn luyện mô hình từ đầu:** Tận dụng **Pretrained Vision-Language Foundation Model** (như CLIP / Multilingual CLIP) để trích xuất vector đặc trưng ngữ nghĩa (Embeddings).
* **Không gian tiềm ẩn đồng nhất (Shared Latent Space):** Mô hình ánh xạ cả hình ảnh và văn bản mô tả (hỗ trợ tiếng Việt) vào cùng một không gian vector đa chiều, cho phép tính toán độ tương đồng trực tiếp giữa:
  * Ảnh với Ảnh (Image-to-Image Similarity).
  * Chữ với Ảnh (Text-to-Image Similarity).
* **Tiền xử lý cắt vật thể (Object RoI Cropping):** Ảnh người dùng chụp thực tế thường chứa nhiều nhiễu nền (mặt sàn, bàn học, người xung quanh). Hệ thống áp dụng mô hình nhận diện vật thể nhẹ để xác định khung bao (Bounding Box) của đồ vật và cắt lấy vùng trọng tâm trước khi đưa vào mô hình trích xuất đặc trưng.

---

### 8.2. Thuật toán Dynamic Hybrid Ranking

Để tránh phụ thuộc hoàn toàn vào thị giác máy tính và xử lý được trường hợp **người mất không có sẵn ảnh**, hệ thống áp dụng cơ chế tính điểm thích ứng (*Dynamic Weight Fallback*):

#### Trường hợp 1: Bài đăng có hình ảnh
$$\text{Final Score} = 0.50 \times S_{\text{image}} + 0.20 \times S_{\text{text}} + 0.15 \times S_{\text{location}} + 0.15 \times S_{\text{time}}$$

#### Trường hợp 2: Bài đăng không có hình ảnh
$$\text{Final Score} = 0.50 \times S_{\text{text}} + 0.30 \times S_{\text{location}} + 0.20 \times S_{\text{time}}$$

---

### 8.3. Hàm chuẩn hóa khoảng cách Không gian & Thời gian

* **Độ tương đồng hình ảnh ($S_{\text{image}}$) & văn bản ($S_{\text{text}}$):** Tính theo độ tương đồng Cosine giữa hai vector đặc trưng:
  $$S = \cos(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$

* **Độ tương đồng không gian ($S_{\text{location}}$):** Chuẩn hóa theo phân cấp vị trí khuôn viên:
  $$S_{\text{location}} = \begin{cases} 
  1.0 & \text{Trùng phòng học / Khu vực cụ thể} \\
  0.8 & \text{Cùng tòa nhà} \\
  0.5 & \text{Cùng phân khu / Khuôn viên (Campus)} \\
  0.1 & \text{Khác khuôn viên}
  \end{cases}$$

* **Độ tương đồng thời gian ($S_{\text{time}}$):** Sử dụng hàm suy giảm theo số ngày chênh lệch $\Delta t = |t_{\text{lost}} - t_{\text{found}}|$:
  $$S_{\text{time}} = \exp(-\lambda \cdot \Delta t) \quad (\text{với } \lambda = 0.15)$$

---

## 9. Cơ chế An toàn, Bảo mật & Chống gian lận (Trust & Safety)

1. **Định danh người dùng qua Email trường học:**
   * Bắt buộc hoặc ưu tiên xác thực tài khoản qua email sinh viên/nhân viên trường (`@*.edu.vn`). Giúp truy xuất trách nhiệm khi có hành vi sai trái và triệt tiêu 90% nguy cơ tài khoản ảo lừa đảo.
2. **Cơ chế chống dò đoán đáp án (Anti-Brute Force):**
   * Giới hạn mỗi tài khoản chỉ được gửi tối đa **3 lượt Claim / ngày**.
   * Mỗi vật phẩm chỉ được phép gửi **1 lượt Claim trong vòng 24 giờ** đối với cùng một người dùng.
   * Nếu người dùng nhập sai liên tiếp nhiều lần, hệ thống tạm khóa chức năng Claim của tài khoản đó.
3. **Cơ chế hết hạn yêu cầu tự động (Claim Time-To-Live):**
   * Nếu người nhặt không phản hồi sau **72 giờ**, hệ thống tự động hủy Claim và giải phóng trạng thái để tránh việc yêu cầu bị treo vô thời hạn (*Ghosting*).
4. **Điểm hẹn bàn giao an toàn (Safe Exchange Points):**
   * Khi kích hoạt phiên chat, hệ thống chủ động gợi ý các điểm gặp mặt an toàn có bảo vệ hoặc camera trong khuôn viên (ví dụ: Bàn trực bảo vệ cổng chính, Quầy thủ thư thư viện, Văn phòng Đoàn trường).
5. **Ghi vết lịch sử tin nhắn phục vụ giải quyết khiếu nại (Audit Log):**
   * Lưu trữ lịch sử tin nhắn trong phiên chat để Admin làm căn cứ đối soát khi nhận được Report về các hành vi tống tiền chuộc đồ hoặc quấy rối.

---

## 10. Quản lý trạng thái (State Management)

### a. Trạng thái của Bài đăng (Item)
* `LOST`: Tin đồ thất lạc đang tìm kiếm.
* `FOUND`: Tin đồ nhặt được đang chờ chủ nhân.
* `RETURNED`: Đã xác nhận trao trả lại đồ thành công.
* `CLOSED`: Bài đăng kết thúc / Đã đóng.

### b. Trạng thái của Yêu cầu nhận lại (Claim)
* `PENDING_VERIFICATION`: Đang chờ người nhặt đối chiếu câu trả lời xác thực.
* `REJECTED`: Câu trả lời không khớp, người nhặt từ chối.
* `IN_DISCUSSION`: Xác thực đúng, hệ thống mở phiên chat trao đổi giữa hai bên.
* `RESOLVED`: Đã gặp mặt và nhận lại đồ thành công.
* `REPORTED`: Đang có báo cáo tranh chấp / nghi vấn gian lận.
* `EXPIRED`: Yêu cầu hết hạn do quá thời gian chờ phản hồi.

---

## 11. Đánh giá hiệu năng AI & Phương pháp kiểm nghiệm (Evaluation)

Hệ thống được đánh giá định lượng bằng bộ dữ liệu thực nghiệm kiểm thử trong môi trường khuôn viên trường học:

* **Top-1 Accuracy:** Tỉ lệ đồ vật chính xác nằm ngay vị trí đầu tiên trong danh sách đề xuất.
* **Top-5 Accuracy:** Tỉ lệ đồ vật chính xác nằm trong nhóm 5 kết quả đầu tiên.
* **Precision@K & Mean Reciprocal Rank (MRR):** Đo lường độ chính xác và vị trí xếp hạng trung bình của các kết quả thực sự liên quan.
* **Thực nghiệm đối soát (Ablation Study):** So sánh hiệu quả giữa các phương pháp để chứng minh tính ưu việt của mô hình:
  * *Mô hình A (Baseline):* Chỉ tìm kiếm theo từ khóa văn bản thuần túy.
  * *Mô hình B:* Chỉ so khớp bằng hình ảnh (Image-Only Similarity).
  * *Mô hình C (Đề xuất):* So khớp kết hợp đa yếu tố (**Dynamic Hybrid Ranking**).

---

## 12. Giới hạn phạm vi đề tài (Scope Constraints)

Để đề tài đảm bảo tính khả thi cao, đúng trọng tâm kỹ thuật và hoàn thành đúng tiến độ:

* **Không** triển khai nhận diện khuôn mặt người (Face Recognition) để tôn trọng quyền riêng tư.
* **Không** tích hợp camera giám sát thời gian thực hoặc bài toán theo dõi vật thể diện rộng (Realtime Object Tracking).
* **Không** để AI tự động phán quyết ai là chủ nhân món đồ (AI chỉ đóng vai trò hỗ trợ gợi ý ứng viên; quyết định cuối cùng dựa trên sự đối chất thông tin giữa hai bên).
* **Không** thu thập (crawl) dữ liệu tự do từ các nền tảng mạng xã hội bên ngoài.
* **Tập trung:** Hoàn thiện giải pháp nền tảng tập trung tối ưu trải nghiệm tìm kiếm đa phương thức, thuật toán xếp hạng tương đồng và quy trình hoàn trả an toàn trực tiếp giữa người dùng.

---

## 13. Sơ đồ tổng quan luồng hệ thống

```text
                        NGƯỜI DÙNG ĐĂNG TIN
                   (Ảnh + mô tả: Mất / Nhặt được)
                                │
                                ▼
                       TIỀN XỬ LÝ & AI MATCHING
                    (Cắt vật thể + Embedding đa phương thức)
                                │
                                ▼
                      DYNAMIC HYBRID RANKING
                  (Ảnh + Text + Vị trí + Thời gian)
                                │
                                ▼
                     NGƯỜI DÙNG CHỌN CANDIDATE
                       (Từ danh sách Top-K gợi ý)
                                │
                                ▼
                    XÁC THỰC BẰNG CÂU HỎI RIÊNG
                    (Chống Brute-force & Giới hạn lượt)
                                │
                        ┌───────┴───────┐
                 (Sai)  │               │ (Đúng)
                        ▼               ▼
                     TỪ CHỐI     HAI BÊN TỰ TRAO ĐỔI
                   (REJECTED)     (Chat tại điểm hẹn an toàn)
                                        │
                        ┌───────────────┴───────────────┐
          (Hoàn tất)    │                               │ (Có tranh chấp)
                        ▼                               ▼
               TRẢ ĐỒ THÀNH CÔNG               NGƯỜI DÙNG GỬI BÁO CÁO
              (RETURNED / CLOSED)          (Nghi ngờ gian lận / Tranh chấp)
                                                        │
                                                        ▼
                                               ADMIN XỬ LÝ BÁO CÁO
                                          (Xem lịch sử chat, khóa tài khoản)
```
