"""
Ứng dụng: Tìm kiếm & So khớp đồ thất lạc đa phương thức (Lost & Found AI Pipeline)
Kiến trúc: YOLOv8 Object Detection (Smart Selective Crop) + CLIP ViT-B/16 + HSV Color Histogram + Spatio-Temporal Gating & Dynamic Adaptive Weighting

Chạy:
    streamlit run app.py
"""

import streamlit as st
from PIL import Image
import numpy as np
import os
import json
import time
from datetime import datetime
import torch
from transformers import CLIPModel, CLIPProcessor
from ultralytics import YOLO

# ----------------------------------------------------------------------------
# Cấu hình đường dẫn lưu trữ demo
# ----------------------------------------------------------------------------
DATA_DIR = "lost_found_data"
IMAGES_DIR = os.path.join(DATA_DIR, "images")
DB_FILE = os.path.join(DATA_DIR, "items.json")
os.makedirs(IMAGES_DIR, exist_ok=True)

# Danh mục các lớp đồ vật đáng tin cậy trong MS-COCO 80 lớp của YOLO
RELEVANT_LF_COCO_CLASSES = {
    "backpack", "umbrella", "handbag", "suitcase", "bottle",
    "cell phone", "laptop", "mouse", "keyboard", "book", "clock"
}


# ----------------------------------------------------------------------------
# Nạp các mô hình AI (Cached)
# ----------------------------------------------------------------------------
@st.cache_resource(show_spinner="Đang nạp mô hình CLIP...")
def load_clip_model(model_name: str = "openai/clip-vit-base-patch16"):
    model = CLIPModel.from_pretrained(model_name)
    processor = CLIPProcessor.from_pretrained(model_name)
    model.eval()
    return model, processor


@st.cache_resource(show_spinner="Đang nạp mô hình YOLOv8...")
def load_yolo_model(weights: str = "yolov8n.pt"):
    model = YOLO(weights)
    return model


# ----------------------------------------------------------------------------
# Tiền xử lý & Trích xuất đặc trưng hình ảnh (YOLO + CLIP + HSV)
# ----------------------------------------------------------------------------
def detect_and_crop_object(
    image: Image.Image,
    yolo_model,
    conf_thresh: float = 0.25,
    padding_ratio: float = 0.08,
    strict_lf_only: bool = True,
):
    """
    Sử dụng YOLOv8 để định vị vật thể chính trong ảnh.
    LƯU Ý HỌC THUẬT:
    - YOLOv8 (COCO) chỉ có 80 lớp tiếng Anh, KHÔNG có tiếng Việt và KHÔNG có lớp 'chìa khóa' (keys) hay 'ví da' (wallet).
    - Nếu strict_lf_only=True: Chỉ cắt khi phát hiện các lớp đồ vật thực tế (backpack, handbag, suitcase, phone...).
      Nếu phát hiện 'person' (người cầm đồ) hoặc nhãn phỏng đoán ('knife', 'skateboard', 'tv'),
      hệ thống TỰ ĐỘNG BẢO LƯU ẢNH GỐC để tránh cắt sai làm hỏng ảnh của CLIP!
    """
    img_rgb = image.convert("RGB")
    w, h = img_rgb.size
    results = yolo_model(img_rgb, verbose=False)[0]
    boxes = results.boxes

    annotated_arr = results.plot()[..., ::-1]  # BGR sang RGB
    annotated_img = Image.fromarray(annotated_arr)

    if len(boxes) == 0:
        return img_rgb, None, "Toàn cảnh (Không phát hiện)", 0.0, annotated_img, False

    valid_boxes = [b for b in boxes if float(b.conf[0]) >= conf_thresh]
    if not valid_boxes:
        return img_rgb, None, "Toàn cảnh (Độ tin cậy thấp)", 0.0, annotated_img, False

    if strict_lf_only:
        # Lọc các box thuộc danh mục đồ vật thất lạc COCO hợp lệ
        candidate_boxes = []
        for b in valid_boxes:
            cls_name = yolo_model.names[int(b.cls[0])]
            if cls_name in RELEVANT_LF_COCO_CLASSES:
                candidate_boxes.append((b, cls_name, float(b.conf[0])))

        if candidate_boxes:
            candidate_boxes.sort(key=lambda x: x[2], reverse=True)
            target_box, cls_name, conf = candidate_boxes[0]
            x1, y1, x2, y2 = target_box.xyxy[0].cpu().numpy()
            pad_w = (x2 - x1) * padding_ratio
            pad_h = (y2 - y1) * padding_ratio
            cx1 = max(0, int(x1 - pad_w))
            cy1 = max(0, int(y1 - pad_h))
            cx2 = min(w, int(x2 + pad_w))
            cy2 = min(h, int(y2 + pad_h))
            cropped_img = img_rgb.crop((cx1, cy1, cx2, cy2))
            return cropped_img, (cx1, cy1, cx2, cy2), f"Đồ vật: {cls_name}", conf, annotated_img, True
        else:
            top_box = valid_boxes[0]
            cls_name = yolo_model.names[int(top_box.cls[0])]
            conf = float(top_box.conf[0])
            return (
                img_rgb,
                None,
                f"Bảo lưu ảnh gốc (Nhãn COCO '{cls_name}' không phải đồ vật)",
                conf,
                annotated_img,
                False,
            )
    else:
        items = [b for b in valid_boxes if int(b.cls[0]) != 0]
        target_box = items[0] if items else valid_boxes[0]
        x1, y1, x2, y2 = target_box.xyxy[0].cpu().numpy()
        cls_name = yolo_model.names[int(target_box.cls[0])]
        conf = float(target_box.conf[0])
        pad_w = (x2 - x1) * padding_ratio
        pad_h = (y2 - y1) * padding_ratio
        cx1 = max(0, int(x1 - pad_w))
        cy1 = max(0, int(y1 - pad_h))
        cx2 = min(w, int(x2 + pad_w))
        cy2 = min(h, int(y2 + pad_h))
        cropped_img = img_rgb.crop((cx1, cy1, cx2, cy2))
        return cropped_img, (cx1, cy1, cx2, cy2), cls_name, conf, annotated_img, True


