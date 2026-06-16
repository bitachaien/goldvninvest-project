# Tradex24 Exchange - Hướng dẫn thiết lập phát triển Local trên Ubuntu Server

Hướng dẫn thiết lập đầy đủ để chạy cả ba module trên máy Ubuntu tại `/var/app`.

## ✅ Các công cụ đã được cài đặt

- PHP 8.4.15 ✓
- Composer 2.9.2 ✓
- Node.js 18.16.0 ✓
- npm 9.5.1 ✓

## 📋 Yêu cầu trước khi chạy

### 1. **Cơ sở dữ liệu MySQL** (Bắt buộc cho Admin Portal)

Cài đặt MySQL nếu chưa có:

```bash
# Cập nhật package list
sudo apt update

# Cài đặt MySQL Server
sudo apt install mysql-server -y

# Khởi động và kích hoạt MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Kiểm tra trạng thái
sudo systemctl status mysql

# Bảo mật MySQL (khuyến nghị)
sudo mysql_secure_installation
```

### 2. **Tạo cơ sở dữ liệu**

```bash
# Đăng nhập vào MySQL
sudo mysql -u root -p

# Trong MySQL console, tạo cơ sở dữ liệu:
CREATE DATABASE laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Tạo user MySQL (tùy chọn, khuyến nghị cho production)
CREATE USER 'tradex_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON laravel.* TO 'tradex_user'@'localhost';
GRANT ALL PRIVILEGES ON demoTradeDBName.* TO 'tradex_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### 3. **Cài đặt các công cụ bổ sung (nếu cần)**

```bash
# Cài đặt PHP extensions cần thiết
sudo apt install php-cli php-mbstring php-xml php-bcmath php-curl php-mysql php-zip unzip -y

# Cài đặt Redis (tùy chọn, cho queue và cache)
sudo apt install redis-server -y
sudo systemctl start redis
sudo systemctl enable redis

# Cài đặt Screen hoặc Tmux để chạy nhiều terminal
sudo apt install screen -y
# hoặc
sudo apt install tmux -y

# Cài đặt PM2 để quản lý process (khuyến nghị)
sudo npm install -g pm2
```

---

## 🚀 Chạy ứng dụng

Mở **3 cửa sổ terminal riêng biệt** và làm theo hướng dẫn sau:

---

### **TERMINAL 1: Admin Portal (Laravel) - Port 8000**

```bash
cd /var/app/Tradexpro-AdminPortal

# Cài đặt dependencies (nếu chưa làm)
composer install

# Sao chép file môi trường
cp .env.example .env

# Chỉnh sửa file .env với thông tin database của bạn
nano .env
# Hoặc sử dụng vim/vi
# vim .env

# Cập nhật các dòng sau trong .env:
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=your_mysql_password
# DemoTradeDB_DATABASE=demoTradeDBName
# DemoTradeDB_USERNAME=root
# DemoTradeDB_PASSWORD=your_mysql_password

# Tạo application key
php artisan key:generate

# Chạy database migrations
php artisan migrate

# (Tùy chọn) Seed dữ liệu mẫu
php artisan db:seed

# Đảm bảo quyền đúng cho storage và cache
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache

# Khởi động development server
# Sử dụng --host=0.0.0.0 để truy cập từ các máy khác
php artisan serve --host=0.0.0.0
```

**Truy cập tại:** http://localhost:8000 hoặc http://YOUR_SERVER_IP:8000

✅ Bạn sẽ thấy trang chào mừng Laravel hoặc trang chủ admin portal

---

### **TERMINAL 2: User Portal (Next.js) - Port 3000**

```bash
cd /var/app/Tradexpro-UserPortal

# Dependencies đã được cài đặt, nhưng bạn có thể cài lại nếu cần
npm install --legacy-peer-deps

# Sao chép file môi trường
cp .env.example .env.local

# Chỉnh sửa file .env.local
nano .env.local

