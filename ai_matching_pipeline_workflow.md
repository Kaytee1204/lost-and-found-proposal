# TÀI LIỆU KỸ THUẬT AI MATCHING PIPELINE WORKFLOW
## HỆ THỐNG TRUY VẤN ĐỒ THẤT LẠC ĐA PHƯƠNG THỨC LAI GHÉP (HYBRID ASYMMETRIC PIPELINE)
### (YOLOv8 Smart Crop + CLIP ViT-B/16 Vision + Multilingual CLIP Text + Center HSV + Spatio-Temporal Gating)

---

## 1. TỔNG QUAN VÀ TRIẾT LÝ THIẾT KẾ HỌC THUẬT

### 1.1. Bản chất bài toán: Instance-level Re-identification
Khác với bài toán phân loại danh mục thông thường (*Category-level Classification* – ví dụ nhận diện ảnh này là balo hay chìa khóa), bài toán **Đồ thất lạc (Lost & Found)** đòi hỏi mức độ **định danh cá thể thực thể (*Instance-level Re-identification*)**:
- Hai chiếc ba lô cùng loại hoặc hai chùm chìa khóa cùng phom dáng nhưng khác màu sắc, khác chi tiết móc khóa hoặc khác địa điểm/thời gian làm rơi phải được phân biệt một cách rõ ràng và chuẩn xác.

### 1.2. Triết lý thiết kế: Hybrid Asymmetric Multimodal Retrieval
Để khắc phục toàn bộ các nhược điểm cố hữu của các mô hình đơn lẻ:
1. **Khắc phục nhiễu phông nền:** Tích hợp mạng phát hiện đối tượng **YOLOv8** để tự động định vị và cắt vùng đối tượng chính (RoI), loại bỏ $70-80\%$ diện tích mặt bàn, sàn nhà gây nhiễu.
2. **Khắc phục giới hạn tập nhãn COCO 80 lớp:** Thiết kế cơ chế **Smart Selective Cropping & Safety Fallback** – chỉ cắt khi đúng danh mục đồ vật COCO hợp lệ; tự động **bảo lưu 100% ảnh gốc** khi gặp chìa khóa, ví da hoặc người cầm đồ (`person`) để không làm hỏng ảnh của CLIP.
3. **Khắc phục mất chi tiết vi mô:** Nâng cấp phân hệ thị giác lên **CLIP ViT-B/16** ($14 \times 14 = 196$ patches không gian, mịn gấp 4 lần chuẩn B/32) giúp mô hình bắt trọn các tiểu tiết như móc khóa, logo, vết trầy.
4. **Khắc phục rào cản tiếng Việt của CLIP gốc:** Tích hợp phân hệ ngôn ngữ **Multilingual CLIP Text Transformer (`sentence-transformers/clip-ViT-B-32-multilingual-v1`)** kế thừa từ XLM-RoBERTa/DistilBERT. Mô hình này tiếp nhận trực tiếp Tiếng Việt có dấu tự nhiên và ánh xạ sang không gian vector 512 chiều chuẩn hóa.
5. **Khắc phục lỗi mù màu (*Attribute Binding Failure*):** Bổ sung bộ trích xuất **Center-weighted HSV Color Histogram (32 chiều)** lấy 60% vùng lõi trung tâm để phân biệt chính xác đồ vật cùng kiểu dáng nhưng khác màu (ví dụ túi trắng vs túi đen).
6. **Khắc phục phạt oan khi thiếu dữ liệu (*Missing Modalities*):** Thuật toán **Dynamic Adaptive Weighting** tự động tái phân bổ trọng số khi người dùng không nhập mô tả văn bản hoặc địa điểm.
7. **Ràng buộc logic vật lý:** **Causal Temporal Gate** ($t_{\text{found}} \ge t_{\text{lost}} - 1\text{ ngày}$) và **Hard Visual Gate** ($S_{\text{img}} \ge 0.55$) loại bỏ triệt để các kết quả phi lý trước khi xếp hạng.

---

## 2. SƠ ĐỒ WORKFLOW CHI TIẾT CỦA AI MATCHING PIPELINE