def _extract_embedding_tensor(output):
    """Trích xuất tensor nhúng chuẩn từ output của CLIP."""
    if torch.is_tensor(output):
        return output
    if hasattr(output, "pooler_output") and output.pooler_output is not None:
        return output.pooler_output
    if hasattr(output, "image_embeds") and output.image_embeds is not None:
        return output.image_embeds
    if hasattr(output, "text_embeds") and output.text_embeds is not None:
        return output.text_embeds
    raise TypeError(f"Không nhận diện được kiểu output của CLIP: {type(output)}")


def get_image_embedding(model, processor, image: Image.Image):
    """Trích xuất vector 512 chiều chuẩn hóa L2 từ CLIP Vision Transformer."""
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        raw = model.get_image_features(**inputs)
    feats = _extract_embedding_tensor(raw)
    feats = feats / feats.norm(p=2, dim=-1, keepdim=True)
    return feats[0].numpy().tolist()


def get_text_embedding(model, processor, text: str):
    """Trích xuất vector 512 chiều chuẩn hóa L2 từ CLIP Text Transformer."""
    inputs = processor(text=[text], return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        raw = model.get_text_features(**inputs)
    feats = _extract_embedding_tensor(raw)
    feats = feats / feats.norm(p=2, dim=-1, keepdim=True)
    return feats[0].numpy().tolist()


def get_color_embedding(image: Image.Image):
    """
    Trích xuất biểu đồ màu sắc HSV (Center-weighted 60% vùng trung tâm) 32 chiều.
    Giúp chống bẫy mù màu (attribute binding) của CLIP gốc.
    """
    img = image.convert("RGB").resize((150, 150))
    img_hsv = img.convert("HSV")
    arr_hsv = np.array(img_hsv, dtype=np.float32)

    # Vùng trung tâm 60%
    h, w = arr_hsv.shape[:2]
    y1, y2 = int(h * 0.2), int(h * 0.8)
    x1, x2 = int(w * 0.2), int(w * 0.8)
    center = arr_hsv[y1:y2, x1:x2]

    # 16 bins Hue, 8 bins Saturation, 8 bins Value
    h_hist, _ = np.histogram(center[:, :, 0], bins=16, range=(0, 256))
    s_hist, _ = np.histogram(center[:, :, 1], bins=8, range=(0, 256))
    v_hist, _ = np.histogram(center[:, :, 2], bins=8, range=(0, 256))

    vec = np.concatenate([h_hist, s_hist, v_hist]).astype(np.float32)
    norm = np.linalg.norm(vec) + 1e-8
    return (vec / norm).tolist()


def build_prompt_text(name: str, desc: str) -> str:
    """Chuẩn hóa prompt ngữ cảnh cho CLIP text encoder."""
    name = (name or "").strip()
    desc = (desc or "").strip()
    if name and desc:
        return f"a photo of a {name}. Description: {desc}"
    elif name:
        return f"a photo of a {name}"
    elif desc:
        return f"a photo of {desc}"
    return ""


def cosine_sim(a, b):
    if a is None or b is None:
        return 0.0
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8))


# ----------------------------------------------------------------------------
# Xử lý Ràng buộc Không gian & Thời gian (Spatio-Temporal Logic)
# ----------------------------------------------------------------------------
def compute_location_similarity(loc1: str, loc2: str):
    """
    Đo lường độ tương đồng không gian (Location Match Score):
    - Nếu 1 trong 2 để trống -> Trả về None (Dynamic Adaptive Weighting tự bỏ qua, không phạt oan).
    - Nếu giống nhau hoàn toàn -> 1.0
    - Nếu chứa nhau (vd: 'Hà Nội' nằm trong 'Hồ Tây, Hà Nội') -> 0.90
    - Nếu có giao thoa từ khóa (Jaccard similarity) -> 0.5 ~ 0.85
    - Nếu hoàn toàn khác nhau -> 0.0
    """
    l1 = (loc1 or "").strip().lower()
    l2 = (loc2 or "").strip().lower()

    if not l1 or not l2:
        return None

    if l1 == l2:
        return 1.0

    if l1 in l2 or l2 in l1:
        return 0.90

    for ch in [",", "-", ".", "/", "\\", ";"]:
        l1 = l1.replace(ch, " ")
        l2 = l2.replace(ch, " ")

    w1 = set(l1.split())
    w2 = set(l2.split())
    intersection = w1.intersection(w2)
    union = w1.union(w2)

    if union:
        jaccard = len(intersection) / len(union)
        if jaccard > 0:
            return round(float(0.5 + 0.5 * jaccard), 3)

    return 0.0


