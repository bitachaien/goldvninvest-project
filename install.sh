#!/bin/bash

# Hiển thị màu sắc cho các log thông báo
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== BẮT ĐẦU CÀI ĐẶT TOÀN BỘ HỆ THỐNG GOLDVNINVEST PROJECT ===${NC}"

# 1. CẬP NHẬT HỆ THỐNG & CÀI ĐẶT DEPENDENCIES CƠ BẢN
echo -e "${YELLOW}[1/6] Cập nhật hệ thống và cài đặt công cụ cơ bản...${NC}"
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget unzip lsof ufw software-properties-common

# 2. CÀI ĐẶT PHP 8.0 & COMPOSER (Dành cho AdminPortal)
echo -e "${YELLOW}[2/6] Cài đặt PHP 8.0 và các extension cần thiết...${NC}"
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.0 php8.0-cli php8.0-common php8.0-fpm php8.0-mysql php8.0-xml php8.0-mbstring php8.0-curl php8.0-zip php8.0-bcmath php8.0-tokenizer

# Cài đặt Composer toàn cục
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

# 3. CÀI ĐẶT NODE.JS (Khuyên dùng v16 hoặc v18 phù hợp Next.js 12+) & PM2
echo -e "${YELLOW}[3/6] Cài đặt Node.js và PM2...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# 4. CÀI ĐẶT & CẤU HÌNH MYSQL DATABASE
echo -e "${YELLOW}[4/6] Cài đặt MySQL Server...${NC}"
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Khởi tạo database theo tài liệu dự án
echo -e "${YELLOW}Khởi tạo cơ sở dữ liệu...${NC}"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. CLONE CODE VÀ CẤU HÌNH TỪNG MODULE
echo -e "${YELLOW}[5/6] Tiến hành tải source code và cấu hình ứng dụng...${NC}"
sudo mkdir -p /var/app
sudo chown -R $USER:$USER /var/app
cd /var/app

# Kiểm tra nếu thư mục đã có code thì pull, chưa có thì clone
if [ -d ".git" ]; then
    echo -e "${YELLOW}Thư mục đã tồn tại, tiến hành cập nhật mã nguồn...${NC}"
    git pull origin main
else
    git clone https://github.com/bitachaien/goldvninvest-project.git .
fi

# --- Cấu hình Module 1: Tradexpro-AdminPortal (Laravel) ---
echo -e "${YELLOW}--> Cấu hình Tradexpro-AdminPortal...${NC}"
cd /var/app/Tradexpro-AdminPortal
composer install --no-interaction --prefer-dist --optimize-autoloader
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}Đã tạo file .env cho AdminPortal. Hãy nhớ cập nhật tài khoản DB của bạn!${NC}"
fi
php artisan key:generate
# Phân quyền cho storage
chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache
# Chạy migration và seed (Bỏ comment dòng dưới nếu chắc chắn cấu hình .env DB đã đúng)
# php artisan migrate --seed

# --- Cấu hình Module 2: Tradexpro-UserPortal (Next.js) ---
echo -e "${YELLOW}--> Cấu hình Tradexpro-UserPortal...${NC}"
cd /var/app/Tradexpro-UserPortal
npm install --legacy-peer-deps
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
fi
# Build ứng dụng cho môi trường production
npm run build

# --- Cấu hình Module 3: Tradexpro-NodeWallet (Node.js Express) ---
echo -e "${YELLOW}--> Cấu hình Tradexpro-NodeWallet...${NC}"
cd /var/app/Tradexpro-NodeWallet
npm install
if [ ! -f ".env" ]; then
    cp .env.example .env
fi

# 6. KHỞI CHẠY CÁC DỊCH VỤ QUA PM2 (Chuẩn DevOps Quy Trình)
echo -e "${YELLOW}[6/6] Khởi chạy các dịch vụ thông qua PM2...${NC}"
pm2 delete all 2>/dev/null || true # Reset các app cũ nếu có

# Khởi chạy Admin Portal
pm2 start "php artisan serve --host=0.0.0.0 --port=8000" --name "admin-portal" --cwd /var/app/Tradexpro-AdminPortal

# Khởi chạy User Portal (Môi trường production chạy lệnh start)
pm2 start npm --name "user-portal" --cwd /var/app/Tradexpro-UserPortal -- start

# Khởi chạy Wallet Service
pm2 start npm --name "wallet-service" --cwd /var/app/Tradexpro-NodeWallet -- start

# Lưu trạng thái và cấu hình khởi động cùng hệ thống
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

# THIẾT LẬP TƯỜNG LỬA CƠ BẢN
echo -e "${YELLOW}Cấu hình Firewall UFW...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 8000/tcp
sudo ufw allow 8934/tcp
# Tự động đồng ý bật tường lửa
echo "y" | sudo ufw enable

echo -e "${GREEN}=== CÀI ĐẶT HOÀN TẤT TẤT CẢ MODULES! ===${NC}"
echo -e "${GREEN}Admin Portal: http://localhost:8000${NC}"
echo -e "${GREEN}User Portal:  http://localhost:3000${NC}"
echo -e "${GREEN}Wallet Node:  http://localhost:8934${NC}"
echo -e "${YELLOW}Lưu ý: Hãy kiểm tra và chỉnh sửa lại các file .env tại các thư mục nếu có lỗi kết nối database hoặc API.${NC}"
pm2 status
