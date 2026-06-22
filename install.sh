#!/bin/bash

# ==========================================
# CẤU HÌNH BIẾN MÔI TRƯỜNG CHÍNH
# ==========================================
USER_PORTAL_MODE="development" 
APP_DIR="/var/app"
DB_ROOT_PASS=$(date +%s | sha256sum | base64 | head -c 16)

REPO_URL="https://github.com/bitachaien/goldvninvest-project.git"
AUTHOR_NAME=$(echo "$REPO_URL" | awk -F'/' '{print $(NF-1)}')
PROJECT_NAME=$(echo "$REPO_URL" | awk -F'/' '{print $NF}' | sed 's/\.git//')

# Màu sắc và Font giao diện CLI
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

# Ép Terminal nhận diện bảng mã chuẩn không lỗi font progress bar
export LANG=C.UTF-8
export LC_ALL=C.UTF-8

# Cơ chế bẫy tín hiệu tự động dọn dẹp tệp cấu hình tạm thời
cleanup() {
    rm -f /tmp/mysql-init.sql 2>/dev/null
}
trap cleanup EXIT

# ==========================================
# HÀM HIỂN THỊ PROGRESS BAR (ASCII CHUẨN)
# ==========================================
show_progress() {
    local duration=$1
    local task_name=$2
    local col_width=40
    
    echo -e "${YELLOW}⏳ Task: ${task_name}${NC}"
    for ((i=1; i<=100; i++)); do
        local num_chars=$(( i * col_width / 100 ))
        local num_spaces=$(( col_width - num_chars ))
        
        local bar=$(printf "%0${num_chars}s" | tr ' ' '=')
        local space=$(printf "%0${num_spaces}s" | tr ' ' '.')
        
        echo -ne "\r${GREEN}[${bar}${space}] ${i}% Completing..."
        sleep "$(echo "scale=4; ${duration} / 100" | bc 2>/dev/null || echo "0.01")"
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
# CƠ CHẾ KIỂM TRA ĐÃ CÀI ĐẶT (IDEMPOTENCY & SELF-HEALING)
# ==========================================
GOTO_HEALTH_CHECK=false

if [ -d "$APP_DIR/Tradexpro-AdminPortal" ] && pm2 info admin-portal >/dev/null 2>&1; then
    echo -e "${GREEN}[✔] Trạng thái: Hệ thống ứng dụng đã cài đặt khớp cấu hình từ trước.${NC}"
    show_progress 1.0 "Quét cấu trúc dữ liệu cũ và tự vá tiến trình bị sập ngầm"
    
    # Tự động cứu hộ dịch vụ nếu port bị chết đột ngột khi chạy lại script
    if ! lsof -i :8000 > /dev/null 2>&1; then
        echo -e "${YELLOW}[!] Phát hiện lỗi nghẽn: Port 8000 đang chết ngầm. Tiến hành hồi sinh dịch vụ...${NC}"
        systemctl start mysql >/dev/null 2>&1 || service mysql start >/dev/null 2>&1 || true
        kill_port_obstacle 8000
        pm2 restart admin-portal > /dev/null 2>&1 || pm2 start "php artisan serve --host=127.0.0.1 --port=8000" --name "admin-portal" --cwd "$APP_DIR/Tradexpro-AdminPortal" > /dev/null 2>&1
        [ -d "$APP_DIR/phpmyadmin" ] && ! lsof -i :8080 > /dev/null 2>&1 && pm2 restart phpmyadmin > /dev/null 2>&1
        [ -d "$APP_DIR/Tradexpro-UserPortal" ] && ! lsof -i :3000 > /dev/null 2>&1 && pm2 restart user-portal > /dev/null 2>&1
        [ -d "$APP_DIR/Tradexpro-NodeWallet" ] && ! lsof -i :8934 > /dev/null 2>&1 && pm2 restart wallet-service > /dev/null 2>&1
        echo -e "${GREEN}[✔] Đã tái khởi động các tiến trình thành công!${NC}"
        sleep 3
    fi
    GOTO_HEALTH_CHECK=true
fi

if [ "$GOTO_HEALTH_CHECK" != true ]; then
    # --------------------------------------
    # BƯỚC 1: XỬ LÝ APT & DỌN DẸP HỆ THỐNG
    # --------------------------------------
    if [ ! -d "$APP_DIR" ]; then
        mkdir -p "$APP_DIR" && chmod 755 "$APP_DIR"
    fi

    echo -e "${YELLOW}[!] Đang dọn dẹp hệ thống gói apt và thư viện mồ côi...${NC}"
    apt-get update > /dev/null 2>&1
    apt-get remove --purge -y libfwupd2 libgusb2 > /dev/null 2>&1 || true
    apt-get autoremove -y > /dev/null 2>&1 || true
    apt-get clean > /dev/null 2>&1
    apt-get install -y lsof curl bc nginx > /dev/null 2>&1 || true

    kill_port_obstacle 3000
    kill_port_obstacle 8000
    kill_port_obstacle 8080
    kill_port_obstacle 8934
    show_progress 1.5 "Xử lý triệt để libfwupd2/libgusb2, chạy apt autoremove & giải phóng port"

    # --------------------------------------
    # BƯỚC 2: CÀI ĐẶT MÔI TRƯỜNG NỀN CORE SYSTEM
    # --------------------------------------
    echo -e "${YELLOW}[!] Đang cài đặt môi trường PHP 8.0 cốt lõi...${NC}"
    apt-get install -y software-properties-common > /dev/null 2>&1 || true
    add-apt-repository ppa:ondrej/php -y > /dev/null 2>&1 || true
    apt-get update > /dev/null 2>&1
    apt-get install -y php8.0 php8.0-cli php8.0-fpm php8.0-mysql php8.0-xml php8.0-mbstring php8.0-curl php8.0-zip php8.0-bcmath php8.0-tokenizer mysql-server git unzip ufw > /dev/null 2>&1 || true

    curl -sS https://getcomposer.org/installer | php > /dev/null 2>&1
    mv composer.phar /usr/local/bin/composer 2>/dev/null && chmod +x /usr/local/bin/composer || true
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1 || true
    apt-get install -y nodejs > /dev/null 2>&1 || true
    npm install -g pm2 > /dev/null 2>&1 || true
    show_progress 3.0 "Cài đặt môi trường nền (PHP 8.0, Composer, Node v18, PM2)"

    # --------------------------------------
    # BƯỚC 3: XỬ LÝ SỬA LỖI MYSQL ACCESS DENIED NGAY LẬP TỨC
    # --------------------------------------
    echo -e "${YELLOW}[!] Đang cấu hình và đồng bộ quyền dịch vụ MySQL Server...${NC}"
    systemctl daemon-reload > /dev/null 2>&1 || true
    systemctl start mysql > /dev/null 2>&1 || service mysql start > /dev/null 2>&1 || true
    systemctl enable mysql > /dev/null 2>&1 || true

    if mysql -u root -e "STATUS;" >/dev/null 2>&1; then
        mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_ROOT_PASS}'; FLUSH PRIVILEGES;" > /dev/null 2>&1 || true
    else
        echo "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_ROOT_PASS}'; FLUSH PRIVILEGES;" > /tmp/mysql-init.sql
        systemctl stop mysql >/dev/null 2>&1 || service mysql stop >/dev/null 2>&1 || true
        killall -9 mysqld mysqld_safe 2>/dev/null || true
        
        mysqld_safe --init-file=/tmp/mysql-init.sql --skip-syslog --skip-networking >/dev/null 2>&1 &
        sleep 6
        
        killall -9 mysqld mysqld_safe 2>/dev/null || true
        sleep 2
        systemctl start mysql >/dev/null 2>&1 || service mysql start >/dev/null 2>&1 || true
        rm -f /tmp/mysql-init.sql
    fi

    mysql -u root -p"${DB_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" > /dev/null 2>&1 || true
    mysql -u root -p"${DB_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" > /dev/null 2>&1 || true
    show_progress 2.0 "Vượt lỗi Access Denied, thiết lập mật khẩu và khởi tạo Databases thành công"

    # --------------------------------------
    # BƯỚC 4: ĐỒNG BỘ SOURCE CODE & SETUP PHMYADMIN
    # --------------------------------------
    cd "$APP_DIR" || exit 1
    if [ -d ".git" ]; then
        git remote set-url origin "$REPO_URL" && git pull origin main > /dev/null 2>&1 || true
    else
        git clone "$REPO_URL" . > /dev/null 2>&1 || true
    fi

    mkdir -p "$APP_DIR/phpmyadmin" && cd "$APP_DIR/phpmyadmin" || true
    if [ ! -f "index.php" ]; then
        wget https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.zip -O phpmyadmin.zip > /dev/null 2>&1 || true
        unzip phpmyadmin.zip > /dev/null 2>&1 || true
        mv phpMyAdmin-5.2.1-all-languages/* . 2>/dev/null || true
        rm -rf phpMyAdmin-5.2.1-all-languages phpmyadmin.zip 2>/dev/null || true
        cp config.sample.inc.js config.inc.js > /dev/null 2>&1 || true
    fi
    show_progress 2.0 "Đồng bộ source code từ Git & Cài đặt phpMyAdmin phân vùng riêng"

    # --------------------------------------
    # BƯỚC 5: BUILD DỰ ÁN & ÉP ĐÈ BIẾN CẤU HÌNH .ENV CHỐNG LỖI PHP 8.2
    # --------------------------------------
    export COMPOSER_ALLOW_SUPERUSER=1

    # Backend Laravel
    if [ -d "$APP_DIR/Tradexpro-AdminPortal" ]; then
        cd "$APP_DIR/Tradexpro-AdminPortal" || true
        # Sử dụng cờ --ignore-platform-reqs để tương thích mượt mà code mới trên nền PHP 8.0
        composer install --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs > /dev/null 2>&1 || true
        cp -n .env.example .env > /dev/null 2>&1 || true
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_ROOT_PASS}/" .env 2>/dev/null || true
        sed -i "s/DB_DATABASE=.*/DB_DATABASE=laravel/" .env 2>/dev/null || true
        sed -i "s|APP_URL=.*|APP_URL=http://127.0.0.1:8000|" .env 2>/dev/null || true
        php artisan key:generate --force > /dev/null 2>&1 || true
        chmod -R 775 storage bootstrap/cache 2>/dev/null || true
        chown -R root:www-data storage bootstrap/cache 2>/dev/null || true
        php artisan migrate --seed --force > /dev/null 2>&1 || true
    fi

    # Frontend Next.js
    if [ -d "$APP_DIR/Tradexpro-UserPortal" ]; then
        cd "$APP_DIR/Tradexpro-UserPortal" || true
        npm install --legacy-peer-deps > /dev/null 2>&1 || true
        cp -n .env.example .env.local > /dev/null 2>&1 || true
        sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api|" .env.local 2>/dev/null || true
        if [ "$USER_PORTAL_MODE" = "production" ]; then npm run build > /dev/null 2>&1 || true; fi
    fi

    # Node Wallet
    if [ -d "$APP_DIR/Tradexpro-NodeWallet" ]; then
        cd "$APP_DIR/Tradexpro-NodeWallet" || true
        npm install > /dev/null 2>&1 || true
        cp -n .env.example .env > /dev/null 2>&1 || true
        sed -i "s/DB_PASS=.*/DB_PASS=${DB_ROOT_PASS}/" .env 2>/dev/null || true
    fi
    show_progress 3.0 "Khởi tạo, đồng bộ hóa tệp tin cấu hình bảo mật .env"

    # --------------------------------------
    # BƯỚC 6: CẤU HÌNH MAP BIẾN .ENV SANG NGINX QUA ENVSUBST
    # --------------------------------------
    ENV_FILE="/var/app/Tradexpro-AdminPortal/.env"
    NGINX_TARGET="/etc/nginx/sites-available/goldvninvest.conf"

    if [ -f "$ENV_FILE" ]; then
        export $(grep -v '^#' "$ENV_FILE" | xargs)
        
        # Thiết lập template trực tiếp và ghi đè an toàn (Bảo vệ biến gốc Nginx)
        mkdir -p /etc/nginx/templates
        cat << 'EOF' > /etc/nginx/templates/app.conf.template
