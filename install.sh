#!/bin/bash
set -e

# ==========================================
# CẤU HÌNH BIẾN MÔI TRƯỜNG CHÍNH
# ==========================================
SSH_USER="devops_admin"
# THAY THẾ: Hãy dán Public Key SSH của bạn vào đây để đăng nhập
SSH_PUBLIC_KEY="ssh-rsa AAAAB3NzaC1yc2E... user@domain" 

# Chế độ chạy UserPortal: "development" (để debug) hoặc "production"
USER_PORTAL_MODE="development" 

# Tự động sinh mật khẩu ngẫu nhiên cho MySQL & User phụ để bảo mật
DB_ROOT_PASS=$(date +%s | sha256sum | base64 | head -c 16)
RANDOM_USER="dev_guest"
RANDOM_PASS=$(date +%s | sha256sum | tail -c 16 | base64 | head -c 16)

# Định dạng màu sắc thông báo
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== BẮT ĐẦU CÀI ĐẶT TOÀN BỘ HỆ THỐNG GOLDVNINVEST PROJECT ===${NC}"

# ==========================================
# 1. QUẢN LÝ USER, BẢO MẬT SSH & RESET ROOT
# ==========================================
echo -e "${YELLOW}[1/8] Thiết lập tài khoản bảo mật và cấu hình SSH...${NC}"

# 1.1 Khởi tạo SSH User chính (Sudo không mật khẩu)
if ! id -u "$SSH_USER" >/dev/null 2>&1; then
    sudo useradd -m -s /bin/bash "$SSH_USER"
    echo "$SSH_USER ALL=(ALL) NOPASSWD:ALL" | sudo tee "/etc/sudoers.d/$SSH_USER" > /dev/null
    
    sudo mkdir -p /home/$SSH_USER/.ssh
    echo "$SSH_PUBLIC_KEY" | sudo tee /home/$SSH_USER/.ssh/authorized_keys > /dev/null
    sudo chown -R $SSH_USER:$SSH_USER /home/$SSH_USER/.ssh
    sudo chmod 700 /home/$SSH_USER/.ssh
    sudo chmod 600 /home/$SSH_USER/.ssh/authorized_keys
fi

# 1.2 Tạo user người dùng phụ sinh pass ngẫu nhiên
if ! id -u "$RANDOM_USER" >/dev/null 2>&1; then
    sudo useradd -m -s /bin/bash "$RANDOM_USER"
    echo "$RANDOM_USER:$RANDOM_PASS" | sudo chpasswd
    echo "$RANDOM_USER ALL=(ALL) NOPASSWD:ALL" | sudo tee "/etc/sudoers.d/$RANDOM_USER" > /dev/null
fi

# 1.3 Khóa login Root bằng mật khẩu (Bypass Root)
sudo passwd -d root || true
sudo passwd -l root || true
sudo sed -i 's/#PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sudo sed -i 's/PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# ==========================================
# 2. CÀI ĐẶT DEPENDENCIES HỆ THỐNG
# ==========================================
echo -e "${YELLOW}[2/8] Cập nhật hệ thống và cài đặt môi trường...${NC}"
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget unzip lsof ufw software-properties-common

# Cài đặt PHP 8.0 & Composer
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.0 php8.0-cli php8.0-common php8.0-fpm php8.0-mysql php8.0-xml php8.0-mbstring php8.0-curl php8.0-zip php8.0-bcmath php8.0-tokenizer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer && chmod +x /usr/local/bin/composer

# Cài đặt Node.js v18 & PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# ==========================================
# 3. CÀI ĐẶT & KHỞI TẠO MYSQL DATABASE
# ==========================================
echo -e "${YELLOW}[3/8] Cài đặt MySQL Server và cấu hình mật khẩu bảo mật...${NC}"
sudo apt install -y mysql-server
sudo systemctl start mysql && sudo systemctl enable mysql

# Thiết lập mật khẩu root cho MySQL và cấp quyền truy cập đầy đủ
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_ROOT_PASS}';"
sudo mysql -u root -p"${DB_ROOT_PASS}" -e "FLUSH PRIVILEGES;"