# Cập nhật các dòng sau:
# NEXT_PUBLIC_BASE_URL='http://localhost:8000'
# hoặc nếu truy cập từ xa:
# NEXT_PUBLIC_BASE_URL='http://YOUR_SERVER_IP:8000'
# NEXT_PUBLIC_HOSTED_CLIENT_URL='http://localhost:3000/'

# Khởi động development server
npm run dev
```

**Truy cập tại:** http://localhost:3000 hoặc http://YOUR_SERVER_IP:3000

✅ Bạn sẽ thấy giao diện nền tảng giao dịch

**Lưu ý:** User Portal đã được cấu hình để kết nối với Admin Portal tại `http://localhost:8000`

---

### **TERMINAL 3: Node Wallet Service - Port 8934**

```bash
cd /var/app/Tradexpro-NodeWallet

# Dependencies đã được cài đặt
npm install

# Sao chép file môi trường
cp .env.example .env

# Chỉnh sửa file .env nếu cần
nano .env

# Cập nhật TRONGRID_API_KEY nếu bạn có
# APP_PORT=8934 (mặc định)

# Khởi động wallet service
npm start
```

**Truy cập tại:** http://localhost:8934 hoặc http://YOUR_SERVER_IP:8934

✅ Wallet service sẽ chạy và có thể truy cập được

**Lưu ý:** Port 8934 được cấu hình trong file `.env`. Bạn có thể thay đổi nếu cần.

---

## 📍 Tóm tắt các điểm truy cập

| Dịch vụ                    | URL                          | Port        |
| -------------------------- | ---------------------------- | ----------- |
| **Admin Portal & API**     | http://localhost:8000        | 8000        |
| **User Portal (Frontend)** | http://localhost:3000        | 3000        |
| **Wallet Service**         | http://localhost:8934        | 8934        |
| **Laravel WebSockets**     | ws://localhost:8000/app/test | (real-time) |

---

## 🔧 Các file cấu hình quan trọng

### Admin Portal (`.env`)

Vị trí: `Tradexpro-AdminPortal/.env`

- Thông tin đăng nhập database
- API URLs
- Payment gateway keys (cập nhật với keys của bạn)
- Mail configuration
- Queue settings

### User Portal (`.env.local`)

Vị trí: `Tradexpro-UserPortal/.env.local`

- API endpoints (đã set thành localhost)
- Payment gateway keys (cập nhật với keys của bạn)
- Social login credentials

### Wallet Service (`.env`)

Vị trí: `Tradexpro-NodeWallet/.env`

- Port configuration
- API keys
- TRON Grid API key (cập nhật với key của bạn)

---

## 🗄️ Chi tiết thiết lập Database

### Các bảng được tạo bởi Migrations

Khi bạn chạy `php artisan migrate`, các bảng sau sẽ được tạo:

- `users` - Tài khoản người dùng
- `admin_settings` - Cấu hình admin
- `buys` và `sells` - Lệnh giao dịch
- `wallets` - Ví người dùng
- `transactions` - Lịch sử giao dịch
- `coins` và `coin_pairs` - Cấu hình coin và cặp giao dịch
- Và nhiều bảng khác...

### Seed dữ liệu mẫu

```bash
cd /var/app/Tradexpro-AdminPortal
php artisan db:seed
```

Lệnh này sẽ điền dữ liệu mẫu vào database để test.

### Kiểm tra Database

```bash
sudo mysql -u root -p
SHOW DATABASES;
USE laravel;
SHOW TABLES;
DESCRIBE users;
SELECT * FROM admin_settings;
EXIT;
```

---

## 🔑 Lưu ý quan trọng

### Giao tiếp API

- User Portal giao tiếp với Admin Portal API qua: `http://localhost:8000/api`
- Wallet Service giao tiếp độc lập với blockchain

### Tính năng Real-time

