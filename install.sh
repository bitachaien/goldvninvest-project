#!/bin/bash
set -e

# ==========================================
# CẤU HÌNH BIẾN MÔI TRƯỜNG CHÍNH
# ==========================================
USER_PORTAL_MODE="development" # "development" (để debug) hoặc "production"
DB_ROOT_PASS=$(date +%s | sha256sum | base64 | head -c 16)

# Định dạng màu sắc log
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== BẮT ĐẦU CÀI ĐẶT TOÀN BỘ HỆ THỐNG GOLDVNINVEST PROJECT ===${NC}"

# HÀM TỰ ĐỘNG KIỂM TRA VÀ GIẢI PHÓNG PORT BỊ CHIẾM DỤNG
kill_port_obstacle() {
    local port=$1
    if lsof -i :"$port" > /dev/null 2>&1; then
        echo -e "${YELLOW}[!] Phát hiện Port $port đang bị chiếm dụng. Đang tiến hành dọn dẹp...${NC}"
        lsof -ti :"$port" | xargs kill -9 > /dev/null 2>&1 || true
        echo -e "${GREEN}-> Giải phóng Port $port thành công.${NC}"
    fi
}

# ==========================================
# 1. KIỂM TRA & GIẢI PHÓNG PORT TRƯỚC KHI CÀI
# ==========================================
echo -e "${YELLOW}[1/6] Kiểm tra xung đột Port hệ thống...${NC}"
apt update && apt install -y lsof > /dev/null 2>&1 # Đảm bảo có lsof để quét port
kill_port_obstacle 3000
kill_port_obstacle 8000
kill_port_obstacle 8934
kill_port_obstacle 3306

# ==========================================
# 2. CÀI ĐẶT DEPENDENCIES HỆ THỐNG
# ==========================================
echo -e "${YELLOW}[2/6] Cập nhật và cài đặt môi trường nền...${NC}"
apt upgrade -y
apt install -y git curl wget unzip ufw software-properties-common

# Cài đặt PHP 8.0 & Composer
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php8.0 php8.0-cli php8.0-common php8.0-fpm php8.0-mysql php8.0-xml php8.0-mbstring php8.0-curl php8.0-zip php8.0-bcmath php8.0-tokenizer

curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer && chmod +x /usr/local/bin/composer

# Cài đặt Node.js v18 & PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g pm2

# ==========================================
# 3. CÀI ĐẶT & KHỞI TẠO MYSQL DATABASE
# ==========================================
echo -e "${YELLOW}[3/6] Cài đặt MySQL Server và thiết lập bảo mật...${NC}"
apt install -y mysql-server
systemctl start mysql && systemctl enable mysql

mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_ROOT_PASS}';"
mysql -u root -p"${DB_ROOT_PASS}" -e "FLUSH PRIVILEGES;"

mysql -u root -p"${DB_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p"${DB_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# ==========================================
# 4. TẢI MÃ NGUỒN VÀ THIẾT LẬP FILE .ENV
# ==========================================
echo -e "${YELLOW}[4/6] Quản lý mã nguồn dự án...${NC}"
mkdir -p /var/app
cd /var/app

if [ -d ".git" ]; then
    git pull origin main
fi

# --- 4.1 Cấu hình Tradexpro-AdminPortal (Laravel Backend) ---
echo -e "${YELLOW}--> Đang cấu hình cấu trúc .env cho AdminPortal...${NC}"
cd /var/app/Tradexpro-AdminPortal
composer install --no-interaction --prefer-dist --optimize-autoloader
cp .env.example .env

sed -i "s/DB_HOST=.*/DB_HOST=127.0.0.1/" .env
sed -i "s/DB_PORT=.*/DB_PORT=3306/" .env
sed -i "s/DB_DATABASE=.*/DB_DATABASE=laravel/" .env
sed -i "s/DB_USERNAME=.*/DB_USERNAME=root/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_ROOT_PASS}/" .env
sed -i "s/APP_ENV=.*/APP_ENV=local/" .env
sed -i "s/APP_DEBUG=.*/APP_DEBUG=true/" .env
sed -i "s|APP_URL=.*|APP_URL=http://localhost:8000|" .env

php artisan key:generate
chmod -R 775 storage bootstrap/cache
chown -R root:www-data storage bootstrap/cache

# Chạy Migration dữ liệu sàn
php artisan migrate --seed --force

# --- 4.2 Cấu hình Tradexpro-UserPortal (Next.js Frontend) ---
echo -e "${YELLOW}--> Đang cấu hình cấu trúc .env cho UserPortal...${NC}"
cd /var/app/Tradexpro-UserPortal
npm install --legacy-peer-deps
cp .env.example .env.local

sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://localhost:8000/api|" .env.local
sed -i "s|NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL=http://localhost:3000|" .env.local

if [ "$USER_PORTAL_MODE" = "production" ]; then
    npm run build
fi

# --- 4.3 Cấu hình Tradexpro-NodeWallet (Node.js Express) ---
echo -e "${YELLOW}--> Đang cấu hình cấu trúc .env cho NodeWallet...${NC}"
cd /var/app/Tradexpro-NodeWallet
npm install
cp .env.example .env

sed -i "s/DB_HOST=.*/DB_HOST=127.0.0.1/" .env
sed -i "s/DB_USER=.*/DB_USER=root/" .env
sed -i "s/DB_PASS=.*/DB_PASS=${DB_ROOT_PASS}/" .env
sed -i "s/DB_NAME=.*/DB_NAME=demoTradeDBName/" .env
sed -i "s/PORT=.*/PORT=8934/" .env

# ==========================================
# 5. ÉP MỞ FIREWALL (UFW FORCE AUTO-ENABLE)
# ==========================================
echo -e "${YELLOW}[5/6] Cấu hình và kích hoạt tường lửa mở các Port liên kết...${NC}"
ufw default allow outgoing
ufw default deny incoming

ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 8000/tcp
ufw allow 8934/tcp

# Thực hiện ép mở ufw cưỡng bức không cần confirm (y/n)
ufw --force enable

# ==========================================
# 6. KHỞI CHẠY HỆ THỐNG VỚI PM2
# =
