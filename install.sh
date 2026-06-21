#!/bin/bash
set -e

# ==========================================
# CẤU HÌNH BIẾN MÔI TRƯỜNG CHÍNH
# ==========================================
USER_PORTAL_MODE="development" # "development" hoặc "production"
APP_DIR="/var/app"
DB_ROOT_PASS=$(date +%s | sha256sum | base64 | head -c 16)

# Tự động nhận diện thông tin từ kho lưu trữ Git của bạn
REPO_URL="https://github.com/bitachaien/goldvninvest-project.git"
AUTHOR_NAME=$(echo "$REPO_URL" | awk -F'/' '{print $(NF-1)}')
PROJECT_NAME=$(echo "$REPO_URL" | awk -F'/' '{print $NF}' | sed 's/\.git//')

# Màu sắc và Font giao diện CLI
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ==========================================
# HÀM HIỂN THỊ THANH TIẾN TRÌNH LOADING (PROGRESS BAR)
# ==========================================
show_progress() {
    local duration=$1
    local task_name=$2
    local col_width=40
    
    echo -ne "${YELLOW}⏳ Task: ${task_name}\n"
    for ((i=1; i<=100; i++)); do
        local num_chars=$(( i * col_width / 100 ))
        local num_spaces=$(( col_width - num_chars ))
        
        local bar=$(printf "%0${num_chars}s" | tr ' ' '█')
        local space=$(printf "%0${num_spaces}s" | tr ' ' '░')
        
        echo -ne "\r${GREEN}[${bar}${space}] ${i}% Completing..."
        sleep "$(echo "scale=4; ${duration} / 100" | bc)"
    done
    echo -e "\n${GREEN}✔ Hoàn tất!${NC}\n"
}

# HÀM ÉP GIẢI PHÓNG PORT NGHẼN
kill_port_obstacle() {
    local port=$1
    if lsof -i :"$port" > /dev/null 2>&1; then
        lsof -ti :"$port" | xargs kill -9 > /dev/null 2>&1 || true
    fi
}

# ==========================================
# GIAO DIỆN CLI BANNER
# ==========================================
clear
echo -e "${GREEN}==================================================================${NC}"
echo -e "${GREEN}  ██████╗  ██████╗ ██╗     ██████╗ ██╗   ██╗███╗   ██╗██╗██████╗   ${NC}"
echo -e "${GREEN} ██╔════╝ ██╔═══██╗██║     ██╔══██╗██║   ██║████╗  ██║██║██╔══██╗  ${NC}"
echo -e "${GREEN} ██║  ███╗██║   ██║██║     ██║  ██║██║   ██║██╔██╗ ██║██║██████╔╝  ${NC}"
echo -e "${GREEN} ██║   ██║██║   ██║██║     ██║  ██║╚██╗ ██╔╝██║╚██╗██║██║██╔═══╝   ${NC}"
echo -e "${GREEN} ╚██████╔╝╚██████╔╝███████╗██████╔╝ ╚████╔╝ ██║ ╚████║██║██║       ${NC}"
echo -e "${GREEN}  ╚═════╝  ╚═════╝ ╚══════╝╚═════╝   ╚═══╝  ╚═╝  ╚═══╝╚═╝╚═╝       ${NC}"
echo -e "${GREEN}==================================================================${NC}"
echo -e "${BOLD} DỰ ÁN   :${NC} ${YELLOW}${PROJECT_NAME^^}${NC}"
echo -e "${BOLD} TÁC GIẢ :${NC} ${YELLOW}${AUTHOR_NAME}${NC}"
echo -e "${BOLD} ĐỊA CHỈ :${NC} ${REPO_URL}"
echo -e "${GREEN}==================================================================${NC}\n"

