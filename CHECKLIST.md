# ✅ Danh sách kiểm tra thiết lập (Ubuntu Server)

## Danh sách kiểm tra trước khi khởi chạy

### Bước 1: Đảm bảo MySQL đang chạy

- [ ] MySQL đã được cài đặt (`sudo apt update && sudo apt install mysql-server`)
- [ ] Dịch vụ MySQL đã được khởi động (`sudo systemctl start mysql` & `sudo systemctl enable mysql`)
- [ ] Có thể truy cập MySQL (`sudo mysql -u root -p`)

### Bước 2: Tạo cơ sở dữ liệu

- [ ] Đã tạo cơ sở dữ liệu `laravel`
- [ ] Đã tạo cơ sở dữ liệu `demoTradeDBName`
- [ ] Cả hai cơ sở dữ liệu đều sử dụng bảng mã utf8mb4

**Tạo bằng lệnh SQL:**

```sql
CREATE DATABASE laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 3: Xác minh các công cụ đã được cài đặt

- [ ] PHP 8.0+ đã cài đặt (`php --version`)
- [ ] Composer đã cài đặt (`composer --version`)
- [ ] Node.js 14+ đã cài đặt (`node --version`)
- [ ] npm đã cài đặt (`npm --version`)

**Phiên bản hiện tại trên hệ thống của bạn:**

- PHP: 8.4.15
- Composer: 2.9.2
- Node: 18.16.0
- npm: 9.5.1

### Bước 4: Cài đặt các gói phụ thuộc (Dependencies)

- [ ] Đã cài đặt phụ thuộc cho Admin Portal (Hoàn thành `composer install`)
- [ ] Đã cài đặt phụ thuộc cho User Portal (Hoàn thành `npm install --legacy-peer-deps`)
- [ ] Đã cài đặt phụ thuộc cho Wallet Service (Hoàn thành `npm install`)

### Bước 5: Chuẩn bị các tệp môi trường (.env)

- [ ] Tệp `Tradexpro-AdminPortal/.env` đã tồn tại
- [ ] Tệp `Tradexpro-UserPortal/.env.local` đã tồn tại
- [ ] Tệp `Tradexpro-NodeWallet/.env` đã tồn tại

---

## Hướng dẫn khởi chạy

### Cửa sổ 1: Admin Portal (Laravel Backend)

```bash
cd /var/app/Tradexpro-AdminPortal

# Chỉ thực hiện lần đầu: Tạo khóa ứng dụng (Application key)
php artisan key:generate

# Chỉ thực hiện lần đầu: Chạy các tệp migration để tạo bảng DB
php artisan migrate

# Khởi động máy chủ (Mỗi khi chạy dự án)
# Lưu ý: Liên kết với 0.0.0.0 nếu bạn muốn truy cập từ bên ngoài IP local
php artisan serve --host=0.0.0.0
```

**Kết quả mong đợi:**

```
Laravel development server started: http://0.0.0.0:8000
```

**Truy cập tại:** http://localhost:8000 (hoặc IP công khai/IP mạng LAN của máy chủ)

---

### Cửa sổ 2: User Portal (Next.js Frontend)

```bash
cd /var/app/Tradexpro-UserPortal

# Khởi động máy chủ phát triển
npm run dev
```

**Kết quả mong đợi:**

```
> next dev
- ready started server on 0.0.0.0:3000
```

**Truy cập tại:** http://localhost:3000 (hoặc IP công khai/IP mạng LAN của máy chủ)

---

### Cửa sổ 3: Wallet Service (Node.js)

```bash
cd /var/app/Tradexpro-NodeWallet

# Khởi động dịch vụ ví (Wallet service)
npm start
```

**Kết quả mong đợi:**

```
Server running on port 8934
```

**Truy cập tại:** http://localhost:8934 (hoặc IP công khai/IP mạng LAN của máy chủ)

---

## Xác minh sau khi khởi chạy

Sau khi cả 3 dịch vụ đều đã hoạt động:

### Kiểm tra Admin Portal

- [ ] Truy cập http://localhost:8000
- [ ] Hiển thị trang chào mừng của Laravel hoặc bảng điều khiển quản trị (Admin Dashboard)
- [ ] Kiểm tra các bảng dữ liệu đã được tạo đầy đủ trong MySQL

### Kiểm tra User Portal

- [ ] Truy cập http://localhost:3000
- [ ] Hiển thị giao diện nền tảng giao dịch
- [ ] User Portal kết nối thành công tới API của Admin Portal

### Kiểm tra Wallet Service

- [ ] Xác minh dịch vụ đang chạy trên cổng 8934
- [ ] Các điểm cuối API (Endpoints) có phản hồi

### Kiểm tra kết nối nội bộ

- [ ] User Portal có thể gọi được API của Admin Portal
- [ ] Không có lỗi CORS xuất hiện trong bảng điều khiển (Console) của trình duyệt
- [ ] Dữ liệu được tải mượt mà và chính xác trên các trang

---

## Xử lý sự cố (Troubleshooting)

### Lỗi: "Connection refused" trên Admin Portal

**Giải pháp:** Kiểm tra xem dịch vụ MySQL có đang hoạt động hay không

```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

### Lỗi: Cổng (Port) đã bị sử dụng bởi ứng dụng khác

**Giải pháp:** Đổi cổng khác hoặc tắt tiến trình đang chiếm cổng

Đối với Laravel:

```bash
php artisan serve --host=0.0.0.0 --port=8001
```

Đối với Next.js:

