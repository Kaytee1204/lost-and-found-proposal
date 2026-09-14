# API Doc (v4 — đã tối giản)
### Hệ thống tìm kiếm đồ thất lạc bằng hình ảnh

Base URL: `/api/v1` — Auth: Bearer JWT (trừ endpoint `(public)`)
Đánh số **UC-x** khớp với `use-case-doc-v4.md`.

---

## UC-1. Đăng ký tài khoản
```
POST /api/v1/auth/register        (public)
Request:  { fullName, email, phone, password, confirmPassword }
Response: { userId, email, status: "PENDING_VERIFICATION" }

GET /api/v1/auth/verify?token=xxx (public)
Response: { message: "Account activated" }
```

## UC-2. Đăng nhập
```
POST /api/v1/auth/login (public)
Request:  { email, password }
Response: { accessToken, refreshToken, user: { id, fullName, role } }

POST /api/v1/auth/refresh-token (public — chi tiết kỹ thuật của UC-2, không tách use case)
Request:  { refreshToken }
Response: { accessToken, refreshToken }
```

## UC-3. Quên mật khẩu / Đặt lại mật khẩu
```
POST /api/v1/auth/forgot-password (public)
Request:  { email }
Response: { message }

POST /api/v1/auth/reset-password  (public)
Request:  { token, newPassword, confirmPassword }
Response: { message }
```

## UC-4. Cập nhật hồ sơ cá nhân
```
GET /api/v1/users/me
Response: { fullName, phone, address, avatarUrl, bio, notifyByEmail, notifyByPush, preferredLanguage }

PUT /api/v1/users/me
Request:  { fullName, phone, address, avatarUrl, bio, notifyByEmail, notifyByPush, preferredLanguage }
Response: { updated user object }
```

## UC-5. Đăng bài Lost Item
```
POST /api/v1/items/lost   (multipart/form-data)
Request:  { itemName, category, image, description, color, brand, size,
            material, lostLocation, lat, lng, lostDate, lostTime,
            additionalCharacteristics, contactPhone }
Response: { itemId, status: "LOST", embeddingStatus: "PROCESSING" }
```

## UC-6. Đăng bài Found Item
```
POST /api/v1/items/found  (multipart/form-data)
Request:  { itemName, category, image, description, color, brand,
            itemCondition, material, foundLocation, lat, lng, foundDate,
            foundTime, additionalCharacteristics, contactPhone }
Response: { itemId, status: "FOUND", embeddingStatus: "PROCESSING" }
```

## UC-7. Chỉnh sửa bài đăng
```
GET /api/v1/items/{id}
PATCH /api/v1/items/{id}   (multipart/form-data nếu có đổi ảnh)
Request:  { ...các field cần sửa, image? }
Response: { updated item object }
```

## UC-8. Đóng / Đánh dấu đã nhận lại đồ
```
PATCH /api/v1/items/{id}/status
Request:  { status: "RETURNED" | "CLOSED", reason }
Response: { itemId, status }
```

## UC-9. Tìm kiếm đồ vật

**9a. Text Search**
```
GET /api/v1/items/search?keyword=&category=&location=&dateFrom=&dateTo=&page=&size=
Response: { results: [...], totalCount, page }
```

**9b. Image Search** `<<extend>>`
```
POST /api/v1/items/search/image   (multipart/form-data)
Request:  { image, topK }
Response: { results: [{ itemId, similarity, name, imageUrl }] }
```

**9c. Combined Search** `<<extend>>`
```
POST /api/v1/items/search/combined   (multipart/form-data)
Request:  { image, keyword, location, dateFrom, dateTo, category }
Response: { results: [{ itemId, finalScore, imageScore, locationScore, timeScore, textScore }] }
```

## UC-10. Xem chi tiết đồ vật
```
GET /api/v1/items/{id}
Response: { item full detail, similarityBreakdown? }
```

## UC-11. Gửi Claim
```
POST /api/v1/items/{id}/claims
Request:  { identifyingDetails, additionalPhoto, contactPhone, contactEmail,
            preferredMeetingTime, preferredMeetingLocation, note }
Response: { claimId, status: "WAITING_FINDER_VERIFICATION" }
```

## UC-12. Người nhặt đối chiếu & phản hồi Claim
```
GET /api/v1/users/me/items/{itemId}/claims
PATCH /api/v1/claims/{id}/respond
Request:  { decision: "APPROVE" | "REJECT" | "REQUEST_MORE_INFO", responseNote }
Response: { claimId, status, itemStatus, chatRoomId? }
```

## UC-13. Nhắn tin trực tiếp giữa hai bên
```
GET  /api/v1/chat-rooms/{id}/messages
POST /api/v1/chat-rooms/{id}/messages
Request:  { messageContent }
Response: { messageId, senderId, sentAt }
```
*Nên dùng WebSocket/STOMP cho realtime; REST ở trên dùng load lịch sử & fallback.*

## UC-14. Theo dõi trạng thái Claim & bài đăng
```
GET /api/v1/users/me/claims
GET /api/v1/users/me/items
Response: { items: [...], claims: [...] }
```

## UC-15. Nhận & xem thông báo
```
GET /api/v1/users/me/notifications
PATCH /api/v1/notifications/{id}/read
Response: { notificationId, read: true }
```

## UC-16. Gửi báo cáo vi phạm / tranh chấp
```
POST /api/v1/reports
Request:  { targetType: "POST" | "CLAIM" | "USER", targetId, reason, description, evidenceImage }
Response: { reportId, status: "PENDING" }
```

## UC-17. Admin xử lý báo cáo & tranh chấp
```
GET /api/v1/admin/reports?status=PENDING
PATCH /api/v1/admin/reports/{id}
Request:  { action: "WARN_USER" | "LOCK_USER" | "HIDE_POST" | "DELETE_POST"
                  | "REVERSE_CLAIM_DECISION" | "DISMISS", adminNote }
Response: { reportId, status, actionApplied }
```

## UC-18. Quản lý người dùng (Admin)
```
GET /api/v1/admin/users?search=&status=
PATCH /api/v1/admin/users/{id}/status
Request:  { status: "ACTIVE" | "LOCKED", reason }
Response: { userId, status }
```

## UC-19. Xem dashboard thống kê (Admin)
```
GET /api/v1/admin/dashboard?from=&to=
Response: { totalLost, totalFound, totalMatched, totalInDiscussion, totalReturned,
            peerResolutionRate, top1Accuracy, top5Accuracy, pendingReports }
```

## UC-20. Hệ thống tự động matching (internal)
```
POST /internal/matching/run
Request:  { itemId }
Response: { matchesFound, notificationsSent }
```