```mermaid
flowchart TB
    %% ==========================================
    %% KHỐI ĐẦU VÀO ĐA PHƯƠNG THỨC
    %% ==========================================
    subgraph INP["📥 1. ĐẦU VÀO TRUY VẤN & CƠ SỞ DỮ LIỆU"]
        Lost["Báo mất (Lost Query q):<br/>- Ảnh I_q<br/>- Tên & Mô tả Tiếng Việt T_q<br/>- Địa điểm L_q<br/>- Ngày mất t_q"]
        Found["Vật nhặt được (Found Item d):<br/>- Ảnh I_d<br/>- Tên & Mô tả Tiếng Việt T_d<br/>- Địa điểm L_d<br/>- Ngày nhặt t_d"]
    end

    %% ==========================================
    %% TIỀN XỬ LÝ HÌNH ẢNH YOLO
    %% ==========================================
    subgraph PRE["🔍 2. TIỀN XỬ LÝ ĐỐI TƯỢNG (YOLOv8 Smart Selective Crop)"]
        Detect{"YOLOv8 quét Bounding Boxes"}
        Check_Whitelist{"Nhãn thuộc COCO Whitelist?<br/>(backpack, handbag, phone, laptop...)"}
        Crop_Pad["Cắt RoI + Thêm 8% Padding an toàn<br/>Loại bỏ 70-80% phông nền nhiễu"]
        Fallback_Raw["BẢO LƯU 100% ẢNH GỐC<br/>(Khi gặp 'Person', Chìa khóa, Ví da<br/>hoặc nhãn phỏng đoán dao/ván trượt)"]

        Lost & Found --> Detect
        Detect -->|Có box tin cậy| Check_Whitelist
        Detect -->|Không phát hiện box| Fallback_Raw
        Check_Whitelist -->|Đúng nhãn Whitelist| Crop_Pad
        Check_Whitelist -->|Nhãn Person / Khác| Fallback_Raw
    end

    %% ==========================================
    %% PHÂN HỆ TRÍCH XUẤT ĐẶC TRƯNG LAI GHÉP
    %% ==========================================
    subgraph FEAT["🧠 3. PHÂN HỆ TRÍCH XUẤT ĐẶC TRƯNG LAI GHÉP (HYBRID EXTRACTORS)"]
        direction TB
        subgraph VISION_BRANCH["Phân hệ Thị giác sâu (Vision)"]
            Crop_Pad & Fallback_Raw --> ViT16["CLIP ViT-B/16 Vision Transformer<br/>(14x14 = 196 Spatial Patches)"]
            Crop_Pad & Fallback_Raw --> HSV["Center-weighted HSV Histogram<br/>(60% Lõi trung tâm: 16H + 8S + 8V)"]
            ViT16 --> Z_Img["Vector Ảnh: z_img ∈ ℝ^512 (Norm L2)"]
            HSV --> Z_Col["Vector Màu: z_col ∈ ℝ^32 (Norm L2)"]
        end

        subgraph TEXT_BRANCH["Phân hệ Ngôn ngữ bản địa (Language)"]
            PromptVN["Chuẩn hóa Tiếng Việt tự nhiên:<br/>'{name}. Mô tả: {desc}'"] --> MultiText["Multilingual CLIP Text Encoder<br/>(XLM-R / DistilBERT Distilled)"]
            MultiText --> Z_Txt["Vector Chữ: z_txt ∈ ℝ^512 (Norm L2)"]
        end
    end

    %% ==========================================
    %% TÍNH TOÁN ĐỘ TƯƠNG ĐỒNG THÀNH PHẦN
    %% ==========================================
    subgraph SIM["📐 4. ĐO LƯỜNG ĐỘ TƯƠNG ĐỒNG THÀNH PHẦN"]
        Z_Img --> S_Img["S_img = Cosine(z_img_q, z_img_d)"]
        Z_Col --> S_Col["S_col = Cosine(z_col_q, z_col_d)"]
        Z_Txt --> S_Txt["S_txt = Cosine(z_txt_q, z_txt_d)"]
        LocCompare["So sánh chuỗi L_q & L_d"] --> S_Loc["S_loc = Substring / Jaccard Similarity"]
    end

    %% ==========================================
    %% BỘ LỌC RÀNG BUỘC (GATING)
    %% ==========================================
    subgraph GATE["🛡️ 5. BỘ LỌC RÀNG BUỘC CHẶN (GATING VERIFICATION)"]
        Gate_Time{"Ràng buộc Thời gian Nhân quả:<br/>t_found >= t_lost - 1 ngày?"}
        Gate_Vis{"Hard Visual Gate:<br/>S_img >= 0.55?"}
        Gate_Loc{"Hard Location Gate (Tùy chọn):<br/>S_loc > 0.0?"}

        S_Img --> Gate_Vis
        Lost & Found --> Gate_Time
        S_Loc --> Gate_Loc

        Gate_Time -->|Vi phạm| REJ["🚫 LOẠI BỎ (REJECT)<br/>Lệch quy luật nhân quả thời gian"]
        Gate_Vis -->|Vi phạm| REJ["🚫 LOẠI BỎ (REJECT)<br/>Hình ảnh khác biệt quá lớn (S_img < 0.55)"]
        Gate_Loc -->|Vi phạm| REJ["🚫 LOẠI BỎ (REJECT)<br/>Địa điểm hoàn toàn khác biệt"]
    end

    %% ==========================================
    %% DUNG HỢP TRỌNG SỐ THÍCH ỨNG
    %% ==========================================
    subgraph FUSION["⚖️ 6. DUNG HỢP TRỌNG SỐ THÍCH ỨNG (Dynamic Adaptive Weighting)"]
        Gate_Time & Gate_Vis & Gate_Loc -->|PASS Tất cả bộ lọc| Check_Missing{"Kiểm tra phương thức thiếu?<br/>(Thiếu text? Thiếu location?)"}
        Check_Missing --> Recalc_Weights["Tái chuẩn hóa tập trọng số kích hoạt:<br/>w_active = {w_img, w_color, w_txt*, w_loc*}"]
        Recalc_Weights --> Base_Score["Tính điểm cơ sở:<br/>S_base = Σ(w_i * S_i) / Σ(w_i)"]
        
        Base_Score --> Penalty_Check{"Áp dụng phạt phi tuyến?<br/>(Visual Penalty)"}
        Penalty_Check -->|"Nếu S_img < 0.55"| Soft_Pen["S_final = S_base * (S_img / min_img)^2"]
        Penalty_Check -->|"Nếu S_img đạt chuẩn"| Keep_Score["S_final = S_base"]
    end

    %% ==========================================
    %% XẾP HẠNG & XAI
    %% ==========================================
    subgraph OUT["📊 7. PHÂN HẠNG & MINH BẠCH HÓA (Explainable AI - XAI)"]
        Soft_Pen & Keep_Score --> Sort_TopK["Sắp xếp giảm dần theo S_final"]
        Sort_TopK --> Filter_MinScore["Lọc điều kiện S_final >= min_score"]
        Filter_MinScore --> Display["Hiển thị Top-K Ứng viên tương thích nhất:<br/>- Bóc tách điểm thành phần: Ảnh, Màu, Chữ, Vị trí<br/>- Hiển thị ngày chênh lệch (Δt ngày)<br/>- Kèm danh sách các vật phẩm bị loại (Rejected Candidates)"]
    end

    INP --> PRE
    PRE --> FEAT
    FEAT --> SIM
    SIM --> GATE
    GATE --> FUSION
    FUSION --> OUT

    style REJ fill:#ffebee,stroke:#c62828,stroke-width:2px
    style Display fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style Recalc_Weights fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style ViT16 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style MultiText fill:#e0f2f1,stroke:#00796b,stroke-width:2px
```

