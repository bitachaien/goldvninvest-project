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
CREATE USER 'tradex_user'@'localhost' IDENTIFIED BY '@TradeDBName123';
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

## ⚡ Thiết lập tự động (Khuyến nghị)

Chúng tôi đã cung cấp các script tự động để đơn giản hóa quá trình thiết lập:

### Script 1: Thiết lập tự động hoàn chỉnh

```bash
cd /var/app
chmod +x quick-setup.sh
./quick-setup.sh
```

Script này sẽ tự động:
- ✅ Kiểm tra các công cụ đã cài đặt
- ✅ Cài đặt MySQL, Redis, PM2 (nếu chưa có)
- ✅ Tạo cơ sở dữ liệu
- ✅ Cài đặt dependencies cho cả 3 module
- ✅ Cấu hình file .env
- ✅ Chạy migrations và seeds
- ✅ Thiết lập permissions

### Script 2: Khởi động tất cả dịch vụ với PM2

```bash
cd /var/app
chmod +x start-services.sh
./start-services.sh
```

Script này sẽ:
- ✅ Khởi động Admin Portal (port 8000)
- ✅ Khởi động User Portal (port 3000)
- ✅ Khởi động Wallet Service (port 8934)
- ✅ Tùy chọn khởi động WebSocket server
- ✅ Lưu cấu hình PM2

### Script 3: Dừng tất cả dịch vụ

```bash
cd /var/app
chmod +x stop-services.sh
./stop-services.sh
```

**Lưu ý:** Nếu bạn muốn thiết lập thủ công từng bước, hãy xem phần tiếp theo.

---

## 🚀 Hướng dẫn thiết lập thủ công từng bước

### **Bước 1: Cài đặt MySQL và tạo cơ sở dữ liệu**

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

**Tạo cơ sở dữ liệu:**

```bash
# Đăng nhập vào MySQL
sudo mysql -u root -p

# Trong MySQL console, chạy các lệnh sau:
CREATE DATABASE laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Tạo user MySQL (tùy chọn, khuyến nghị cho production)
CREATE USER 'tradex_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON laravel.* TO 'tradex_user'@'localhost';
GRANT ALL PRIVILEGES ON demoTradeDBName.* TO 'tradex_user'@'localhost';
FLUSH PRIVILEGES;

# Kiểm tra databases đã tạo
SHOW DATABASES;

EXIT;
```

### **Bước 2: Cài đặt PHP Extensions cần thiết**

```bash
# Cài đặt PHP extensions
sudo apt install php8.4-cli php8.4-mbstring php8.4-xml php8.4-bcmath php8.4-curl php8.4-mysql php8.4-zip php8.4-gd php8.4-intl unzip -y

# Kiểm tra PHP version
php --version

# Kiểm tra extensions đã cài
php -m | grep -E 'mbstring|xml|bcmath|curl|mysql|zip|gd'
```

### **Bước 3: Cài đặt Redis (Tùy chọn nhưng khuyến nghị)**

```bash
# Cài đặt Redis
sudo apt install redis-server -y

# Khởi động và kích hoạt Redis
sudo systemctl start redis
sudo systemctl enable redis

# Kiểm tra trạng thái
sudo systemctl status redis

# Test Redis
redis-cli ping
# Kết quả mong đợi: PONG
```

### **Bước 4: Thiết lập Admin Portal (Laravel)**

```bash
# Di chuyển vào thư mục Admin Portal
cd /var/app/Tradexpro-AdminPortal

# Cài đặt dependencies
composer install

# Sao chép file môi trường
cp .env.example .env

# Chỉnh sửa file .env
nano .env
```

**Cập nhật các thông tin sau trong file `.env`:**

