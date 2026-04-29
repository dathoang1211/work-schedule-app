 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 28ac3fd66a6fb40351060cf530bba1de5b064088..db624db77c729ca7e6adbde73a9eabc8e70b8d64 100644
--- a/README.md
+++ b/README.md
@@ -1,181 +1,271 @@
-# WorkSchedule Pro 🗓️
+# APP QUẢN LÝ MƯỢN/TRẢ THUỐC & VTYT (React + Firebase, Single File JSX)
 
-Hệ thống quản lý lịch làm việc, chấm công và quản lý nhân viên.
+Tài liệu này hướng dẫn bạn dựng và deploy một **web app SPA** lên GitHub với kiến trúc đúng theo yêu cầu:
 
-## Tính năng chính
-
-- **Lịch làm việc**: Xem tháng / tuần, xếp lịch tự động, xuất ảnh 4K, gửi email thông báo
-- **Chấm công & Giải trình**: Theo dõi công, tạo giải trình, phê duyệt
-- **Cấu hình ca**: Thêm/sửa/xóa ca làm việc (C1, T, O/NT, C2)
-- **Hệ thống nhân viên**: Quản lý CRUD nhân viên
-
-## Quy tắc xếp lịch
-
-| Ngày | Ca bắt buộc |
-|------|------------|
-| Thứ 2 – Thứ 7 | 1 C1 + 1 T + 1 O/NT + còn lại C2 |
-| Chủ nhật | 1 C2 + 1 T + 1 O/NT (chỉ 3 người) |
-| Mục tiêu | 26 công/người/tháng |
+- Frontend: React.js + Tailwind CSS + Lucide React
+- Backend: Firebase (Authentication, Firestore, Storage)
+- Toàn bộ logic/UI/style nằm trong **một file duy nhất `App.jsx`**
 
 ---
 
-## 🚀 Hướng dẫn triển khai lên GitHub Pages
+## 1) Cấu trúc repository trên GitHub
 
-### Bước 1: Tạo repository trên GitHub
+```text
+hospital-borrow-return-app/
+├── index.html
+├── App.jsx                     # Toàn bộ mã nguồn SPA (duy nhất)
+├── README.md
+└── .github/
+    └── workflows/
+        └── deploy.yml
+```
 