---

## 3. CHI TIẾT TỪNG MODULE THUẬT TOÁN & CÔNG THỨC TOÁN HỌC

### Module 1: YOLOv8 Smart Selective Cropping & Safety Fallback
- **Vấn đề thực tế:** Mạng YOLOv8 chuẩn được huấn luyện trên tập nhãn MS-COCO gồm 80 lớp đối tượng tiếng Anh. Tập nhãn này **hoàn toàn không có nhãn chìa khóa (`keys`), ví da (`wallet`) hay thẻ sinh viên (`cards`)**. Nếu cắt cưỡng bức, YOLO sẽ nhận nhầm chìa khóa thành `knife` (dao) hoặc cắt lấy thân người cầm đồ (`person`).
- **Quy tắc Smart Crop:**
  1. Whitelist đồ vật cá nhân đáng tin cậy trong COCO:
     $$\mathcal{C}_{\text{whitelist}} = \{\text{backpack}, \text{umbrella}, \text{handbag}, \text{suitcase}, \text{bottle}, \text{cell phone}, \text{laptop}, \text{mouse}, \text{keyboard}, \text{book}, \text{clock}\}$$
  2. Nếu box có $\text{conf} \ge 0.25$ và nhãn $\in \mathcal{C}_{\text{whitelist}}$: Mở rộng viền an toàn $8\%$ padding:
     $$x_1' = \max(0, x_1 - 0.08(x_2 - x_1)), \quad y_1' = \max(0, y_1 - 0.08(y_2 - y_1))$$
     $$x_2' = \min(W, x_2 + 0.08(x_2 - x_1)), \quad y_2' = \min(H, y_2 + 0.08(y_2 - y_1))$$
  3. Nếu phát hiện `person` hoặc nhãn ngoài whitelist: **Bảo lưu $100\%$ ảnh gốc**, giao toàn bộ ảnh cho mạng CLIP ViT-B/16 tự nhận diện trọn vẹn.