```env
APP_NAME="Tradex24 Exchange"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=@TradeDBName123

# Demo Trade Database
DemoTradeDB_CONNECTION=mysql
DemoTradeDB_HOST=127.0.0.1
DemoTradeDB_PORT=3306
DemoTradeDB_DATABASE=demoTradeDBName
DemoTradeDB_USERNAME=root
DemoTradeDB_PASSWORD=@TradeDBName123

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Queue Configuration
QUEUE_CONNECTION=sync
# Đổi thành 'redis' nếu bạn muốn sử dụng Redis queue

# Mail Configuration (cập nhật với thông tin của bạn)
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

**Tiếp tục thiết lập:**

```bash
# Tạo application key
php artisan key:generate

# Cấp quyền cho storage và cache
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache

# Chạy migrations để tạo bảng database
php artisan migrate

# Seed dữ liệu mẫu (tùy chọn)
php artisan db:seed

# Tạo symbolic link cho storage
php artisan storage:link

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

**Kiểm tra thiết lập:**

```bash
# Kiểm tra kết nối database
php artisan tinker
# Trong tinker, chạy:
# DB::connection()->getPdo();
# exit

# Khởi động development server
php artisan serve --host=0.0.0.0
```

Truy cập: http://localhost:8000 hoặc http://YOUR_SERVER_IP:8000

### **Bước 5: Thiết lập User Portal (Next.js)**

Mở terminal mới:

```bash
# Di chuyển vào thư mục User Portal
cd /var/app/Tradexpro-UserPortal

# Cài đặt dependencies
npm install --legacy-peer-deps

# Sao chép file môi trường
cp .env.example .env.local

# Chỉnh sửa file .env.local
nano .env.local
```

**Cập nhật các thông tin sau trong file `.env.local`:**

```env
# API Configuration
NEXT_PUBLIC_BASE_URL='http://localhost:8000'
NEXT_PUBLIC_HOSTED_CLIENT_URL='http://localhost:3000/'

# Nếu truy cập từ xa, thay localhost bằng IP server:
# NEXT_PUBLIC_BASE_URL='http://YOUR_SERVER_IP:8000'
# NEXT_PUBLIC_HOSTED_CLIENT_URL='http://YOUR_SERVER_IP:3000/'

# Secret Key (phải giống với USER_API_SECRET_KEY trong Admin Portal .env)
NEXT_PUBLIC_SECRET_KEY=h0vWu6MkInNlWHJVfIXmHbIbC66cQvlbSUQI09Whbp

# Payment Gateway Keys (cập nhật với keys của bạn)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

# Google reCAPTCHA (tùy chọn)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

**Khởi động User Portal:**

```bash
# Build và khởi động development server
npm run dev

# Hoặc build cho production:
# npm run build
# npm start
```

Truy cập: http://localhost:3000 hoặc http://YOUR_SERVER_IP:3000

### **Bước 6: Thiết lập Node Wallet Service**

Mở terminal thứ ba:

```bash
# Di chuyển vào thư mục Node Wallet
cd /var/app/Tradexpro-NodeWallet

# Cài đặt dependencies
npm install

# Sao chép file môi trường
cp .env.example .env

# Chỉnh sửa file .env
nano .env
```

**Cập nhật các thông tin sau trong file `.env`:**

```env
# Application Configuration
APP_PORT=8934
NODE_ENV=development

# TRON Configuration
TRONGRID_API_KEY=your_trongrid_api_key
# Lấy API key miễn phí tại: https://www.trongrid.io/

# Ethereum/ERC20 Configuration
ETH_RPC_URL=https://mainnet.infura.io/v3/your_infura_project_id
# Lấy Infura project ID tại: https://infura.io/

# BSC/BEP20 Configuration
BSC_RPC_URL=https://bsc-dataseed.binance.org/

# Polygon/MATIC Configuration
MATIC_RPC_URL=https://polygon-rpc.com/
```

**Khởi động Wallet Service:**

```bash
# Khởi động service
npm start

