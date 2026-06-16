# 🚀 HƯỚNG DẪN NHANH - Phát triển Local trên Ubuntu Server

## ✅ Thiết lập hoàn tất!

Cả ba module đã được cấu hình và sẵn sàng chạy trên môi trường Ubuntu tại `/var/app`.

---

## 📍 Ba cửa sổ Terminal - Một cho mỗi dịch vụ

### Cửa sổ 1️⃣: Admin Portal (Laravel)

```bash
cd /var/app/Tradexpro-AdminPortal
php artisan key:generate  # Chỉ lần đầu
php artisan migrate       # Chỉ lần đầu
php artisan serve --host=0.0.0.0
```

🌐 **http://localhost:8000** (hoặc IP máy chủ của bạn)

### Cửa sổ 2️⃣: User Portal (Next.js)

```bash
cd /var/app/Tradexpro-UserPortal
npm run dev
```

🌐 **http://localhost:3000** (hoặc IP máy chủ của bạn)

### Cửa sổ 3️⃣: Wallet Service (Node.js)

```bash
cd /var/app/Tradexpro-NodeWallet
npm start
```

🌐 **http://localhost:8934** (hoặc IP máy chủ của bạn)

---

## 📋 Yêu cầu trước khi chạy

### 1. MySQL Database (Bắt buộc)

```bash
# Kiểm tra MySQL đang chạy
sudo systemctl status mysql

# Nếu chưa chạy, khởi động nó
sudo systemctl start mysql
sudo systemctl enable mysql

# Tạo cơ sở dữ liệu
sudo mysql -u root -p << EOF
CREATE DATABASE laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
```

---

## 📦 Trạng thái cài đặt

| Module                       | Dependencies                   | Trạng thái  |
| ---------------------------- | ------------------------------ | ----------- |
| **Admin Portal** (Laravel)   | composer install               | ✅ Sẵn sàng |
| **User Portal** (Next.js)    | npm install --legacy-peer-deps | ✅ Sẵn sàng |
| **Wallet Service** (Node.js) | npm install                    | ✅ Sẵn sàng |

---

## 🔑 Các tệp môi trường đã được cấu hình

✅ `Tradexpro-AdminPortal/.env` - Đã tạo & sẵn sàng cho thiết lập DB
✅ `Tradexpro-UserPortal/.env.local` - Đã cấu hình cho localhost (port 3000)
✅ `Tradexpro-NodeWallet/.env` - Đã cấu hình (port 8934)

---

## 🎯 Truy cập cả ba ứng dụng

Sau khi chạy cả ba dịch vụ:

1. **Admin Portal**
   - URL: http://localhost:8000
   - Mục đích: Bảng điều khiển quản trị & REST API
   - Được sử dụng bởi: Frontend & Mobile apps

2. **User Portal**
   - URL: http://localhost:3000
   - Mục đích: Giao diện nền tảng giao dịch
   - Đã được cấu hình sẵn để kết nối với Admin Portal

3. **Wallet Service**
   - URL: http://localhost:8934
   - Mục đích: Các thao tác ví tiền điện tử
   - Dịch vụ blockchain độc lập

---

## 🔗 Cách chúng kết nối với nhau

```
User Portal (3000)
    ↓
Admin Portal API (8000/api)
    ↓
Database (MySQL)

Wallet Service (8934)
    ↓
Blockchain Networks
```

---

## 📄 Tài liệu

Để biết hướng dẫn thiết lập chi tiết, xem:

- **SETUP_GUIDE.md** - Hướng dẫn thiết lập và xử lý sự cố đầy đủ
- **README.md** - Tổng quan dự án và kiến trúc
- **CHECKLIST.md** - Danh sách kiểm tra chi tiết
- Các tệp README riêng của từng module

---

## ⚡ Danh sách kiểm tra thiết lập lần đầu

- [ ] Cơ sở dữ liệu MySQL đã được cài đặt và đang chạy
- [ ] Đã tạo cơ sở dữ liệu `laravel` và `demoTradeDBName`
- [ ] Terminal 1: `php artisan migrate` (Admin Portal)
- [ ] Terminal 2: `npm run dev` (User Portal)
- [ ] Terminal 3: `npm start` (Wallet Service)
- [ ] Truy cập http://localhost:3000 trong trình duyệt
- [ ] Kiểm tra đăng nhập/đăng ký
- [ ] Kiểm tra chức năng giao dịch

---