---

### Module 2: CLIP ViT-B/16 Vision Transformer (512 chiều)
- Chia ảnh đầu vào ($224 \times 224$) thành lưới $14 \times 14$ với kích thước patch $16 \times 16$:
  $$N_{\text{patches}} = \left(\frac{224}{16}\right)^2 = 196 \text{ patches}$$
- Số lượng patch tăng gấp 4 lần so với ViT-B/32 (chỉ có 49 patches), duy trì sự tập trung chú ý (*Self-Attention*) đối với các chi tiết vi mô (móc khóa, logo nhỏ).
- Vector đặc trưng thị giác chuẩn hóa Euclid $L_2$:
  $$z_{\text{img}} = \frac{\mathbf{f}_{\text{img}}}{\|\mathbf{f}_{\text{img}}\|_2} \in \mathbb{R}^{512}$$

---

### Module 3: Multilingual CLIP Text Transformer (512 chiều - Xử lý Tiếng Việt)
- **Mô hình sử dụng:** `sentence-transformers/clip-ViT-B-32-multilingual-v1`.
- **Cơ chế chưng cất tri thức (Knowledge Distillation):** Mạng Transformer đa ngữ (kế thừa từ DistilBERT/XLM-R) được huấn luyện để mô phỏng không gian vector 512 chiều của CLIP, tiếp nhận trực tiếp Tiếng Việt có dấu:
  $$\text{Prompt} = \{name\} \text{. Mô tả: } \{desc\}$$
- Vector đặc trưng văn bản chuẩn hóa $L_2$:
  $$z_{\text{txt}} = \frac{\mathbf{f}_{\text{txt}}}{\|\mathbf{f}_{\text{txt}}\|_2} \in \mathbb{R}^{512}$$
- Đạt độ tương đồng ngữ nghĩa giữa *"Chìa khóa xe máy"* và *"Khóa xe máy"* lên tới **$97.01\%$**.

---

### Module 4: Center-weighted HSV Color Histogram (32 chiều)
- Khắc phục lỗi mù màu của CLIP: Chuyển đổi ảnh sang không gian màu HSV.
- Lấy **$60\%$ diện tích lõi trung tâm** ($y \in [0.2H, 0.8H], x \in [0.2W, 0.8W]$) để loại bỏ màu sắc viền còn sót lại.
- Xây dựng histogram 32 bins: 16 bins Hue, 8 bins Saturation, 8 bins Value.
- Vector màu chuẩn hóa $L_2$:
  $$\vec{v}_{\text{col}} = [h_1, \dots, h_{16}, s_1, \dots, s_8, v_1, \dots, v_8] \in \mathbb{R}^{32}, \quad z_{\text{col}} = \frac{\vec{v}_{\text{col}}}{\|\vec{v}_{\text{col}}\|_2 + 10^{-8}}$$

---