def check_temporal_validity(date_lost_str: str, date_found_str: str, tolerance_days: int = 1):
    """
    Kiểm tra tính hợp lệ về mặt thời gian (Causal Temporal Validity):
    Đồ chỉ có thể được nhặt SAU hoặc TRONG ngày bị mất (cho phép dung sai +- tolerance_days).
    Trả về: (is_valid: bool, delta_days: int)
    """
    if not date_lost_str or not date_found_str:
        return True, 0
    try:
        d_lost = datetime.strptime(str(date_lost_str)[:10], "%Y-%m-%d").date()
        d_found = datetime.strptime(str(date_found_str)[:10], "%Y-%m-%d").date()
        diff = (d_found - d_lost).days
        is_valid = diff >= -tolerance_days
        return is_valid, diff
    except Exception:
        return True, 0


# ----------------------------------------------------------------------------
# Thuật toán Dung hợp đa phương thức & Gating Score
# ----------------------------------------------------------------------------
def compute_match_score(
    lost_item,
    found_item,
    w_img=0.50,
    w_color=0.25,
    w_txt=0.15,
    w_loc=0.10,
    use_cross_modal=False,
    w_cross=0.10,
):
    """
    Tính điểm tổng hợp theo thuật toán Dynamic Adaptive Weighting kết hợp Spatio-Temporal:
    - S_img: Độ tương đồng ảnh (CLIP ViT-B/16)
    - S_color: Độ tương đồng màu sắc (Center HSV)
    - S_txt: Độ tương đồng ngữ nghĩa văn bản (CLIP Text) - Tự thích ứng nếu thiếu
    - S_loc: Độ tương đồng địa điểm không gian - Tự thích ứng nếu thiếu
    - S_cross: So khớp chéo Ảnh <-> Chữ (Cross-modal)
    """
    img_sim = cosine_sim(lost_item.get("img_embedding"), found_item.get("img_embedding"))

    if lost_item.get("color_embedding") and found_item.get("color_embedding"):
        color_sim = cosine_sim(lost_item["color_embedding"], found_item["color_embedding"])
    else:
        color_sim = 1.0

    has_txt_lost = bool(
        lost_item.get("txt_embedding")
        and (lost_item.get("name", "").strip() or lost_item.get("desc", "").strip())
    )
    has_txt_found = bool(
        found_item.get("txt_embedding")
        and (found_item.get("name", "").strip() or found_item.get("desc", "").strip())
    )

    if has_txt_lost and has_txt_found:
        txt_sim = cosine_sim(lost_item["txt_embedding"], found_item["txt_embedding"])
    else:
        txt_sim = None

    loc_sim = compute_location_similarity(lost_item.get("location"), found_item.get("location"))

    cross_sim = None
    if use_cross_modal:
        cross_parts = []
        if has_txt_found and lost_item.get("img_embedding"):
            cross_parts.append(cosine_sim(lost_item["img_embedding"], found_item["txt_embedding"]))
        if has_txt_lost and found_item.get("img_embedding"):
            cross_parts.append(cosine_sim(lost_item["txt_embedding"], found_item["img_embedding"]))
        if cross_parts:
            cross_sim = float(np.mean(cross_parts))

    active_weights = [w_img]
    active_sims = [img_sim]

    if w_color > 0:
        active_weights.append(w_color)
        active_sims.append(color_sim)

    if txt_sim is not None and w_txt > 0:
        active_weights.append(w_txt)
        active_sims.append(txt_sim)

    if loc_sim is not None and w_loc > 0:
        active_weights.append(w_loc)
        active_sims.append(loc_sim)

    if cross_sim is not None and use_cross_modal and w_cross > 0:
        active_weights.append(w_cross)
        active_sims.append(cross_sim)

    total_w = sum(active_weights)
    if total_w > 0:
        final_score = sum(w * s for w, s in zip(active_weights, active_sims)) / total_w
    else:
        final_score = img_sim

    return final_score, img_sim, color_sim, txt_sim, cross_sim, loc_sim


# ----------------------------------------------------------------------------
# Quản lý Database & Tự động đồng bộ Embedding
# ----------------------------------------------------------------------------
def save_db(db):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)


def recompute_all_embeddings(
    db,
    clip_model,
    processor,
    model_name,
    yolo_model=None,
    use_yolo=True,
    strict_lf_only=True,
):
    """Tự động tính lại toàn bộ embeddings với tùy chọn tiền xử lý YOLO thông minh."""
    for cat in ["lost", "found"]:
        for item in db.get(cat, []):
            img_path = item.get("image_path")
            if img_path and os.path.exists(img_path):
                img = Image.open(img_path).convert("RGB")
                if use_yolo and yolo_model is not None:
                    crop_img, box, label, conf, _, was_cropped = detect_and_crop_object(
                        img, yolo_model, strict_lf_only=strict_lf_only
                    )
                    item["yolo_label"] = label
                    item["yolo_conf"] = conf
                    item["yolo_box"] = box
                    item["was_cropped"] = was_cropped
                    item["img_embedding"] = get_image_embedding(clip_model, processor, crop_img)
                    item["color_embedding"] = get_color_embedding(crop_img)
                else:
                    item["img_embedding"] = get_image_embedding(clip_model, processor, img)
                    item["color_embedding"] = get_color_embedding(img)
                    item["yolo_label"] = "Toàn ảnh gốc"
                    item["was_cropped"] = False
            name = item.get("name", "")
            desc = item.get("desc", "")
            prompt = build_prompt_text(name, desc)
            item["txt_embedding"] = (
                get_text_embedding(clip_model, processor, prompt) if prompt else None
            )
    db["current_model"] = model_name
    db["use_yolo"] = use_yolo
    db["strict_lf_only"] = strict_lf_only
    save_db(db)
    return db