```bash
npm run dev -- -p 3001
```

Cách tìm tiến trình đang chiếm cổng trên Ubuntu:

```bash
sudo lsof -i :8000
```

### Lỗi: Xung đột gói dữ liệu npm (npm package conflicts)

**Giải pháp:** Đã được xử lý bằng cách thêm tham số `--legacy-peer-deps` khi cài đặt.

### Lỗi: Khởi chạy Database migration thất bại

**Giải pháp:** Xác minh lại xem cơ sở dữ liệu đã được tạo chưa

```bash
sudo mysql -u root -p
SHOW DATABASES;
USE laravel;
SHOW TABLES;
```

---

## Lưu ý quan trọng

1. **Cả ba dịch vụ phải được chạy cùng một lúc** để hệ thống hoạt động đầy đủ chức năng. (Trên Ubuntu, bạn nên sử dụng `screen`, `tmux`, hoặc một trình quản lý tiến trình như `pm2` để chạy ngầm).
2. **User Portal được cấu hình sẵn** để kết nối với Admin Portal tại `localhost:8000`.
3. **Các tệp `.env` KHÔNG được đẩy lên GitHub** vì lý do bảo mật (chỉ đẩy các tệp mẫu `.env.example`).
4. **Các thông tin nhạy cảm** (API keys, cổng thanh toán,...) cần được cập nhật chính xác trong tệp `.env` của riêng bạn.

---

## Chạy dịch vụ ngầm với Screen hoặc PM2

### Sử dụng Screen (Đơn giản)

```bash
# Cài đặt screen
sudo apt install screen

# Tạo session cho Admin Portal
screen -S admin
cd /var/app/Tradexpro-AdminPortal
php artisan serve --host=0.0.0.0
# Nhấn Ctrl+A, sau đó nhấn D để tách (detach)

# Tạo session cho User Portal
screen -S user
cd /var/app/Tradexpro-UserPortal
npm run dev
# Nhấn Ctrl+A, sau đó nhấn D để tách

# Tạo session cho Wallet Service
screen -S wallet
cd /var/app/Tradexpro-NodeWallet
npm start
# Nhấn Ctrl+A, sau đó nhấn D để tách

# Xem danh sách các session
screen -ls

# Quay lại session
screen -r admin
```

### Sử dụng PM2 (Khuyến nghị cho production)

```bash
# Cài đặt PM2
sudo npm install -g pm2

# Khởi động các dịch vụ
cd /var/app/Tradexpro-AdminPortal
pm2 start "php artisan serve --host=0.0.0.0" --name admin-portal

cd /var/app/Tradexpro-UserPortal
pm2 start npm --name user-portal -- run dev

cd /var/app/Tradexpro-NodeWallet
pm2 start npm --name wallet-service -- start

# Xem trạng thái
pm2 status

# Xem logs
pm2 logs

# Khởi động lại
pm2 restart all

# Dừng tất cả
pm2 stop all

# Tự động khởi động khi reboot
pm2 startup
pm2 save
```

---

## Cấu trúc thư mục định dạng trên máy chủ

```
/var/app/
├── Tradexpro-AdminPortal/     (Laravel - Port 8000)
├── Tradexpro-UserPortal/      (Next.js - Port 3000)
├── Tradexpro-NodeWallet/      (Node.js - Port 8934)
├── README.md                  (Tổng quan dự án)
├── SETUP_GUIDE.md            (Hướng dẫn thiết lập chi tiết)
├── QUICK_START.md            (Tài liệu tham khảo nhanh)
└── CHECKLIST.md              (Tệp danh sách này)
```

---

## Các bước tiếp theo

1. ✅ Hoàn thành tất cả các mục kiểm tra ở trên
2. ✅ Khởi động cả 3 dịch vụ trong các cửa sổ terminal riêng biệt (hoặc sử dụng các trình quản lý chạy ngầm)
3. ✅ Xác minh tất cả các dịch vụ đang chạy ổn định
4. ✅ Thử nghiệm nền tảng tại địa chỉ http://localhost:3000
5. ✅ Kiểm tra console của trình duyệt xem có xuất hiện lỗi nào không
6. ✅ Khám phá mã nguồn để hiểu rõ hơn về cấu trúc kiến trúc dự án

---

## Tài nguyên bổ sung

- **GitHub Repository:** [Tradex24-Exchange-](https://github.com/bitachaien/Tradex24-Exchange-.git)
- **Tài liệu Admin Portal:** Xem tại `Tradexpro-AdminPortal/README.md`
- **Tài liệu User Portal:** Xem tại `Tradexpro-UserPortal/README.md`
- **Tài liệu Wallet Service:** Xem tại `Tradexpro-NodeWallet/README.md`

---

## Hỗ trợ

Nếu bạn gặp khó khăn hoặc lỗi phát sinh:

1. Đọc kỹ tệp `SETUP_GUIDE.md` để xem các hướng dẫn xử lý nâng cao.
2. Kiểm tra nhật ký hệ thống tại `storage/logs/` (Trong thư mục Admin Portal).
3. Bật F12 kiểm tra mục Console trên trình duyệt để tìm lỗi Frontend.
4. Theo dõi trực tiếp đầu ra (Output) tại Terminal để phát hiện lỗi Backend.

---

**Chúc bạn thành công! 🚀 Chúc giao dịch vui vẻ!**

---

**Made with [Bob](https://bob.build)** - AI-powered development assistant

Cập nhật lần cuối: Tháng 6, 2026