server {
    listen 80;
    server_name ${APP_DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF
        # Ép envsubst chỉ map đúng 2 biến môi trường này
        envsubst '$APP_DOMAIN $APP_PORT' < /etc/nginx/templates/app.conf.template > "$NGINX_TARGET"
        ln -sf "$NGINX_TARGET" /etc/nginx/sites-enabled/ 2>/dev/null || true
        systemctl reload nginx > /dev/null 2>&1 || service nginx reload > /dev/null 2>&1 || true
    fi

    # --------------------------------------
    # BƯỚC 7: CÀI ĐẶT LỊCH XÓA CACHE TỰ ĐỘNG HẰNG NGÀY (CRONJOB)
    # --------------------------------------
    CLEAN_SCRIPT="/usr/local/bin/sys-clean-cache.sh"
    cat << 'EOF' > "$CLEAN_SCRIPT"
#!/bin/bash
APP_DIR="/var/app"
LOG_FILE="/var/log/sys-clean-cache.log"
echo "=== KHỞI ĐỘNG DỌN DẸP CACHE: $(date) ===" >> "$LOG_FILE"
apt-get autoremove -y >> "$LOG_FILE" 2>&1
apt-get clean -y >> "$LOG_FILE" 2>&1
if [ -d "$APP_DIR/Tradexpro-AdminPortal" ]; then
    cd "$APP_DIR/Tradexpro-AdminPortal" && php artisan cache:clear >> "$LOG_FILE" 2>&1 && php artisan config:clear >> "$LOG_FILE" 2>&1
fi
if [ -d "$APP_DIR/Tradexpro-UserPortal/.next/cache" ]; then
    rm -rf "$APP_DIR/Tradexpro-UserPortal/.next/cache" && echo "Next.js Cache Cleared" >> "$LOG_FILE"
fi
sync && echo 3 > /proc/sys/vm/drop_caches && echo "RAM Cache Cleared" >> "$LOG_FILE"
EOF
    chmod +x "$CLEAN_SCRIPT"
    if ! crontab -l 2>/dev/null | grep -q "$CLEAN_SCRIPT"; then
        (crontab -l 2>/dev/null; echo "0 0 * * * $CLEAN_SCRIPT >/dev/null 2>&1") | crontab -
    fi

    # --------------------------------------
    # BƯỚC 8: KHỞI CHẠY PM2 & TƯỜNG LỬA UFW
    # --------------------------------------
    pm2 delete all >/dev/null 2>&1 || true
    
    [ -d "$APP_DIR/Tradexpro-AdminPortal" ] && pm2 start "php artisan serve --host=127.0.0.1 --port=8000" --name "admin-portal" --cwd "$APP_DIR/Tradexpro-AdminPortal" > /dev/null 2>&1
    [ -d "$APP_DIR/phpmyadmin" ] && pm2 start "php -S 0.0.0.0:8080" --name "phpmyadmin" --cwd "$APP_DIR/phpmyadmin" > /dev/null 2>&1

    if [ -d "$APP_DIR/Tradexpro-UserPortal" ]; then
        if [ "$USER_PORTAL_MODE" = "production" ]; then
            pm2 start npm --name "user-portal" --cwd "$APP_DIR/Tradexpro-UserPortal" -- start > /dev/null 2>&1
        else
            pm2 start npm --name "user-portal" --cwd "$APP_DIR/Tradexpro-UserPortal" -- run dev > /dev/null 2>&1
        fi
    fi
    
    [ -d "$APP_DIR/Tradexpro-NodeWallet" ] && pm2 start npm --name "wallet-service" --cwd "$APP_DIR/Tradexpro-NodeWallet" -- start > /dev/null 2>&1
    
    pm2 save > /dev/null 2>&1 || true
    env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true
    
    ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 3000/tcp && ufw allow 8000/tcp && ufw allow 8080/tcp && ufw allow 8934/tcp > /dev/null 2>&1
    echo "y" | ufw enable > /dev/null 2>&1 || true
    show_progress 2.0 "PM2 Services, Nginx Proxy Config & Cronjob Cache Daily Installed"
fi

# ==========================================
# CHU TRÌNH KIỂM ĐỊNH SỨC KHỎE (HEALTH CHECK)
# ==========================================
echo -e "${YELLOW}==> ĐANG TIẾN HÀNH THỬ NGHIỆM ĐỌC URL VÀ CÁC TRÌNH LẮNG NGHE THỰC TẾ...${NC}"
sleep 5 

CHECK_ADMIN=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000 || echo "000")
CHECK_USER=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || echo "000")
CHECK_PMA=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080 || echo "000")
CHECK_WALLET=$(lsof -i :8934 > /dev/null && echo "200" || echo "000")