def load_db(
    clip_model=None,
    processor=None,
    model_name=None,
    yolo_model=None,
    use_yolo=True,
    strict_lf_only=True,
):
    """Nạp database và tự động kiểm tra đồng bộ model/yolo."""
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        needs_sync = False
        if clip_model is not None and processor is not None and model_name is not None:
            if (
                data.get("current_model") != model_name
                or data.get("use_yolo") != use_yolo
                or data.get("strict_lf_only") != strict_lf_only
            ):
                needs_sync = True

        if needs_sync:
            data = recompute_all_embeddings(
                data, clip_model, processor, model_name, yolo_model, use_yolo, strict_lf_only
            )
        return data
    return {
        "lost": [],
        "found": [],
        "current_model": model_name,
        "use_yolo": use_yolo,
        "strict_lf_only": strict_lf_only,
    }


# ----------------------------------------------------------------------------
# Giao diện người dùng Streamlit
# ----------------------------------------------------------------------------
st.set_page_config(
    page_title="Lost & Found AI - Multimodal Spatio-Temporal Retrieval",
    layout="wide",
    page_icon="🔍",
)

# Sidebar: Cấu hình hệ thống AI
st.sidebar.header("🤖 Cấu hình AI Pipeline")

model_options = {
    "openai/clip-vit-base-patch16": "openai/clip-vit-base-patch16 (196 Patches — Khuyên dùng)",
    "openai/clip-vit-base-patch32": "openai/clip-vit-base-patch32 (49 Patches — Baseline)",
}
selected_model_name = st.sidebar.selectbox(
    "Mô hình CLIP Backbone:",
    list(model_options.keys()),
    index=0,
    format_func=lambda x: model_options[x],
    help="ViT-B/16 chia ảnh thành 14x14 = 196 patches (mịn gấp 4 lần B/32), phân biệt chi tiết vật nhỏ rất tốt.",
)

enable_yolo = st.sidebar.checkbox(
    "Kích hoạt YOLOv8 tiền xử lý đối tượng",
    value=True,
    help="Sử dụng YOLOv8 để định vị đồ vật trong ảnh.",
)

yolo_mode = st.sidebar.radio(
    "Cơ chế cắt ảnh YOLOv8:",
    [
        "Thông minh (Chỉ cắt Ba lô, Túi, ĐT... Bảo lưu ảnh gốc cho Chìa khóa)",
        "Tắt cắt ảnh (Luôn dùng 100% ảnh gốc cho CLIP)",
    ],
    index=0,
    help="YOLOv8 chỉ có 80 lớp tiếng Anh của COCO (không có nhãn chìa khóa/ví). Cơ chế Thông minh sẽ tự giữ nguyên ảnh gốc khi gặp chìa khóa hoặc người cầm đồ.",
)
strict_lf_only = yolo_mode.startswith("Thông minh")
actual_use_yolo = enable_yolo and ("Tắt cắt ảnh" not in yolo_mode)

with st.sidebar.expander("💡 Lưu ý về YOLO & Tiếng Việt"):
    st.caption(
        """**Tại sao YOLO không nhận diện được tiếng Việt?**
- Trọng số chuẩn của YOLOv8 (`yolov8n.pt`) được huấn luyện trên bộ dữ liệu **MS-COCO (80 lớp tiếng Anh)**.
- COCO **hoàn toàn không có nhãn chìa khóa (`keys`) hay ví da (`wallet`)**.
- Do đó, khi soi chùm chìa khóa, YOLO cố đoán thành `knife` (dao), `skateboard` (ván trượt) hoặc `person` (người cầm).
- **Giải pháp của chúng tôi:** Cơ chế *Smart Selective Crop* chỉ cắt khi nhận đúng đồ vật COCO (ba lô, túi xách, điện thoại); nếu gặp chìa khóa hoặc người cầm, hệ thống **bảo lưu toàn bộ ảnh gốc** để CLIP ViT-B/16 tự nhận diện trọn vẹn!"""
    )

with st.spinner("Đang khởi tạo các mô hình AI..."):
    clip_model, processor = load_clip_model(selected_model_name)
    yolo_model = load_yolo_model("yolov8n.pt") if enable_yolo else None

db = load_db(clip_model, processor, selected_model_name, yolo_model, actual_use_yolo, strict_lf_only)

if st.sidebar.button("🔄 Tái tạo toàn bộ Embeddings"):
    with st.spinner("Đang tính toán lại vector embedding cho toàn bộ cơ sở dữ liệu..."):
        db = recompute_all_embeddings(
            db, clip_model, processor, selected_model_name, yolo_model, actual_use_yolo, strict_lf_only
        )
    st.sidebar.success("Đã đồng bộ lại embeddings!")
    st.rerun()