# Hoặc sử dụng nodemon cho development:
# npm run dev
```

Truy cập: http://localhost:8934 hoặc http://YOUR_SERVER_IP:8934

---

## ✅ Xác minh thiết lập

### Kiểm tra tất cả dịch vụ đang chạy

```bash
# Kiểm tra ports đang lắng nghe
sudo netstat -tulpn | grep LISTEN | grep -E '8000|3000|8934'

# Hoặc sử dụng lsof
sudo lsof -i :8000  # Admin Portal
sudo lsof -i :3000  # User Portal
sudo lsof -i :8934  # Wallet Service
```

### Kiểm tra MySQL

```bash
sudo mysql -u root -p
SHOW DATABASES;
USE laravel;
SHOW TABLES;
SELECT COUNT(*) FROM users;
EXIT;
```

### Kiểm tra Redis

```bash
redis-cli ping
# Kết quả: PONG

redis-cli
> KEYS *
> exit
```

### Test API Endpoints

```bash
# Test Admin Portal API
curl http://localhost:8000/api/health
curl http://localhost:8000/api/common-settings

# Test User Portal
curl http://localhost:3000

# Test Wallet Service
curl http://localhost:8934/health
```

---

## 🔐 Tạo tài khoản Admin đầu tiên

Sau khi chạy migrations và seeds, bạn có thể:

**Phương pháp 1: Sử dụng Seeder (đã có sẵn)**

```bash
cd /var/app/Tradexpro-AdminPortal
php artisan db:seed --class=UsersTableSeeder
```

**Phương pháp 2: Tạo thủ công qua Tinker**

```bash
cd /var/app/Tradexpro-AdminPortal
php artisan tinker
```

Trong Tinker console:

```php
$user = new App\Model\User();
$user->first_name = 'Admin';
$user->last_name = 'User';
$user->email = 'admin@tradex24.com';
$user->password = bcrypt('password123');
$user->role = 1; // 1 = Admin
$user->status = 1; // Active
$user->is_verified = 1;
$user->save();
exit
```

**Phương pháp 3: Đăng ký qua giao diện web**

1. Truy cập http://localhost:3000
2. Nhấp vào "Sign Up"
3. Điền thông tin đăng ký
4. Xác nhận email (nếu có cấu hình mail)
5. Đăng nhập với tài khoản vừa tạo

---

## 🎨 Cấu hình bổ sung

### Cấu hình Queue Workers (Khuyến nghị)

Nếu bạn sử dụng Redis queue:

```bash
cd /var/app/Tradexpro-AdminPortal

# Chạy queue worker
php artisan queue:work --tries=3

# Hoặc sử dụng supervisor để quản lý queue workers
sudo apt install supervisor -y