- Hỗ trợ WebSocket được cấu hình cho cập nhật real-time
- Cấu hình broadcasting trong `config/broadcasting.php`

### Cấu hình CORS

- CORS được bật cho localhost trong `config/cors.php`
- Cập nhật allowed origins cho production

### Xác thực

- JWT tokens được sử dụng cho API authentication
- Thông tin đăng nhập sẽ được tạo trong quá trình seeding hoặc đăng ký thủ công

---

## ⚠️ Các vấn đề thường gặp & Giải pháp

### Vấn đề: "Connection refused" trên Admin Portal

**Giải pháp:** Đảm bảo MySQL đang chạy

```bash
# Kiểm tra MySQL đang chạy
sudo systemctl status mysql

# Khởi động MySQL nếu chưa chạy
sudo systemctl start mysql

# Kích hoạt tự động khởi động
sudo systemctl enable mysql
```

### Vấn đề: "Port already in use"

**Giải pháp:** Thay đổi port trong file `.env` hoặc command tương ứng

Cho Laravel:

```bash
php artisan serve --host=0.0.0.0 --port=8001
```

Cho Next.js:

```bash
npm run dev -- -p 3001
```

Tìm process đang sử dụng port:

```bash
sudo lsof -i :8000
sudo lsof -i :3000
sudo lsof -i :8934

# Kill process nếu cần
sudo kill -9 <PID>
```

### Vấn đề: npm package conflicts

**Giải pháp:** Đã được xử lý trong quá trình setup với `--legacy-peer-deps`

### Vấn đề: Laravel key chưa được generate

**Giải pháp:** Generate thủ công

```bash
cd /var/app/Tradexpro-AdminPortal
php artisan key:generate
```

### Vấn đề: Permission denied trên storage

**Giải pháp:** Cấp quyền đúng

```bash
cd /var/app/Tradexpro-AdminPortal
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache
```

### Vấn đề: Database migration fails

**Giải pháp:** Kiểm tra database đã được tạo chưa

```bash
sudo mysql -u root -p
SHOW DATABASES;
# Nếu chưa có, tạo lại:
CREATE DATABASE laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## 🔄 Chạy dịch vụ ngầm (Production-like)

### Sử dụng Screen

```bash
# Cài đặt screen
sudo apt install screen

# Tạo session cho Admin Portal
screen -S admin
cd /var/app/Tradexpro-AdminPortal
php artisan serve --host=0.0.0.0
# Nhấn Ctrl+A, sau đó D để detach

# Tạo session cho User Portal
screen -S user
cd /var/app/Tradexpro-UserPortal
npm run dev
# Nhấn Ctrl+A, sau đó D để detach

# Tạo session cho Wallet Service
screen -S wallet
cd /var/app/Tradexpro-NodeWallet
npm start
# Nhấn Ctrl+A, sau đó D để detach

# Xem danh sách sessions
screen -ls

# Quay lại session
screen -r admin

# Kill session
screen -X -S admin quit
```

### Sử dụng PM2 (Khuyến nghị cho Production)

```bash
# Cài đặt PM2 globally
sudo npm install -g pm2

# Khởi động Admin Portal
cd /var/app/Tradexpro-AdminPortal
pm2 start "php artisan serve --host=0.0.0.0" --name admin-portal

# Khởi động User Portal
cd /var/app/Tradexpro-UserPortal
pm2 start npm --name user-portal -- run dev

# Khởi động Wallet Service
cd /var/app/Tradexpro-NodeWallet
pm2 start npm --name wallet-service -- start

# Quản lý processes
pm2 status              # Xem trạng thái tất cả
pm2 logs                # Xem logs tất cả
pm2 logs admin-portal   # Xem logs của một service
pm2 restart all         # Khởi động lại tất cả
pm2 stop all            # Dừng tất cả
pm2 delete all          # Xóa tất cả

# Tự động khởi động khi server reboot
pm2 startup
pm2 save