# Tiêu đề ứng dụng
st.title("Hệ thống tìm kiếm đồ thất lạc đa phương thức - KhanhTB")
st.caption(
    "Kiến trúc kết hợp: **YOLOv8 Smart Object Crop** + **CLIP ViT-B/16** + "
    "**Center HSV Color Histogram** + **Spatio-Temporal Gating & Dynamic Weighting**"
)

tab1, tab2, tab3 = st.tabs(["📤 Báo mất đồ", "📥 Báo nhặt được đồ", "🔗 So khớp & Truy vấn"])

# --- TAB 1: BÁO MẤT ĐỒ ---
with tab1:
    st.subheader("Thông tin người bị mất đồ")
    with st.form("lost_form", clear_on_submit=True):
        name = st.text_input("Tên vật dụng (vd: Chìa khóa xe máy, Ví da, Ba lô...)")
        desc = st.text_area("Mô tả chi tiết (màu sắc, vết xước, móc khóa, hình vẽ...)")
        col_a, col_b = st.columns(2)
        with col_a:
            location = st.text_input("Địa điểm làm mất (vd: Thư viện Bách Khoa, Láng Hòa Lạc, Hồ Tây...)")
        with col_b:
            date = st.date_input("Ngày làm mất", value=datetime.today())
        contact = st.text_input("Thông tin liên hệ (SĐT / Email / Facebook)")
        image_file = st.file_uploader(
            "Tải lên ảnh vật dụng bị mất",
            type=["jpg", "jpeg", "png"],
        )
        submitted = st.form_submit_button("Gửi báo mất đồ")

        if submitted:
            if image_file is None or not name:
                st.error("Vui lòng nhập tên vật dụng và tải lên hình ảnh.")
            else:
                image = Image.open(image_file).convert("RGB")
                item_id = f"lost_{int(time.time() * 1000)}"
                img_path = os.path.join(IMAGES_DIR, f"{item_id}.jpg")
                image.save(img_path)

                if actual_use_yolo and yolo_model is not None:
                    crop_img, crop_box, y_label, y_conf, ann_img, was_cropped = detect_and_crop_object(
                        image, yolo_model, strict_lf_only=strict_lf_only
                    )
                else:
                    crop_img, crop_box, y_label, y_conf, ann_img, was_cropped = (
                        image, None, "Toàn cảnh (Không dùng YOLO)", 0.0, image, False
                    )

                img_emb = get_image_embedding(clip_model, processor, crop_img)
                color_emb = get_color_embedding(crop_img)
                prompt = build_prompt_text(name, desc)
                txt_emb = (
                    get_text_embedding(clip_model, processor, prompt) if prompt else None
                )

                db["lost"].append(
                    {
                        "id": item_id,
                        "name": name,
                        "desc": desc,
                        "location": location,
                        "date": str(date),
                        "contact": contact,
                        "image_path": img_path,
                        "yolo_label": y_label,
                        "yolo_conf": y_conf,
                        "yolo_box": crop_box,
                        "was_cropped": was_cropped,
                        "img_embedding": img_emb,
                        "color_embedding": color_emb,
                        "txt_embedding": txt_emb,
                    }
                )
                save_db(db)
                crop_msg = "Đã cắt gọn đối tượng" if was_cropped else "Bảo lưu toàn ảnh gốc"
                st.success(
                    f"Đã lưu báo mất: **{item_id}** ({y_label} | {crop_msg})"
                )

    st.divider()
    st.markdown(f"**Danh sách báo mất hiện có ({len(db['lost'])} vật phẩm):**")
    for item in reversed(db["lost"]):
        y_info = f" | 🎯 YOLO: {item.get('yolo_label', 'N/A')}" if item.get('yolo_label') else ""
        with st.expander(f"{item['name']} — {item['location']} ({item['date']}){y_info}"):
            c1, c2 = st.columns([1, 3])
            with c1:
                st.image(item["image_path"], width=160)
            with c2:
                st.write(f"**Mô tả:** {item['desc'] if item['desc'] else '*(Trống)*'}")
                st.write(f"**Địa điểm:** {item['location']} | **Ngày mất:** {item['date']}")
                st.write(f"**Liên hệ:** {item['contact']}")