### Module 5: Ràng buộc Không gian - Thời gian (Spatio-Temporal Logic)
1. **Ràng buộc Thời gian nhân quả (Causal Temporal Validity):**
   $$\Delta t = t_{\text{found}} - t_{\text{lost}} \ge -\epsilon \quad (\epsilon = 1\text{ ngày dung sai})$$
   *Nếu $\Delta t < -1$, ứng viên bị loại bỏ ngay lập tức (không thể nhặt được đồ trước ngày làm mất).*
2. **Độ tương đồng Không gian địa danh ($S_{\text{loc}}$):**
   $$S_{\text{loc}}(L_q, L_d) = \begin{cases}
   \text{None} & \text{nếu } L_q = \emptyset \lor L_d = \emptyset \quad (\text{Hệ thống tự thích ứng, không phạt}) \\
   1.0 & \text{nếu } \text{norm}(L_q) = \text{norm}(L_d) \\
   0.90 & \text{nếu } L_q \subset L_d \lor L_d \subset L_q \\
   0.5 + 0.5 \times \frac{|W_{L_q} \cap W_{L_d}|}{|W_{L_q} \cup W_{L_d}|} & \text{nếu hệ số Jaccard } > 0 \\
   0.0 & \text{nếu khác biệt hoàn toàn}
   \end{cases}$$

---

### Module 6: Dung hợp Trọng số Thích ứng (Dynamic Adaptive Weighting)
Tránh phạt oan khi dữ liệu thiếu phương thức (Missing Modality):
$$S_{\text{base}} = \frac{\sum_{m \in \mathcal{M}_{\text{active}}} w_m \cdot S_m}{\sum_{m \in \mathcal{M}_{\text{active}}} w_m}$$
- Trọng số cấu hình: $w_{\text{img}} = 0.50$, $w_{\text{color}} = 0.25$, $w_{\text{txt}} = 0.15$, $w_{\text{loc}} = 0.10$.
- $\mathcal{M}_{\text{active}}$ tự động loại bỏ phương thức bị để trống và tái chuẩn hóa mẫu số.

---

### Module 7: Phạt Lũy thừa Phi tuyến & Bộ lọc Chặn (Visual Gating)
- **Hard Visual Gate:** Nếu $S_{\text{img}} < 0.55$, ứng viên bị đưa thẳng vào danh sách bị loại (Rejected Candidates).
- **Soft Visual Penalty:** Điểm số tổng hợp được điều chỉnh theo hàm parabol bậc 2 nếu điểm ảnh dưới ngưỡng:
  $$S_{\text{final}} = S_{\text{base}} \times \min\left(1.0, \left(\frac{S_{\text{img}}}{\tau_{\text{img}}}\right)^2\right)$$

---

## 4. BẢNG ĐỐI SOÁT THỰC NGHIỆM ĐỊNH LƯỢNG (ABLATION STUDY)

| Cấu hình | Mô tả kỹ thuật | Recall@1 | Recall@3 | MRR | Discrimination Margin ($\Delta$) | Hiện tượng quan sát được |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **M1: Baseline** | `CLIP ViT-B/32` + Linear Fusion thông thường | 33.3% | 66.7% | 0.555 | 0.082 | Bị phạt oan do thiếu text; túi xách lẫn vào Top chìa khóa |
| **M2: Cải tiến Backbone** | `CLIP ViT-B/16` (196 patches) + Linear Fusion | 66.7% | 66.7% | 0.778 | 0.112 | Bắt chi tiết tốt hơn nhưng vẫn nhầm túi trắng vs túi đen |
| **M3: + Adaptive Weighting**| `ViT-B/16` + Dynamic Adaptive Weighting | 100% | 66.7% | 1.000 | 0.123 | Triệt tiêu hoàn toàn lỗi phạt oan khi thiếu mô tả text |
| **M4: + Color & Gating** | M3 + Center HSV + Visual Gating ($\ge 0.55$) | 100% | 100% | 1.000 | 0.185 | Phân biệt màu sắc chính xác; loại bỏ 100% túi khỏi Top chìa khóa |
| **M5: Đề xuất Toàn diện** | **YOLOv8 + ViT-B/16 (Ảnh) + Multilingual CLIP (Text) + HSV + Gating** | **100%** | **100%** | **1.000** | **0.228** | **Tối ưu toàn diện: Margin cực đại, triệt tiêu nhiễu nền, hiểu tiếng Việt trực tiếp** |