## 🔄 Chạy dịch vụ ngầm (Background Services)

### Sử dụng Screen (Đơn giản)

```bash
# Cài đặt screen
sudo apt install screen

# Admin Portal
screen -S admin
cd /var/app/Tradexpro-AdminPortal && php artisan serve --host=0.0.0.0
# Nhấn Ctrl+A, sau đó D để tách

# User Portal
screen -S user
cd /var/app/Tradexpro-UserPortal && npm run dev
# Nhấn Ctrl+A, sau đó D để tách

# Wallet Service
screen -S wallet
cd /var/app/Tradexpro-NodeWallet && npm start
# Nhấn Ctrl+A, sau đó D để tách

# Xem danh sách sessions
screen -ls

# Quay lại session
screen -r admin
```

### Sử dụng PM2 (Khuyến nghị)

```bash
# Cài đặt PM2 globally
sudo npm install -g pm2

# Khởi động các dịch vụ
pm2 start "php artisan serve --host=0.0.0.0" --name admin-portal --cwd /var/app/Tradexpro-AdminPortal
pm2 start npm --name user-portal --cwd /var/app/Tradexpro-UserPortal -- run dev
pm2 start npm --name wallet-service --cwd /var/app/Tradexpro-NodeWallet -- start

# Quản lý
pm2 status          # Xem trạng thái
pm2 logs            # Xem logs
pm2 restart all     # Khởi động lại tất cả
pm2 stop all        # Dừng tất cả

# Tự động khởi động khi reboot
pm2 startup
pm2 save
```

---

## 🆘 Xử lý sự cố

**Xung đột cổng?** Thay đổi cổng trong mỗi dịch vụ:

- Laravel: `php artisan serve --host=0.0.0.0 --port=8001`
- Next.js: `npm run dev -- -p 3001`
- Node: Thay đổi `APP_PORT` trong `.env`

**Vấn đề về cơ sở dữ liệu?** Kiểm tra MySQL:

```bash
sudo systemctl status mysql
sudo mysql -u root -p
SHOW DATABASES;
USE laravel;
SHOW TABLES;
```

**Vấn đề về dependencies?** Cài đặt lại:

```bash
npm install --legacy-peer-deps  # User Portal
composer install                # Admin Portal
npm install                     # Wallet Service
```

**Kiểm tra cổng đang được sử dụng:**

```bash
sudo lsof -i :8000  # Kiểm tra cổng 8000
sudo lsof -i :3000  # Kiểm tra cổng 3000
sudo lsof -i :8934  # Kiểm tra cổng 8934
```

**Vấn đề về quyền truy cập:**

```bash
# Đảm bảo quyền đúng cho thư mục storage và cache
cd /var/app/Tradexpro-AdminPortal
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache
```

---

## 🌐 Truy cập từ xa

Nếu bạn muốn truy cập từ máy khác trong mạng hoặc từ internet:

1. **Đảm bảo bind đúng địa chỉ:**
   - Laravel: `--host=0.0.0.0` (đã có trong hướng dẫn)
   - Next.js: Mặc định đã bind 0.0.0.0

2. **Mở firewall (nếu cần):**

```bash
sudo ufw allow 8000/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 8934/tcp
sudo ufw status
```

3. **Cập nhật file .env:**
   - Trong `Tradexpro-UserPortal/.env.local`, cập nhật `NEXT_PUBLIC_BASE_URL` với IP hoặc domain của bạn

---

## 🎉 Bạn đã sẵn sàng!

Nền tảng Tradex24 Exchange của bạn đã được cấu hình và sẵn sàng chạy trên Ubuntu.

**Các bước tiếp theo:**

1. Làm theo hướng dẫn thiết lập ở trên
2. Chạy cả ba dịch vụ
3. Truy cập http://localhost:3000 (hoặc IP máy chủ của bạn)
4. Bắt đầu giao dịch! 🚀

---

## 📚 Tài nguyên bổ sung

- **GitHub Repository:** [Tradex24-Exchange-](https://github.com/bitachaien/Tradex24-Exchange-.git)
- **SETUP_GUIDE.md** - Hướng dẫn chi tiết
- **CHECKLIST.md** - Danh sách kiểm tra đầy đủ
- **README.md** - Tổng quan dự án

---

**Chúc phát triển vui vẻ! 💻**

---

**Made with [Bob](https://bob.build)** - AI-powered development assistant

Cập nhật lần cuối: Tháng 6, 2026