# --- TAB 2: BÁO NHẶT ĐƯỢC ĐỒ ---
with tab2:
    st.subheader("Thông tin người nhặt được đồ")
    with st.form("found_form", clear_on_submit=True):
        name2 = st.text_input("Tên vật dụng nhặt được")
        desc2 = st.text_area("Mô tả chi tiết vật nhặt được")
        col_c, col_d = st.columns(2)
        with col_c:
            location2 = st.text_input("Địa điểm nhặt được (vd: Hồ Tây, Láng Hòa Lạc, Hà Nội...)")
        with col_d:
            date2 = st.date_input("Ngày nhặt được", value=datetime.today(), key="date2")
        contact2 = st.text_input("Thông tin liên hệ người nhặt")
        image_file2 = st.file_uploader(
            "Tải lên ảnh chụp thực tế vật nhặt được",
            type=["jpg", "jpeg", "png"],
            key="found_img",
        )
        submitted2 = st.form_submit_button("Gửi báo nhặt được đồ")

        if submitted2:
            if image_file2 is None or not name2:
                st.error("Vui lòng nhập tên vật dụng và tải lên hình ảnh.")
            else:
                image2 = Image.open(image_file2).convert("RGB")
                item_id2 = f"found_{int(time.time() * 1000)}"
                img_path2 = os.path.join(IMAGES_DIR, f"{item_id2}.jpg")
                image2.save(img_path2)

                if actual_use_yolo and yolo_model is not None:
                    crop_img2, crop_box2, y_label2, y_conf2, ann_img2, was_cropped2 = detect_and_crop_object(
                        image2, yolo_model, strict_lf_only=strict_lf_only
                    )
                else:
                    crop_img2, crop_box2, y_label2, y_conf2, ann_img2, was_cropped2 = (
                        image2, None, "Toàn cảnh (Không dùng YOLO)", 0.0, image2, False
                    )

                img_emb2 = get_image_embedding(clip_model, processor, crop_img2)
                color_emb2 = get_color_embedding(crop_img2)
                prompt2 = build_prompt_text(name2, desc2)
                txt_emb2 = (
                    get_text_embedding(clip_model, processor, prompt2) if prompt2 else None
                )

                db["found"].append(
                    {
                        "id": item_id2,
                        "name": name2,
                        "desc": desc2,
                        "location": location2,
                        "date": str(date2),
                        "contact": contact2,
                        "image_path": img_path2,
                        "yolo_label": y_label2,
                        "yolo_conf": y_conf2,
                        "yolo_box": crop_box2,
                        "was_cropped": was_cropped2,
                        "img_embedding": img_emb2,
                        "color_embedding": color_emb2,
                        "txt_embedding": txt_emb2,
                    }
                )
                save_db(db)
                crop_msg2 = "Đã cắt gọn đối tượng" if was_cropped2 else "Bảo lưu toàn ảnh gốc"
                st.success(
                    f"Đã lưu báo nhặt được: **{item_id2}** ({y_label2} | {crop_msg2})"
                )

    st.divider()
    st.markdown(f"**Danh sách báo nhặt được hiện có ({len(db['found'])} vật phẩm):**")
    for item in reversed(db["found"]):
        y_info = f" | 🎯 YOLO: {item.get('yolo_label', 'N/A')}" if item.get('yolo_label') else ""
        with st.expander(f"{item['name']} — {item['location']} ({item['date']}){y_info}"):
            c1, c2 = st.columns([1, 3])
            with c1:
                st.image(item["image_path"], width=160)
            with c2:
                st.write(f"**Mô tả:** {item['desc'] if item['desc'] else '*(Trống)*'}")
                st.write(f"**Địa điểm:** {item['location']} | **Ngày nhặt:** {item['date']}")
                st.write(f"**Liên hệ:** {item['contact']}")