# Tạo file config cho supervisor
sudo nano /etc/supervisor/conf.d/tradexpro-worker.conf
```

Nội dung file `tradexpro-worker.conf`:

```ini
[program:tradexpro-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/app/Tradexpro-AdminPortal/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/app/Tradexpro-AdminPortal/storage/logs/worker.log
stopwaitsecs=3600
```

Khởi động supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start tradexpro-worker:*
sudo supervisorctl status
```

### Cấu hình Laravel WebSockets (Real-time)

```bash
cd /var/app/Tradexpro-AdminPortal

# Cài đặt Laravel WebSockets package (nếu chưa có)
composer require beyondcode/laravel-websockets

# Publish config
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="config"

# Chạy WebSocket server
php artisan websockets:serve
```

Hoặc sử dụng PM2:

```bash
pm2 start "php artisan websockets:serve" --name websockets
```

### Cấu hình Cron Jobs

```bash
# Mở crontab
crontab -e

# Thêm dòng sau:
* * * * * cd /var/app/Tradexpro-AdminPortal && php artisan schedule:run >> /dev/null 2>&1
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

### Vấn đề: "Class not found" errors

**Nguyên nhân:** Autoload chưa được cập nhật

**Giải pháp:**

```bash
cd /var/app/Tradexpro-AdminPortal

# Regenerate autoload files
composer dump-autoload

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Nếu vẫn lỗi, cài lại dependencies
rm -rf vendor
composer install
```

### Vấn đề: CORS errors trong browser

**Nguyên nhân:** CORS chưa được cấu hình đúng

**Giải pháp:**

```bash
cd /var/app/Tradexpro-AdminPortal

# Kiểm tra file config/cors.php
nano config/cors.php

# Đảm bảo có cấu hình:
# 'allowed_origins' => ['http://localhost:3000', 'http://YOUR_SERVER_IP:3000'],
# 'allowed_methods' => ['*'],
# 'allowed_headers' => ['*'],

# Clear config cache
php artisan config:clear
```

### Vấn đề: Redis connection failed

**Nguyên nhân:** Redis chưa chạy hoặc cấu hình sai

**Giải pháp:**

```bash
# Kiểm tra Redis đang chạy
sudo systemctl status redis

# Khởi động Redis
sudo systemctl start redis
sudo systemctl enable redis

# Test Redis
redis-cli ping
# Kết quả mong đợi: PONG

# Nếu không dùng Redis, đổi QUEUE_CONNECTION trong .env
# QUEUE_CONNECTION=sync
```

### Vấn đề: "Too many open files" error

**Nguyên nhân:** Giới hạn file descriptors quá thấp

**Giải pháp:**

```bash
# Tăng giới hạn file descriptors
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Hoặc tạm thời:
sudo sysctl fs.inotify.max_user_watches=524288
```

### Vấn đề: Composer memory limit

**Nguyên nhân:** Composer hết bộ nhớ khi cài đặt

**Giải pháp:**

```bash
# Tăng memory limit cho Composer
COMPOSER_MEMORY_LIMIT=-1 composer install

# Hoặc cài đặt với --no-dev
composer install --no-dev --optimize-autoloader
```

### Vấn đề: Next.js build fails

**Nguyên nhân:** Lỗi trong code hoặc thiếu dependencies

**Giải pháp:**

```bash
cd /var/app/Tradexpro-UserPortal

# Xóa .next directory
rm -rf .next

# Clear cache và rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Build lại
npm run build
```

### Vấn đề: PM2 services không tự động khởi động sau reboot

**Nguyên nhân:** PM2 startup chưa được cấu hình

**Giải pháp:**

```bash
# Cấu hình PM2 startup
pm2 startup

# Chạy lệnh được hiển thị (thường là sudo ...)
# Ví dụ: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username

# Lưu danh sách processes
pm2 save

# Test bằng cách reboot
sudo reboot
```

### Vấn đề: Firewall chặn kết nối

**Nguyên nhân:** UFW hoặc iptables chặn ports

**Giải pháp:**

```bash
# Kiểm tra firewall status
sudo ufw status

# Cho phép các ports cần thiết
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8000/tcp  # Admin Portal
sudo ufw allow 3000/tcp  # User Portal
sudo ufw allow 8934/tcp  # Wallet Service

# Kích hoạt firewall
sudo ufw enable

# Kiểm tra lại
sudo ufw status verbose
```

### Vấn đề: Slow performance

**Nguyên nhân:** Thiếu optimization hoặc tài nguyên hệ thống

**Giải pháp:**

```bash
# Optimize Laravel
cd /var/app/Tradexpro-AdminPortal
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev

# Optimize Next.js
cd /var/app/Tradexpro-UserPortal
npm run build  # Build production version

# Kiểm tra tài nguyên hệ thống
free -h        # Memory
df -h          # Disk space
top            # CPU usage

# Cài đặt Redis cho caching
sudo apt install redis-server
# Cập nhật CACHE_DRIVER=redis trong .env
```

### Vấn đề: MySQL "Access denied for user"

**Nguyên nhân:** Thông tin đăng nhập MySQL không đúng

**Giải pháp:**

```bash
# Reset MySQL root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
EXIT;

# Cập nhật password trong .env
cd /var/app/Tradexpro-AdminPortal
nano .env
# Sửa DB_PASSWORD=new_password
```

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
