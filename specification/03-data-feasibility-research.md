# Data & Technical Feasibility Research

| | |
|---|---|
| **Dự án** | Hệ thống tìm kiếm đồ thất lạc bằng hình ảnh |
| **Loại tài liệu** | Feasibility Study |
| **Trạng thái** | Draft v1 |
| **Ngày** | 15/09/2026 |
| **Đi kèm** | `01-ai-scope-and-constraints.md`, `02-tech-stack-decision.md` |

---

## 1. Đối chiếu category đề xuất (README mục 17) với 80 lớp COCO của YOLOv8 pretrained

| Category đề xuất trong README | Có trong COCO 80 classes? | Ghi chú |
|---|---|---|
| Backpack | ✅ `backpack` | Sẵn dùng ngay |
| Wallet (ví) | ❌ | Không có lớp tương đương |
| Bottle (bình nước) | ✅ `bottle` | Sẵn dùng ngay |
| Umbrella (dù/ô) | ✅ `umbrella` | Sẵn dùng ngay |
| Headphones (tai nghe) | ❌ | Không có lớp tương đương |
| Phone (điện thoại) | ✅ `cell phone` | Sẵn dùng ngay |
| Laptop | ✅ `laptop` | Sẵn dùng ngay |
| Glasses (kính mắt) | ❌ | Không có lớp tương đương |
| Keys (chìa khoá) | ❌ | Không có lớp tương đương, vật quá nhỏ để detect ổn định |
| Notebook (sổ tay giấy) | ⚠️ gần đúng `book` | Có thể lẫn với sách |

**Kết luận: 5/10 category có sẵn, 5/10 category không có lớp COCO tương ứng.** Đây là con số quan trọng cần đội Req biết trước khi vẽ UI "auto-detect category" — không nên hứa hẹn tính năng này hoạt động đều cho mọi loại đồ vật.

## 2. Hai hướng xử lý cho 5 category không có sẵn

| Hướng | Mô tả | Đánh giá khả thi |
|---|---|---|
| **A — Fallback (khuyến nghị cho MVP)** | Không gating theo category cho các item này; dùng toàn bộ ảnh gốc cho CLIP + HSV, chỉ dựa vào embedding + màu + vị trí/thời gian | Khả thi cao, không tốn thời gian train, đúng tinh thần README mục 9 "không tự train model mới" |
| **B — Fine-tune YOLOv8 nhỏ trên 5 category còn thiếu** | Transfer learning trên tập tự thu thập (30-50 ảnh/category) | Khả thi về mặt kỹ thuật (Ultralytics hỗ trợ fine-tune dễ dàng) nhưng **rủi ro về chất lượng**: 30-50 ảnh/lớp thấp hơn khuyến nghị thông thường (thường >100 ảnh/lớp cho detector ổn định); kỳ vọng recall/precision detection ở mức trung bình, không nên cam kết cao. Chỉ nên làm nếu còn dư thời gian sau khi MVP (hướng A) đã chạy ổn |

→ **Khuyến nghị: bắt đầu bằng hướng A cho toàn bộ đồ án, coi hướng B là stretch goal nếu còn thời gian.**

---

## 3. Độ tin cậy thống kê của tập test (README mục 17-18)

Kích thước đề xuất: 10–20 category × 30–50 ảnh/category ≈ 300–1000 ảnh tổng.

Với n ≈ 100 query images để đo Top-1 Accuracy (theo ví dụ README mục 18: "Top-1 = 78%"), áp dụng ước lượng khoảng tin cậy nhị thức (95% CI, xấp xỉ chuẩn):

```
margin of error ≈ 1.96 × sqrt( p(1-p) / n )
với p = 0.78, n = 100  →  margin ≈ ±8.1%
```

→ Con số "Top-1 Accuracy = 78%" trong báo cáo thực chất nằm trong khoảng **~70%–86%** với độ tin cậy 95%. Đây không phải là điểm yếu của hệ thống mà là giới hạn cố hữu của việc test trên tập nhỏ.

**Khuyến nghị cho báo cáo đồ án:**
- Luôn báo cáo kèm cỡ mẫu (n) và khoảng tin cậy, không chỉ nêu 1 con số tuyệt đối.
- Nếu muốn margin hẹp hơn (~±5%), cần n ≈ 260 query images — cân nhắc thời gian thu thập dữ liệu còn lại của đồ án trước khi cam kết.