# --- TAB 3: SO KHỚP & TRUY VẤN ĐA PHƯƠNG THỨC ---
with tab3:
    st.subheader("Truy vấn so khớp: Chọn 1 báo mất để tìm kiếm các vật nhặt được tương thích nhất")

    if not db["lost"]:
        st.info("Chưa có tin báo mất đồ nào. Vui lòng thêm tại tab 'Báo mất đồ'.")
    elif not db["found"]:
        st.info("Chưa có tin báo nhặt được nào. Vui lòng thêm tại tab 'Báo nhặt được đồ'.")
    else:
        lost_options = {f"{item['name']} ({item['id']})": item for item in db["lost"]}
        selected_label = st.selectbox("Chọn tin báo mất cần tìm kiếm:", list(lost_options.keys()))
        selected_lost = lost_options[selected_label]

        col1, col2 = st.columns([1, 2])
        with col1:
            st.markdown("### 🎒 Vật phẩm tìm kiếm (Query)")
            st.image(selected_lost["image_path"], width=260)
            st.write(f"**Tên:** {selected_lost['name']}")
            st.write(f"**Mô tả:** {selected_lost['desc'] if selected_lost['desc'] else '*(Trống)*'}")
            st.write(f"**Địa điểm:** 📍 {selected_lost.get('location', '*(Không rõ)*')}")
            st.write(f"**Ngày mất:** 📅 {selected_lost.get('date', '*(Không rõ)*')}")
            if selected_lost.get("yolo_label"):
                crop_status = "Đã cắt bớt nền" if selected_lost.get("was_cropped") else "Dùng toàn ảnh gốc"
                st.info(f"🎯 **YOLO Trạng thái:** `{selected_lost['yolo_label']}` ({crop_status})")

            st.markdown("---")
            st.markdown("#### ⚙️ Trọng số dung hợp đa phương thức")

            w_img = st.slider(
                "Trọng số Hình ảnh (CLIP ViT-B/16)",
                0.0, 1.0, 0.50, step=0.05,
                help="Mức độ quan trọng của đặc trưng hình dạng, cấu trúc từ mô hình CLIP.",
            )
            w_color = st.slider(
                "Trọng số Màu sắc (Center HSV)",
                0.0, 1.0, 0.25, step=0.05,
                help="Giúp phân biệt các vật thể cùng kiểu dáng nhưng khác màu (ví dụ túi trắng vs túi đen).",
            )
            w_txt = st.slider(
                "Trọng số Văn bản mô tả (CLIP Text)",
                0.0, 1.0, 0.15, step=0.05,
                help="Nếu một bên thiếu mô tả, hệ thống tự động tái phân bổ trọng số sang các phương thức khác.",
            )
            w_loc = st.slider(
                "Trọng số Địa điểm không gian (Location Match)",
                0.0, 1.0, 0.10, step=0.05,
                help="Điểm cộng khi trùng khớp khu vực địa lý. Tự động thích ứng nếu không điền.",
            )

            enable_cross_modal = st.checkbox(
                "Bật so khớp chéo Ảnh ↔ Chữ (Cross-modal)",
                value=False,
                help="So sánh ảnh vật bị mất với mô tả văn bản nhặt được và ngược lại.",
            )
            w_cross = 0.10 if enable_cross_modal else 0.0

            st.markdown("---")
            st.markdown("#### 🛡️ Ràng buộc & Bộ lọc thông minh (Gating)")

            enable_visual_gate = st.checkbox(
                "Bật bộ lọc chặn ảnh không khớp (Visual Gating)",
                value=True,
                help="Loại thẳng các vật thể có độ tương đồng ảnh CLIP dưới ngưỡng tối thiểu.",
            )
            min_img_sim = st.slider(
                "Ngưỡng tương đồng ảnh tối thiểu (min img_sim):",
                0.0, 1.0, 0.55, step=0.05,
                help="Vật phẩm có img_sim < ngưỡng này sẽ bị coi là khác loại hoàn toàn và bị loại bỏ.",
            )
            apply_penalty = st.checkbox(
                "Áp dụng phạt lũy thừa nếu ảnh yếu (Visual Penalty)",
                value=True,
                help="Hạ điểm phi tuyến tính để đảm bảo vật khác ảnh không thể ngoi lên Top.",
            )

            enable_temporal_gate = st.checkbox(
                "Bộ lọc Thời gian Nhân quả (Causal Temporal Gate)",
                value=True,
                help="Loại bỏ các vật phẩm có ngày nhặt trước ngày mất (phi logic nhân quả).",
            )

            enable_hard_loc_gate = st.checkbox(
                "Bộ lọc Địa điểm Cứng (Hard Location Gate)",
                value=False,
                help="Nếu bật, chỉ chấp nhận các vật phẩm có cùng địa điểm hoặc chứa từ khóa địa điểm chung.",
            )

            st.markdown("#### 🎯 Giới hạn hiển thị")
            top_k = st.number_input(
                "Chỉ hiện Top-K kết quả cao nhất:",
                min_value=1,
                max_value=max(len(db["found"]), 1),
                value=min(5, len(db["found"])),
                step=1,
            )
            min_score = st.slider(
                "Ngưỡng điểm tổng hợp tối thiểu để hiển thị:",
                0.0, 1.0, 0.45, step=0.01,
            )

        qualified_results = []
        rejected_results = []

        for f_item in db["found"]:
            score, img_sim, color_sim, txt_sim, cross_sim, loc_sim = compute_match_score(
                selected_lost,
                f_item,
                w_img=w_img,
                w_color=w_color,
                w_txt=w_txt,
                w_loc=w_loc,
                use_cross_modal=enable_cross_modal,
                w_cross=w_cross,
            )

            is_valid_time, delta_days = check_temporal_validity(
                selected_lost.get("date"), f_item.get("date"), tolerance_days=1
            )

            rejection_reasons = []

            if enable_temporal_gate and not is_valid_time:
                rejection_reasons.append(
                    f"Ngày nhặt ({f_item.get('date')}) trước ngày mất ({selected_lost.get('date')})"
                )

            if enable_hard_loc_gate and loc_sim is not None and loc_sim == 0.0:
                rejection_reasons.append(
                    f"Địa điểm hoàn toàn khác biệt ('{f_item.get('location')}' vs '{selected_lost.get('location')}')"
                )

            if apply_penalty and img_sim < min_img_sim:
                penalty_factor = (img_sim / max(min_img_sim, 1e-4)) ** 2
                score = score * penalty_factor

            if enable_visual_gate and img_sim < min_img_sim:
                rejection_reasons.append(f"Độ tương đồng ảnh thấp ({img_sim:.3f} < {min_img_sim:.2f})")

            item_res = (
                score,
                img_sim,
                color_sim,
                txt_sim,
                cross_sim,
                loc_sim,
                delta_days,
                f_item,
                rejection_reasons,
            )

            if rejection_reasons:
                rejected_results.append(item_res)
            else:
                qualified_results.append(item_res)

        qualified_results.sort(key=lambda x: x[0], reverse=True)
        rejected_results.sort(key=lambda x: x[1], reverse=True)

        final_display = [r for r in qualified_results if r[0] >= min_score][: int(top_k)]

        with col2:
            st.markdown(
                f"### 📋 Kết quả Top phù hợp "
                f"(Đạt chuẩn: {len(final_display)}/{len(db['found'])} vật nhặt được)"
            )
            if not final_display:
                st.warning(
                    f"⚠️ **Không có vật phẩm nào vượt qua toàn bộ bộ lọc.**\n\n"
                    "Gợi ý: Kiểm tra ngưỡng ảnh (`min_img_sim`), tắt bộ lọc địa điểm cứng hoặc nới lỏng các ràng buộc ở cột bên trái."
                )

            for rank, (
                score,
                img_sim,
                color_sim,
                txt_sim,
                cross_sim,
                loc_sim,
                delta_days,
                f_item,
                _,
            ) in enumerate(final_display, start=1):
                with st.container(border=True):
                    c1, c2 = st.columns([1, 2])
                    with c1:
                        st.image(f_item["image_path"], width=160)
                        if f_item.get("yolo_label"):
                            c_stat = "Đã cắt" if f_item.get("was_cropped") else "Toàn ảnh"
                            st.caption(f"🎯 YOLO: **{f_item['yolo_label']}** ({c_stat})")
                    with c2:
                        st.markdown(f"### #{rank} — Điểm tương thích: `{score:.3f}`")
                        st.progress(min(max(score, 0.0), 1.0))

                        txt_label = f"`{txt_sim:.3f}`" if txt_sim is not None else "*Tự thích ứng (thiếu text)*"
                        loc_label = f"`{loc_sim:.3f}`" if loc_sim is not None else "*Tự thích ứng (thiếu vị trí)*"
                        cross_str = f" | 🔄 **Chéo:** `{cross_sim:.3f}`" if cross_sim is not None else ""

                        st.markdown(
                            f"🖼️ **Ảnh (CLIP):** `{img_sim:.3f}` &nbsp;|&nbsp; "
                            f"🎨 **Màu:** `{color_sim:.3f}` &nbsp;|&nbsp; "
                            f"📝 **Chữ:** {txt_label}\n\n"
                            f"📍 **Vị trí:** {loc_label} &nbsp;|&nbsp; "
                            f"📅 **Thời gian:** `{f_item.get('date', 'N/A')}` ({delta_days:+d} ngày so với ngày mất){cross_str}"
                        )

                        if img_sim >= 0.85 and color_sim >= 0.80:
                            st.success("🌟 **Khớp đặc biệt cao cả về ngoại quan, chi tiết và màu sắc!**")
                        elif img_sim >= min_img_sim:
                            st.info(f"🟢 **Hình ảnh đạt ngưỡng tương đồng (≥ {min_img_sim:.2f}).**")

                        if color_sim < 0.50 and w_color > 0:
                            st.warning("⚠️ **Lưu ý:** Màu sắc có sự khác biệt rõ rệt.")

                        st.write(f"**Tên:** {f_item['name']}")
                        st.write(f"**Mô tả:** {f_item['desc'] if f_item['desc'] else '*(Trống)*'}")
                        st.write(f"**Địa điểm nhặt:** 📍 {f_item['location']}")
                        st.write(f"**Liên hệ:** 📞 {f_item['contact']}")

            if rejected_results:
                with st.expander(f"🚫 Xem danh sách {len(rejected_results)} vật phẩm bị LOẠI BỎ bởi Bộ lọc Gating"):
                    st.caption(
                        "Các vật phẩm dưới đây bị loại do vi phạm một trong các ràng buộc (Ảnh không đạt ngưỡng, Lệch thời gian, hoặc Khác địa điểm):"
                    )
                    for (
                        r_score,
                        r_img_sim,
                        r_col_sim,
                        r_txt_sim,
                        _,
                        r_loc_sim,
                        _,
                        r_item,
                        reasons,
                    ) in rejected_results:
                        rc1, rc2 = st.columns([1, 4])
                        with rc1:
                            st.image(r_item["image_path"], width=90)
                        with rc2:
                            st.markdown(f"**{r_item['name']}** — Điểm ảnh: `{r_img_sim:.3f}`")
                            for r_reason in reasons:
                                st.markdown(f"- ❌ *Lý do loại:* {r_reason}")
                            st.caption(
                                f"Mô tả: {r_item['desc'] if r_item['desc'] else '*(Trống)*'} | Địa điểm: {r_item['location']} | Ngày: {r_item['date']}"
                            )

        st.divider()
        st.info(
            "💡 **Cơ chế hoạt động của Pipeline đề xuất:**\n"
            "1. **YOLOv8 Smart Object Crop:** Chỉ cắt khi phát hiện đúng đồ vật thuộc COCO (balo, túi, điện thoại); tự động bảo lưu toàn ảnh gốc khi gặp chìa khóa hoặc người cầm đồ để CLIP không bị mất chi tiết.\n"
            "2. **CLIP ViT-B/16:** Trích xuất đặc trưng không gian sâu với 196 patches (gấp 4 lần B/32), phân biệt chi tiết nhỏ hiệu quả.\n"
            "3. **Center HSV Color Histogram:** Giải quyết triệt để vấn đề mù màu và attribute binding của CLIP gốc.\n"
            "4. **Spatio-Temporal Constraints:** Ràng buộc nhân quả thời gian ($t_{found} \\ge t_{lost}$) và đối chiếu vị trí địa lý giúp loại trừ các ứng viên phi logic.\n"
            "5. **Dynamic Adaptive Weighting:** Không bao giờ phạt oan điểm khi dữ liệu thiếu mô tả văn bản hoặc địa điểm."
        )

# --- Sidebar: quản lý dữ liệu demo ---
st.sidebar.header("⚙️ Quản lý dữ liệu demo")
st.sidebar.write(f"Số báo mất: **{len(db['lost'])}**")
st.sidebar.write(f"Số báo nhặt được: **{len(db['found'])}**")
if st.sidebar.button("🗑️ Xoá toàn bộ dữ liệu demo"):
    db = {"lost": [], "found": [], "current_model": selected_model_name, "use_yolo": actual_use_yolo, "strict_lf_only": strict_lf_only}
    save_db(db)
    for f in os.listdir(IMAGES_DIR):
        os.remove(os.path.join(IMAGES_DIR, f))
    st.sidebar.success("Đã xoá dữ liệu.")
    st.rerun()