# ==========================================
# CƠ CHẾ KIỂM TRA ĐÃ CÀI ĐẶT TRƯỚC ĐÓ (IDEMPOTENCY)
# ==========================================
if [ -d "$APP_DIR/Tradexpro-AdminPortal" ] && pm2 info admin-portal >/dev/null 2>&1; then
    echo -e "${GREEN}[✔] Trạng thái: Hệ thống ứng dụng đã cài đặt khớp cấu hình từ trước.${NC}"
    show_progress 1.0 "Quét cấu trúc dữ liệu cũ và bỏ qua cài đặt lại"
    GOTO_HEALTH_CHECK=true
fi

if [ "$GOTO_HEALTH_CHECK" != true ]; then
    # --------------------------------------
    # BƯỚC 1: TỰ ĐỘNG KHỞI TẠO & PHÂN QUYỀN APP_DIR
    # --------------------------------------
    if [ ! -d "$APP_DIR" ]; then
        mkdir -p "$APP_DIR"
        chmod 755 "$APP_DIR"
        show_progress 1.0 "Thư mục mục tiêu chưa tồn tại, tự động tạo mới phân vùng: $APP_DIR"
    else
        show_progress 0.5 "Phát hiện thư mục gốc $APP_DIR đã có sẵn trên hệ thống"
    fi

    # --------------------------------------
    # BƯỚC 2: DỌN DẸP PORT XUNG ĐỘT
    # --------------------------------------
    apt update && apt install -y lsof curl bc > /dev/null 2>&1
    kill_port_obstacle 3000
    kill_port_obstacle 8000
    kill_port_obstacle 8080
    kill_port_obstacle 8934
    show_progress 1.0 "Quét và ép giải phóng các cổng mạng cản trở (3000, 8000, 8080, 8934)"

    # --------------------------------------
    # BƯỚC 3: CÀI ĐẶT DEPENDENCIES
    # --------------------------------------
    echo -e "${YELLOW}[!] Đang cài đặt ngầm môi trường core...${NC}"
    apt install -y software-properties-common > /dev/null 2>&1
    add-apt-repository ppa:ondrej/php -y > /dev/null 2>&1
    apt update > /dev/null 2>&1
    apt install -y php8.0 php8.0-cli php8.0-fpm php8.0-mysql php8.0-xml php8.0-mbstring php8.0-curl php8.0-zip php8.0-bcmath php8.0-tokenizer mysql-server git unzip ufw > /dev/null 2>&1

    curl -sS https://getcomposer.org/installer | php > /dev/null 2>&1
    mv composer.phar /usr/local/bin/composer && chmod +x /usr/local/bin/composer
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
    apt install -y nodejs > /dev/null 2>&1 && npm install -g pm2 > /dev/null 2>&1
    show_progress 3.0 "Cài đặt môi trường cốt lõi (PHP 8.0, Composer, Node v18, PM2, MySQL)"

    # --------------------------------------
    # BƯỚC 4: CẤU HÌNH DATABASE
    # --------------------------------------
    systemctl start mysql && systemctl enable mysql
    mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_ROOT_PASS}';" || DB_ROOT_PASS="DETECTED_ALREADY_SET"
    mysql -u root -p"${DB_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" > /dev/null 2>&1
    mysql -u root -p"${DB_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" > /dev/null 2>&1
    show_progress 1.5 "Khởi tạo hệ quản trị cơ sở dữ liệu MySQL & Databases dự án"

    # --------------------------------------
    # BƯỚC 5: TẢI CODE & PHÂN VÙNG PHMYADMIN
    # --------------------------------------
    cd "$APP_DIR"
    if [ -d ".git" ]; then
        git remote set-url origin "$REPO_URL" && git pull origin main > /dev/null 2>&1
    else
        git clone "$REPO_URL" . > /dev/null 2>&1
    fi

    mkdir -p "$APP_DIR/phpmyadmin" && cd "$APP_DIR/phpmyadmin"
    wget https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.zip -O phpmyadmin.zip > /dev/null 2>&1
    unzip phpmyadmin.zip > /dev/null 2>&1
    mv phpMyAdmin-5.2.1-all-languages/* . && rm -rf phpMyAdmin-5.2.1-all-languages phpmyadmin.zip
    cp config.sample.inc.js config.inc.js || true
    show_progress 2.5 "Đồng bộ source code sàn từ Git & Tải thư viện phpMyAdmin từ xa"

    # --------------------------------------
    # BƯỚC 6: GHI ĐÈ CẤU HÌNH .ENV TOÀN DIỆN
    # --------------------------------------
    # Backend Laravel
    cd "$APP_DIR/Tradexpro-AdminPortal"
    composer install --no-interaction --prefer-dist --optimize-autoloader > /dev/null 2>&1
    cp -n .env.example .env || true
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_ROOT_PASS}/" .env
    sed -i "s/DB_DATABASE=.*/DB_DATABASE=laravel/" .env
    sed -i "s|APP_URL=.*|APP_URL=http://127.0.0.1:8000|" .env
    php artisan key:generate --force > /dev/null 2>&1
    chmod -R 775 storage bootstrap/cache && chown -R root:www-data storage bootstrap/cache
    php artisan migrate --seed --force > /dev/null 2>&1

    # Frontend Next.js
    cd "$APP_DIR/Tradexpro-UserPortal"
    npm install --legacy-peer-deps > /dev/null 2>&1
    cp -n .env.example .env.local || true
    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api|" .env.local
    if [ "$USER_PORTAL_MODE" = "production" ]; then npm run build > /dev/null 2>&1; fi

    # Node Wallet
    cd "$APP_DIR/Tradexpro-NodeWallet"
    npm install > /dev/null 2>&1 && cp -n .env.example .env || true
    sed -i "s/DB_PASS=.*/DB_PASS=${DB_ROOT_PASS}/" .env
    show_progress 3.0 "Tự động thiết lập, điền thông tin hợp lệ vào tệp tin hệ thống .env"

    # --------------------------------------
    # BƯỚC 7: KHỞI CHẠY PM2 & MỞ TƯỜNG LỬA
    # --------------------------------------
    pm2 delete all 2>/dev/null || true
    pm2 start "php artisan serve --host=127.0.0.1 --port=8000" --name "admin-portal" --cwd "$APP_DIR/Tradexpro-AdminPortal" > /dev/null 2>&1
    pm2 start "php -S 0.0.0.0:8080" --name "phpmyadmin" --cwd "$APP_DIR/phpmyadmin" > /dev/null 2>&1

    if [ "$USER_PORTAL_MODE" = "production" ]; then
        pm2 start npm --name "user-portal" --cwd "$APP_DIR/Tradexpro-UserPortal" -- start > /dev/null 2>&1
    else
        pm2 start npm --name "user-portal" --cwd "$APP_DIR/Tradexpro-UserPortal" -- run dev > /dev/null 2>&1
    fi
    pm2 start npm --name "wallet-service" --cwd "$APP_DIR/Tradexpro-NodeWallet" -- start > /dev/null 2>&1
    pm2 save > /dev/null 2>&1 && env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root > /dev/null 2>&1
    
    ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 3000/tcp && ufw allow 8000/tcp && ufw allow 8080/tcp && ufw allow 8934/tcp > /dev/null 2>&1
    echo "y" | ufw enable > /dev/null 2>&1
    show_progress 2.0 "Khởi chạy các Modules qua PM2 và cấu hình UFW Firewall Rules"