# Tạo các Database phục vụ dự án
sudo mysql -u root -p"${DB_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -u root -p"${DB_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# ==========================================
# 4. TẢI MÃ NGUỒN VÀ PHÂN QUYỀN VÙNG DỮ LIỆU
# ==========================================
echo -e "${YELLOW}[4/8] Cài đặt mã nguồn [goldvninvest-project]...${NC}"
sudo mkdir -p /var/app
sudo chown -R $USER:$USER /var/app
cd /var/app

if [ -d ".git" ]; then
    git pull origin main
else
    git clone https://github.com/bitachaien/goldvninvest-project.git .
fi

# ==========================================
# 5. TỰ ĐỘNG CẤU HÌNH .ENV CHO TỪNG MODULE
# ==========================================
echo -e "${YELLOW}[5/8] Tự động tạo và điền thông tin biến môi trường (.env) hợp lệ...${NC}"

# --- 5.1 Cấu hình Tradexpro-AdminPortal (Laravel Backend) ---
cd /var/app/Tradexpro-AdminPortal
composer install --no-interaction --prefer-dist --optimize-autoloader
cp .env.example .env

# Dùng sed ghi đè thông tin kết nối Database chuẩn vào file .env của Laravel
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
sudo chown -R $USER:www-data storage bootstrap/cache

# Chạy migration và nạp dữ liệu mẫu seed ngay sau khi cấu hình .env chuẩn
echo -e "${YELLOW}Đang khởi tạo cấu trúc bảng dữ liệu dữ án...${NC}"
php artisan migrate --seed --force

# --- 5.2 Cấu hình Tradexpro-UserPortal (Next.js Frontend) ---
cd /var/app/Tradexpro-UserPortal
npm install --legacy-peer-deps
cp .env.example .env.local

# Trỏ API Endpoints của Frontend về cổng chạy Backend Laravel
sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://localhost:8000/api|" .env.local
sed -i "s|NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL=http://localhost:3000|" .env.local

if [ "$USER_PORTAL_MODE" = "production" ]; then
    echo -e "${YELLOW}Đang chạy Build Production cho Next.js...${NC}"
    npm run build
fi

# --- 5.3 Cấu hình Tradexpro-NodeWallet (Node.js Express) ---
cd /var/app/Tradexpro-NodeWallet
npm install
cp .env.example .env

# Cập nhật thông tin kết nối Database thứ 2 hoặc chính cho ví nếu cần thiết
sed -i "s/DB_HOST=.*/DB_HOST=127.0.0.1/" .env
sed -i "s/DB_USER=.*/DB_USER=root/" .env
sed -i "s/DB_PASS=.*/DB_PASS=${DB_ROOT_PASS}/" .env
sed -i "s/DB_NAME=.*/DB_NAME=demoTradeDBName/" .env
sed -i "s/PORT=.*/PORT=8934/" .env

# ==========================================
# 6. KHỞI CHẠY PM2 THEO MÔI TRƯỜNG CHỈ ĐỊNH
# ==========================================
echo -e "${YELLOW}[6/8] Khởi chạy các dịch vụ thông qua quản lý PM2...${NC}"
pm2 delete all 2>/dev/null || true

# Chạy Backend Laravel
pm2 start "php artisan serve --host=0.0.0.0 --port=8000" --name "admin-portal" --cwd /var/app/Tradexpro-AdminPortal

# Chạy Frontend Next.js tùy biến theo chế độ Dev/Prod
if [ "$USER_PORTAL_MODE" = "production" ]; then
    pm2 start npm --name "user-portal" --cwd /var/app/Tradexpro-UserPortal -- start
else
    pm2 start npm --name "user-portal" --cwd /var/app/Tradexpro-UserPortal -- run dev
fi

# Chạy Dịch vụ ví Node.js
pm2 start npm --name "wallet-service" --cwd /var/app/Tradexpro-NodeWallet -- start

pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

# ==========================================
# 7. BẢO MẬT HỆ THỐNG QUA FIREWALL UFW
# ==========================================
echo -e "${YELLOW}[7/8] Cấu hình Firewall UFW bảo vệ các cổng kết nối...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 8000/tcp
sudo ufw allow 8934/tcp
echo "y" | sudo ufw enable

# ==========================================
# 8. XUẤT BÁO CÁO TOÀN DIỆN
# ==========================================
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}      HỆ THỐNG ĐÃ ĐƯỢC SETUP VÀ LIÊN KẾT THÀNH CÔNG!     ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "${YELLOW}Mật khẩu các phân vùng được sinh tự động an toàn:${NC}"
echo -e "🔑 MySQL Root Password      : ${RED}${DB_ROOT_PASS}${NC}"
echo -e "👤 SSH User chính           : ${GREEN}${SSH_USER}${NC} (Đăng nhập bằng SSH Key)"
echo -e "👤 User Debug phụ           : ${GREEN}${RANDOM_USER}${NC} | Mật khẩu: ${RED}${RANDOM_PASS}${NC}"
echo -e "⚙️  Chế độ vận hành Frontend : ${GREEN}${USER_PORTAL_MODE}${NC}"
echo -e "\n${GREEN}Hệ thống .env đã tự điền đồng bộ. Mọi dịch vụ đã sẵn sàng!${NC}"

pm2 status