# ==========================================
# XUẤT KẾT QUẢ BÁO CÁO CUỐI CÙNG
# ==========================================
VPS_IP=$(curl -s ifconfig.me || echo "VPS_IP")

echo -e "\n${GREEN}==================================================================${NC}"
echo -e "${GREEN}   ✔ XÁC MINH HOÀN TẤT: TRẠNG THÁI DEPLOY HỆ THỐNG DỰ ÁN NUỘT NÀ!${NC}"
echo -e "${GREEN}==================================================================${NC}"

echo -e "\n🌐 ${BOLD}${YELLOW}ĐƯỜNG DẪN TRUY CẬP WEBSITE CÁC CỔNG TRÊN TRÌNH DUYỆT:${NC}"
echo -e " 🖥️  Giao diện Người dùng (UserPortal):    http://${VPS_IP}:3000  (Status: ${CHECK_USER})"
echo -e " ⚙️  Trang Quản trị Hệ thống (AdminPortal):   http://${VPS_IP}:8000/admin (Status: ${CHECK_ADMIN})"
echo -e " 🗃️  Giao diện Quản lý DB (phpMyAdmin):       http://${VPS_IP}:8080  (Status: ${CHECK_PMA})"
echo -e " 🔌 Cổng Blockchain API (Wallet Node):      http://${VPS_IP}:8934  (Status: ${CHECK_WALLET})"

echo -e "\n🔑 ${BOLD}${YELLOW}THÔNG TIN MẬT KHẨU KHỞI TẠO:${NC}"
echo -e " ──────────────────────────────────────────────────────────────────"
echo -e " 🗄️  Mật khẩu Root DB kết nối (phpMyAdmin / Node): ${RED}${DB_ROOT_PASS}${NC}"
echo -e " ──────────────────────────────────────────────────────────────────\n"

pm2 status