fi

# ==========================================
# CHU TRÌNH KIỂM ĐỊNH LẮNG NGHE CHẶT CHẼ (HEALTH CHECK)
# ==========================================
echo -e "${YELLOW}==> ĐANG TIẾN HÀNH THỬ NGHIỆM ĐỌC URL VÀ CÁC TRÌNH LẮNG NGHE THỰC TẾ...${NC}"
sleep 5 

CHECK_ADMIN=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000 || echo "000")
CHECK_USER=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || echo "000")
CHECK_PMA=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080 || echo "000")
CHECK_WALLET=$(lsof -i :8934 > /dev/null && echo "200" || echo "000")

if [ "$CHECK_ADMIN" != "200" ] && [ "$CHECK_ADMIN" != "302" ]; then
    echo -e "${RED}[❌] Thất bại: Admin Backend (Port 8000) không phản hồi đúng mã HTTP. Gõ 'pm2 logs admin-portal'.${NC}"
    exit 1
fi
if [ "$CHECK_USER" != "200" ] && [ "$CHECK_USER" != "304" ]; then
    echo -e "${RED}[❌] Thất bại: User Frontend (Port 3000) không phản hồi qua Curl. Gõ 'pm2 logs user-portal'.${NC}"
    exit 1
fi
if [ "$CHECK_PMA" != "200" ] && [ "$CHECK_PMA" != "302" ]; then
    echo -e "${RED}[❌] Thất bại: phpMyAdmin (Port 8080) không thể tải giao diện.${NC}"
    exit 1