-1. Truy cập [github.com](https://github.com) → đăng nhập
-2. Nhấn nút **"+"** → **"New repository"**
-3. Điền thông tin:
-   - **Repository name**: `work-schedule-app` (hoặc tên tùy chọn)
-   - **Visibility**: Public *(bắt buộc để dùng GitHub Pages miễn phí)*
-   - Bỏ chọn "Add README"
-4. Nhấn **"Create repository"**
+> Ghi chú: `index.html` chỉ làm bootstrap để load React + Babel + Tailwind CDN và import `App.jsx`.
 
 ---
 
-### Bước 2: Upload file lên GitHub
-
-#### Cách A: Dùng giao diện web (đơn giản nhất)
-
-1. Trong trang repository mới tạo, nhấn **"uploading an existing file"**
-2. Kéo thả toàn bộ thư mục dự án vào hoặc nhấn **"choose your files"**
-3. Upload các file:
-   - `index.html`
-   - `.github/workflows/deploy.yml`
-   - `README.md`
-4. Nhập commit message: `"Initial release"`
-5. Nhấn **"Commit changes"**
-
-> ⚠️ **Lưu ý**: GitHub web UI không hỗ trợ upload thư mục `.github`. Dùng Cách B hoặc tạo file trực tiếp trên web.
-
-#### Cách B: Dùng Git (khuyến nghị)
+## 2) Tạo repository và đẩy code lên GitHub
 
 ```bash
-# 1. Cài Git nếu chưa có: https://git-scm.com/downloads
-
-# 2. Mở Terminal / CMD trong thư mục dự án
-cd đường-dẫn-tới-thư-mục-schedule-app
-
-# 3. Khởi tạo Git
 git init
 git add .
-git commit -m "Initial release: WorkSchedule Pro"
-
-# 4. Kết nối với GitHub (thay YOUR_USERNAME và REPO_NAME)
-git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
+git commit -m "chore: initialize medical borrow/return app scaffold"
 git branch -M main
+git remote add origin https://github.com/<your-username>/<repo-name>.git
 git push -u origin main
 ```
 
 ---
 
-### Bước 3: Bật GitHub Pages
-
-1. Vào repository trên GitHub → tab **"Settings"**
-2. Cuộn xuống mục **"Pages"** (thanh bên trái)
-3. Trong **"Source"**, chọn:
-   - **Deploy from a branch** → **Branch: `gh-pages`**
-   
-   *Hoặc nếu dùng GitHub Actions:*
-   - Chọn **"GitHub Actions"**
-4. Nhấn **"Save"**
-
-#### Nếu dùng GitHub Actions (file `deploy.yml` đã có):
-- GitHub sẽ tự động deploy mỗi khi bạn push code lên nhánh `main`
-- Theo dõi tiến trình tại tab **"Actions"**
-- Sau 2-3 phút, website sẽ sống tại:
-  ```
-  https://YOUR_USERNAME.github.io/REPO_NAME/
-  ```
+## 3) File `index.html` mẫu (để chạy `App.jsx` trực tiếp)
+
+Dùng `Babel Standalone` để chạy JSX không cần build tool:
+
+```html
+<!doctype html>
+<html lang="vi">
+  <head>
+    <meta charset="UTF-8" />
+    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+    <title>Quản lý mượn/trả thuốc & VTYT</title>
+
+    <script src="https://cdn.tailwindcss.com"></script>
+    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
+    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
+    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
+  </head>
+  <body class="bg-blue-50">
+    <div id="root"></div>
+    <script type="text/babel" data-type="module" src="./App.jsx"></script>
+  </body>
+</html>
+```
+
+---
+
+## 4) Cấu trúc `App.jsx` (single-file architecture)
+
+Trong `App.jsx`, tổ chức theo khối sau để dễ bảo trì nhưng vẫn một file:
+
+1. **Imports CDN global** (React hooks, Firebase modules qua `window` hoặc `import` dạng URL).
+2. **Config constants**
+   - `APP_ID`
+   - Firebase config
+   - Collection path gốc: `/artifacts/${APP_ID}/public/data/`
+3. **Utility functions**
+   - Chuẩn hóa tên thuốc theo Thông tư 26/2025/TT-BYT
+   - Sắp xếp thuốc độc trước, còn lại ABC
+   - Format số lượng (`02`, `09`...)
+   - Đổi số ra chữ cho thuốc gây nghiện
+4. **Firebase init + auth**
+   - `signInAnonymously` hoặc `signInWithCustomToken`
+5. **Data services**
+   - Users
+   - Orders (phiếu mượn)
+   - Return logs (timeline trả nhiều lần)
+6. **UI components trong cùng file**
+   - `RegisterForm`
+   - `BorrowForm`
+   - `OrderDetail`
+   - `ReturnScanner`
+   - `Dashboard`
+   - `PrintLayouts` (A4/A5/K80)
+7. **Main App router state**
+   - điều hướng theo state (`screen = 'dashboard' | 'borrow' | 'return'`)
 
 ---
 
-### Bước 4: Tạo file `.github/workflows/deploy.yml` trực tiếp trên GitHub
+## 5) Mô hình dữ liệu Firestore đề xuất
+
+### `users`
+```json
+{
+  "fullName": "Nguyễn Văn A",
+  "employeeId": "MSNV001",
+  "phone": "09xxxxxxxx",
+  "email": "a@hospital.vn",
+  "department": "Khoa Nội",
+  "pinCode": "1234",
+  "signatureUrl": "https://...",
+  "createdAt": "serverTimestamp"
+}
+```
+
+### `orders`
+```json
+{
+  "orderID": "BR-20260425-0001",
+  "borrowerUserId": "uid",
+  "status": "CHO_DUYET",
+  "items": [
+    {
+      "name": "Paracetamol (Hapacol) 500mg",
+      "isControlled": false,
+      "isPoison": false,
+      "quantityBorrowed": 20,
+      "quantityReturned": 0,
+      "quantityRemaining": 20
+    }
+  ],
+  "history": [],
+  "createdAt": "serverTimestamp",
+  "approvedAt": null,
+  "completedAt": null,
+  "dueAt": "createdAt + 48h"
+}
+```
 
-Nếu không upload được thư mục `.github`, làm thủ công:
+### `orders/{orderId}/returns`
+```json
+{
+  "returnAt": "serverTimestamp",
+  "returnBy": "uid",
+  "returnItems": [{ "itemKey": "...", "quantity": 5 }],
+  "proofImageUrls": ["https://..."],
+  "note": "Trả đợt 1"
+}
+```
 
-1. Trong repository, nhấn **"Add file"** → **"Create new file"**
-2. Trong ô tên file, gõ: `.github/workflows/deploy.yml`
-3. Copy nội dung file `deploy.yml` vào
-4. Nhấn **"Commit new file"**
+> Tất cả dữ liệu public dùng chung đặt dưới prefix: `/artifacts/${APP_ID}/public/data/`.
 
 ---
 
-### Bước 5: Kiểm tra deployment
+## 6) Quy tắc nghiệp vụ bắt buộc
 
-1. Vào tab **"Actions"** trong repository
-2. Tìm workflow **"Deploy to GitHub Pages"**
-3. Chờ biểu tượng ✅ xanh xuất hiện (thường 1-3 phút)
-4. Truy cập URL:
-   ```
-   https://YOUR_USERNAME.github.io/REPO_NAME/
-   ```
+### A. Kê đơn theo Thông tư 26/2025/TT-BYT
+- Thuốc 1 hoạt chất: `Tên hoạt chất (Tên thương mại) Hàm lượng`
+- Thuốc đa hoạt chất: dùng `Tên thương mại`
+- Danh sách: thuốc độc lên đầu, phần còn lại sort ABC
+- Số lượng `<10` thêm số `0` phía trước
+- Thuốc gây nghiện hiển thị cả số và chữ, ví dụ: `02 (không hai)`
 
----
+### B. Luồng mượn + in
+- In phiếu có logo bệnh viện, thông tin người mượn + SĐT, chữ ký điện tử, QR lớn cuối trang
+- Khi dược sĩ duyệt: cho phép tải ảnh/PDF và gửi email tự động
 
-## 🔧 Tùy chỉnh nâng cao
+### C. Luồng trả + quét mã
+- Quét QR để mở hồ sơ phiếu gốc
+- Trả nhiều lần, mỗi lần nhập SL trả thực tế + ảnh bằng chứng
+- Tự tính SL còn nợ sau mỗi đợt
+- In phiếu xác nhận hoàn trả từng đợt (giờ/phút/giây + ngày)
 
-### Thêm tên miền riêng (Custom Domain)
+### D. Dashboard
+- Quá hạn tự động khi quá 48 giờ chưa hoàn tất
+- Hiển thị khoa đang nợ + số ngày quá hạn
+- Nút thao tác: xem timeline, gửi email nhắc nợ, gọi trực tiếp qua SĐT
 
-1. Mua domain tại nhà cung cấp (ví dụ: GoDaddy, Namecheap, tenten.vn)
-2. Vào **Settings → Pages → Custom domain**
-3. Nhập tên miền: `schedule.company.vn`
-4. Tạo file `CNAME` trong thư mục gốc với nội dung:
-   ```
-   schedule.company.vn
-   ```
-5. Cập nhật DNS tại nhà cung cấp domain:
-   - Thêm CNAME record: `YOUR_USERNAME.github.io`
+---
 
-### Kết nối Backend (Email thực)
+## 7) Firebase rules & query strategy (để tránh lỗi index)
 
-Để gửi email thực sự, tích hợp EmailJS:
+- Chỉ dùng truy vấn đơn giản, ưu tiên:
+  - lấy theo document ID
+  - hoặc `where` một điều kiện đơn giản
+- Tránh query tổ hợp nhiều `where` + `orderBy`
+- Dùng trường dẫn xuất (`status`, `dueAt`, `department`) để lọc tại client khi cần
 
-1. Đăng ký tại [emailjs.com](https://www.emailjs.com) (miễn phí 200 email/tháng)
-2. Thêm vào `<head>` của `index.html`:
-   ```html
-   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
-   ```
-3. Khởi tạo trong JavaScript:
-   ```javascript
-   emailjs.init("YOUR_PUBLIC_KEY");
-   emailjs.send("service_id", "template_id", { to_email: "...", message: "..." });
-   ```
+Ví dụ chiến lược:
+1. Lấy danh sách `orders` gần đây (query đơn giản)
+2. Tính trạng thái quá hạn ở client theo `dueAt`
+3. Lọc nhóm theo khoa ngay trong React state
 
 ---
 
-## 📁 Cấu trúc thư mục
+## 8) Mobile-first UI/UX
 
-```
-schedule-app/
-├── index.html              # App chính (standalone, không cần build)
-├── README.md               # Hướng dẫn này
-└── .github/
-    └── workflows/
-        └── deploy.yml      # Auto-deploy lên GitHub Pages
-```
+- Tông màu y tế: xanh dương/trắng, độ tương phản cao
+- Nút thao tác lớn cho thao tác tại quầy quét QR
+- Layout responsive ưu tiên mobile/tablet trước, desktop mở rộng sau
+- Tối ưu in bằng CSS `@media print` cho A4, A5, K80
 
 ---
 
-## ❓ Câu hỏi thường gặp
+## 9) Triển khai GitHub Pages tự động
+
+Tạo `.github/workflows/deploy.yml`:
+
+```yaml
+name: Deploy to GitHub Pages
+
+on:
+  push:
+    branches: ["main"]
+  workflow_dispatch:
+
+permissions:
+  contents: read
+  pages: write
+  id-token: write
+
+concurrency:
+  group: "pages"
+  cancel-in-progress: true
+
+jobs:
+  deploy:
+    environment:
+      name: github-pages
+      url: ${{ steps.deployment.outputs.page_url }}
+    runs-on: ubuntu-latest
+    steps:
+      - uses: actions/checkout@v4
+      - uses: actions/configure-pages@v5
+      - uses: actions/upload-pages-artifact@v3
+        with:
+          path: .
+      - id: deployment
+        uses: actions/deploy-pages@v4
+```
 
-**Q: Tại sao cần repository Public?**
-> GitHub Pages miễn phí chỉ hỗ trợ Public repo. Để dùng Private repo cần GitHub Pro ($4/tháng).
+Sau khi push:
+1. Vào **Settings → Pages**
+2. Chọn source là **GitHub Actions**
+3. Truy cập URL: `https://<username>.github.io/<repo-name>/`
 
-**Q: Mất bao lâu để website live?**
-> Thường 2-5 phút sau lần deploy đầu. Các lần sau nhanh hơn (30-60 giây).
+---
 
-**Q: Dữ liệu có được lưu không?**
-> Hiện tại dữ liệu lưu trong bộ nhớ trình duyệt (session). Mỗi lần tải lại trang sẽ reset. Để lưu lâu dài, cần tích hợp backend (Firebase, Supabase, hoặc Google Sheets API).
+## 10) Checklist hoàn thiện
 
-**Q: Có thể dùng trên điện thoại không?**
-> Có, ứng dụng hỗ trợ responsive. Tuy nhiên giao diện tối ưu cho desktop/tablet.
+- [ ] Đăng ký user: đủ họ tên, MSNV, SĐT bắt buộc, email, khoa/phòng, PIN 4–6 số, chữ ký
+- [ ] Tạo phiếu mượn với `orderID`, `status`, `items`, `history`
+- [ ] Duyệt phiếu + gửi email + xuất PDF/ảnh
+- [ ] Quét QR mở phiếu gốc
+- [ ] Trả nhiều lần + ảnh bằng chứng + phiếu xác nhận từng lần
+- [ ] Auto quá hạn sau 48h
+- [ ] Dashboard cảnh báo nợ và thao tác gọi/nhắc nợ
+- [ ] Tuân thủ đường dẫn dữ liệu Firebase `/artifacts/${APP_ID}/public/data/`
+- [ ] Giữ toàn bộ app trong một file `App.jsx`
 
 ---
 
-## 📞 Hỗ trợ
+## 11) Lộ trình phát triển gợi ý
+
+- **Phase 1**: Xác thực + quản lý user + tạo phiếu mượn cơ bản
+- **Phase 2**: Duyệt phiếu + QR + in mẫu chuẩn
+- **Phase 3**: Trả nhiều lần + ảnh chứng cứ + timeline
+- **Phase 4**: Dashboard quá hạn + email nhắc nợ + gọi nhanh
+- **Phase 5**: Hoàn thiện UX mobile + tối ưu hiệu năng
+
+---
 
-Nếu gặp vấn đề khi triển khai, kiểm tra:
-1. Tab **Actions** trong GitHub repository
-2. Phần **Settings → Pages** đã bật chưa
-3. Repository phải là **Public**
+Nếu bạn muốn, bước tiếp theo mình có thể tạo luôn **`index.html` + `App.jsx` mẫu chạy được ngay** theo đúng kiến trúc single-file để bạn chỉ việc dán Firebase config và dùng.
 
EOF
)
