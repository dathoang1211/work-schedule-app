# WorkSchedule Pro 🗓️

Hệ thống quản lý lịch làm việc, chấm công và quản lý nhân viên.

## Tính năng chính

- **Lịch làm việc**: Xem tháng / tuần, xếp lịch tự động, xuất ảnh 4K, gửi email thông báo
- **Chấm công & Giải trình**: Theo dõi công, tạo giải trình, phê duyệt
- **Cấu hình ca**: Thêm/sửa/xóa ca làm việc (C1, T, O/NT, C2)
- **Hệ thống nhân viên**: Quản lý CRUD nhân viên

## Quy tắc xếp lịch

| Ngày | Ca bắt buộc |
|------|------------|
| Thứ 2 – Thứ 7 | 1 C1 + 1 T + 1 O/NT + còn lại C2 |
| Chủ nhật | 1 C2 + 1 T + 1 O/NT (chỉ 3 người) |
| Mục tiêu | 26 công/người/tháng |

---

## 🚀 Hướng dẫn triển khai lên GitHub Pages

### Bước 1: Tạo repository trên GitHub

1. Truy cập [github.com](https://github.com) → đăng nhập
2. Nhấn nút **"+"** → **"New repository"**
3. Điền thông tin:
   - **Repository name**: `work-schedule-app` (hoặc tên tùy chọn)
   - **Visibility**: Public *(bắt buộc để dùng GitHub Pages miễn phí)*
   - Bỏ chọn "Add README"
4. Nhấn **"Create repository"**

---

### Bước 2: Upload file lên GitHub

#### Cách A: Dùng giao diện web (đơn giản nhất)

1. Trong trang repository mới tạo, nhấn **"uploading an existing file"**
2. Kéo thả toàn bộ thư mục dự án vào hoặc nhấn **"choose your files"**
3. Upload các file:
   - `index.html`
   - `.github/workflows/deploy.yml`
   - `README.md`
4. Nhập commit message: `"Initial release"`
5. Nhấn **"Commit changes"**

> ⚠️ **Lưu ý**: GitHub web UI không hỗ trợ upload thư mục `.github`. Dùng Cách B hoặc tạo file trực tiếp trên web.

#### Cách B: Dùng Git (khuyến nghị)

```bash
# 1. Cài Git nếu chưa có: https://git-scm.com/downloads

# 2. Mở Terminal / CMD trong thư mục dự án
cd đường-dẫn-tới-thư-mục-schedule-app

# 3. Khởi tạo Git
git init
git add .
git commit -m "Initial release: WorkSchedule Pro"

# 4. Kết nối với GitHub (thay YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

### Bước 3: Bật GitHub Pages

1. Vào repository trên GitHub → tab **"Settings"**
2. Cuộn xuống mục **"Pages"** (thanh bên trái)
3. Trong **"Source"**, chọn:
   - **Deploy from a branch** → **Branch: `gh-pages`**
   
   *Hoặc nếu dùng GitHub Actions:*
   - Chọn **"GitHub Actions"**
4. Nhấn **"Save"**

#### Nếu dùng GitHub Actions (file `deploy.yml` đã có):
- GitHub sẽ tự động deploy mỗi khi bạn push code lên nhánh `main`
- Theo dõi tiến trình tại tab **"Actions"**
- Sau 2-3 phút, website sẽ sống tại:
  ```
  https://YOUR_USERNAME.github.io/REPO_NAME/
  ```

---

### Bước 4: Tạo file `.github/workflows/deploy.yml` trực tiếp trên GitHub

Nếu không upload được thư mục `.github`, làm thủ công:

1. Trong repository, nhấn **"Add file"** → **"Create new file"**
2. Trong ô tên file, gõ: `.github/workflows/deploy.yml`
3. Copy nội dung file `deploy.yml` vào
4. Nhấn **"Commit new file"**

---

### Bước 5: Kiểm tra deployment

1. Vào tab **"Actions"** trong repository
2. Tìm workflow **"Deploy to GitHub Pages"**
3. Chờ biểu tượng ✅ xanh xuất hiện (thường 1-3 phút)
4. Truy cập URL:
   ```
   https://YOUR_USERNAME.github.io/REPO_NAME/
   ```

---

## 🔧 Tùy chỉnh nâng cao

### Thêm tên miền riêng (Custom Domain)

1. Mua domain tại nhà cung cấp (ví dụ: GoDaddy, Namecheap, tenten.vn)
2. Vào **Settings → Pages → Custom domain**
3. Nhập tên miền: `schedule.company.vn`
4. Tạo file `CNAME` trong thư mục gốc với nội dung:
   ```
   schedule.company.vn
   ```
5. Cập nhật DNS tại nhà cung cấp domain:
   - Thêm CNAME record: `YOUR_USERNAME.github.io`

### Kết nối Backend (Email thực)

Để gửi email thực sự, tích hợp EmailJS:

1. Đăng ký tại [emailjs.com](https://www.emailjs.com) (miễn phí 200 email/tháng)
2. Thêm vào `<head>` của `index.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   ```
3. Khởi tạo trong JavaScript:
   ```javascript
   emailjs.init("YOUR_PUBLIC_KEY");
   emailjs.send("service_id", "template_id", { to_email: "...", message: "..." });
   ```

---

## 📁 Cấu trúc thư mục

```
schedule-app/
├── index.html              # App chính (standalone, không cần build)
├── README.md               # Hướng dẫn này
└── .github/
    └── workflows/
        └── deploy.yml      # Auto-deploy lên GitHub Pages
```

---

## ❓ Câu hỏi thường gặp

**Q: Tại sao cần repository Public?**
> GitHub Pages miễn phí chỉ hỗ trợ Public repo. Để dùng Private repo cần GitHub Pro ($4/tháng).

**Q: Mất bao lâu để website live?**
> Thường 2-5 phút sau lần deploy đầu. Các lần sau nhanh hơn (30-60 giây).

**Q: Dữ liệu có được lưu không?**
> Hiện tại dữ liệu lưu trong bộ nhớ trình duyệt (session). Mỗi lần tải lại trang sẽ reset. Để lưu lâu dài, cần tích hợp backend (Firebase, Supabase, hoặc Google Sheets API).

**Q: Có thể dùng trên điện thoại không?**
> Có, ứng dụng hỗ trợ responsive. Tuy nhiên giao diện tối ưu cho desktop/tablet.

---

## 📞 Hỗ trợ

Nếu gặp vấn đề khi triển khai, kiểm tra:
1. Tab **Actions** trong GitHub repository
2. Phần **Settings → Pages** đã bật chưa
3. Repository phải là **Public**