fi
if [ "$CHECK_WALLET" != "200" ]; then
    echo -e "${RED}[❌] Thất bại: Cổng API Wallet (Port 8934) chưa ở trạng thái lắng nghe dịch vụ.${NC}"
    exit 1
fi

# ==========================================
# XUẤT KẾT QUẢ BÁO CÁO CUỐI CÙNG (CHỈ KHI THÀNH CÔNG)
# ==========================================
VPS_IP=$(curl -s ifconfig.me || echo "VPS_IP")

echo -e "\n${GREEN}==================================================================${NC}"
echo -e "${GREEN}   ✔ XÁC MINH HOÀN TẤT: TẤT CẢ WEBSITE VÀ DỊCH VỤ CHẠY THÀNH CÔNG!${NC}"
echo -e "${GREEN}==================================================================${NC}"

echo -e "\n🌐 ${BOLD}${YELLOW}ĐƯỜNG DẪN TRUY CẬP WEBSITE CÁC CỔNG TRÊN TRÌNH DUYỆT:${NC}"
echo -e " 🖥️  ${BOLD}Giao diện Người dùng (UserPortal):${NC}    http://${VPS_IP}:3000"
echo -e " ⚙️  ${BOLD}Trang Quản trị Hệ thống (AdminPortal):${NC}   http://${VPS_IP}:8000/admin"
echo -e " 🗃️  ${BOLD}Giao diện Quản lý DB (phpMyAdmin):${NC}       http://${VPS_IP}:8080"
echo -e " 🔌 ${BOLD}Cổng Blockchain API (Wallet Node):${NC}      http://${VPS_IP}:8934"

echo -e "\n🔑 ${BOLD}${YELLOW}THÔNG TIN TÀI KHOẢN ĐĂNG NHẬP MẶC ĐỊNH (DATABASE SEEDED):${NC}"
echo -e " ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e " 👤 ${BOLD}Tài khoản Quản trị viên (Admin Sàn):${NC}"
echo -e "    • ${BOLD}URL đăng nhập :${NC} ${GREEN}http://${VPS_IP}:8000/admin${NC}"
echo -e "    • ${BOLD}Email chính   :${NC} admin@email.com"
echo -e "    • ${BOLD}Mật khẩu      :${NC} 123456"
echo -e " ──────────────────────────────────────────────────────────────────"
echo -e " 🗄️  ${BOLD}Tài khoản Quản lý Cơ sở dữ liệu (phpMyAdmin):${NC}"
echo -e "    • ${BOLD}URL đăng nhập :${NC} ${GREEN}http://${VPS_IP}:8080${NC}"
echo -e "    • ${BOLD}User kết nối  :${NC} root"
echo -e "    • ${BOLD}Mật khẩu (Pass):${NC} ${RED}${DB_ROOT_PASS}${NC}"
echo -e " ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "\n${GREEN}Chúc mừng bạn! Dự án [${PROJECT_NAME}] của tác giả [${AUTHOR_NAME}] đã online hoàn toàn tự động!${NC}\n"

pm2 status