# Monitoring
pm2 monit
```

---

## 🌐 Cấu hình cho truy cập từ xa

Nếu bạn muốn truy cập từ máy khác hoặc từ internet:

### 1. Cấu hình Firewall

```bash
# Kiểm tra firewall status
sudo ufw status

# Cho phép các ports cần thiết
sudo ufw allow 8000/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 8934/tcp
sudo ufw allow 22/tcp    # SSH

# Kích hoạt firewall
sudo ufw enable

# Kiểm tra lại
sudo ufw status
```

### 2. Cập nhật file .env

```bash
# Trong Tradexpro-AdminPortal/.env
APP_URL=http://YOUR_SERVER_IP:8000
API_URL=http://YOUR_SERVER_IP:8000
FRONTEND_URL=http://YOUR_SERVER_IP:3000

# Trong Tradexpro-UserPortal/.env.local
NEXT_PUBLIC_BASE_URL='http://YOUR_SERVER_IP:8000'
NEXT_PUBLIC_HOSTED_CLIENT_URL='http://YOUR_SERVER_IP:3000/'
```

### 3. Cấu hình CORS (nếu cần)

```bash
# Chỉnh sửa config/cors.php trong Admin Portal
cd /var/app/Tradexpro-AdminPortal
nano config/cors.php

# Thêm IP hoặc domain của bạn vào allowed_origins
```

---

## 📚 Các bước tiếp theo

1. **Test Admin Portal:**
   - Truy cập http://localhost:8000
   - Tạo tài khoản user hoặc đăng nhập với credentials đã seed

2. **Test User Portal:**
   - Truy cập http://localhost:3000
   - Thử đặt lệnh giao dịch hoặc kiểm tra ví

3. **Test Wallet Service:**
   - Sử dụng API calls để test các thao tác ví
   - Kiểm tra logs trong `storage/logs/`

4. **Khám phá Code:**
   - Admin API routes: `routes/api.php`
   - User Portal pages: `pages/`
   - Wallet services: `src/services/`

---

## 🔒 Lưu ý bảo mật

1. **Environment Variables:** Không bao giờ commit file `.env`. Chỉ sử dụng `.env.example` làm template.
2. **API Keys:** Lưu trữ an toàn trong environment variables.
3. **Database:** Sử dụng mật khẩu mạnh và hạn chế quyền truy cập database.
4. **CORS:** Cấu hình phù hợp cho domain của bạn.
5. **SSL/TLS:** Bật HTTPS trong production.
6. **Firewall:** Chỉ mở các ports cần thiết.
7. **Updates:** Thường xuyên cập nhật dependencies và security patches.

---

## 🆘 Cần trợ giúp?

Kiểm tra logs tại:

- **Laravel logs:** `/var/app/Tradexpro-AdminPortal/storage/logs/`
- **Next.js console:** Kiểm tra terminal output
- **Node Wallet logs:** Kiểm tra terminal output
- **System logs:** `sudo journalctl -u mysql` (cho MySQL)

Các lệnh hữu ích:

```bash
# Kiểm tra services đang chạy
sudo systemctl status mysql
sudo systemctl status redis

# Kiểm tra ports đang lắng nghe
sudo netstat -tulpn | grep LISTEN

# Kiểm tra disk space
df -h

# Kiểm tra memory
free -h

# Xem processes
ps aux | grep php
ps aux | grep node
```

---

## 📞 Tài nguyên bổ sung

- **GitHub Repository:** [Tradex24-Exchange-](https://github.com/bitachaien/Tradex24-Exchange-.git)
- **QUICK_START.md** - Hướng dẫn nhanh
- **CHECKLIST.md** - Danh sách kiểm tra
- **README.md** - Tổng quan dự án

---

**Chúc bạn giao dịch thành công! 🚀**

---

**Made with [Bob](https://bob.build)** - AI-powered development assistant

Cập nhật lần cuối: Tháng 6, 2026