## 4. Vấn đề "hard negative" (2 vật giống hệt nhau)

Tập test theo README chỉ nêu "Same Item / Different Item pairs" một cách chung chung. Cần làm rõ:

- **Different Item (dễ)**: 2 vật khác loại hoàn toàn (backpack vs bottle) → mọi model đều phân biệt tốt, không phản ánh thực tế use case.
- **Different Item (khó — hard negative)**: 2 vật *cùng loại, cùng hãng, cùng màu* (vd 2 balo JanSport đen giống hệt nhau nhưng là của 2 người khác nhau) → đây mới là tình huống thực tế gây tranh chấp claim.

→ **Khuyến nghị**: khi thu thập dataset (README mục 17), chủ động chụp thêm ít nhất 1-2 cặp hard-negative cho mỗi category phổ biến (backpack, bottle, phone). Nếu không có hard negative trong tập test, số liệu Top-1/Top-5 sẽ **cao giả tạo** so với thực tế vận hành, và không chứng minh được lý do vì sao hệ thống vẫn cần bước Claim thủ công (UC11-12).

## 5. Thu thập dữ liệu — đề xuất quy trình cụ thể

Cho mỗi item mẫu:
1. Chụp ≥ 3 góc (chính diện, nghiêng, từ trên xuống).
2. Chụp ≥ 2 điều kiện ánh sáng (đủ sáng, thiếu sáng — mô phỏng ảnh thực tế người dùng tự chụp).
3. Chụp trên ≥ 2 nền khác nhau (bàn, sàn, trong balo khác...).
4. Với category phổ biến, chụp thêm 1 vật "giống hệt nhưng khác chủ" làm hard negative.

Tổng khối lượng cần thu thập không đổi so với README (300–1000 ảnh), chỉ thêm ràng buộc về **cách chụp** để dataset phản ánh đúng điều kiện thực tế và có hard negative.

---

## 6. Kết luận khả thi theo từng thành phần stack

| Thành phần | Khả thi? | Điều kiện |
|---|---|---|
| YOLOv8 Smart Crop | ✅ Khả thi ngay, zero-shot | Chỉ hoạt động tốt cho 5/10 category có sẵn trong COCO; 5 category còn lại chạy fallback (Mục 2, hướng A) |
| ViT-B/16 (CLIP) Embedding | ✅ Khả thi cao nhất trong 5 thành phần | Zero-shot hoàn toàn, không phụ thuộc dataset tự thu thập, đây là phần "chắc ăn" nhất để làm trước |
| HSV Histogram | ✅ Khả thi, rủi ro thấp | Thuật toán cổ điển, không cần dữ liệu train |
| Spatio-Temporal Scoring | ✅ Khả thi, rủi ro thấp | Rule-based, chỉ cần chốt công thức trọng số/decay function |
| Visual Gating | ✅ Khả thi | Phụ thuộc chất lượng bước 1; đã có fallback rõ ràng khi detection yếu (file 01 mục 6) |

**Không có thành phần nào trong 5 thành phần được liệt kê là bất khả thi** — rủi ro chính không nằm ở việc "model có chạy được không" mà ở:
1. Độ phủ category của YOLOv8 pretrained (đã định lượng ở Mục 1).
2. Cỡ mẫu test nhỏ dẫn đến số liệu đánh giá có sai số đáng kể (Mục 3).
3. Thiếu hard negative làm số liệu trông tốt hơn thực tế (Mục 4).

## 7. Khuyến nghị hành động cho đội Req

- Khi viết acceptance criteria cho UC5/UC6/UC9b/UC9c, dùng ngôn ngữ "gợi ý xếp hạng theo độ tương đồng", tránh ngôn ngữ "tự động xác định/tự động nhận dạng chính xác".
- UI cần có chỗ hiển thị badge "độ tin cậy phát hiện thấp" (field `lowConfidenceDetection` — file 01 mục 6) cho 5 category không có sẵn trong COCO.
- Giữ nguyên toàn bộ luồng Claim + xác minh thủ công (UC11-12) như một yêu cầu **bắt buộc**, không phải fallback tạm thời — đây là cách hệ thống xử lý giới hạn cố hữu của mọi model similarity (Mục 4), không phải thiếu sót sẽ được "AI mạnh hơn" giải quyết sau này.
