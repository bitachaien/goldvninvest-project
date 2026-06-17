# Tradexpro - Nền tảng giao dịch đa module

Một nền tảng giao dịch tiền điện tử và forex toàn diện được xây dựng với các công nghệ hiện đại. Dự án này bao gồm ba module chính: admin portal dựa trên Laravel, frontend người dùng Next.js, và dịch vụ ví Node.js.

## 📖 Tài liệu hướng dẫn

- **[QUICK_START.md](QUICK_START.md)** - ⚡ Bắt đầu nhanh trong 15 phút
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - 📚 Hướng dẫn thiết lập chi tiết đầy đủ
- **[SCRIPTS_README.md](SCRIPTS_README.md)** - 🛠️ Hướng dẫn sử dụng scripts tự động
- **[CHECKLIST.md](CHECKLIST.md)** - ✅ Danh sách kiểm tra thiết lập

## 🚀 Thiết lập nhanh

### Phương pháp 1: Tự động (Khuyến nghị)

```bash
cd /var/app
chmod +x quick-setup.sh && ./quick-setup.sh
chmod +x start-services.sh && ./start-services.sh
```

### Phương pháp 2: Thủ công

Xem hướng dẫn chi tiết trong [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 🏗️ Kiến trúc dự án

```
/var/app/
├── Tradexpro-AdminPortal/    # Laravel admin dashboard & API
├── Tradexpro-UserPortal/     # Next.js user interface
└── Tradexpro-NodeWallet/     # Node.js wallet services
```

### Tổng quan các Module

#### 1. **Tradexpro-AdminPortal** (Laravel 8+)

Admin portal và RESTful API backend phục vụ cả web và mobile clients.

**Tech Stack:**

- PHP với Laravel framework
- MySQL/PostgreSQL database
- Laravel Echo cho tính năng real-time
- Queue system cho background jobs
- PHPUnit cho testing
- PHPStan cho static analysis

**Tính năng chính:**

- Quản lý người dùng
- Quản lý phí giao dịch
- API endpoints cho transactions
- Admin dashboard
- Hỗ trợ websocket real-time

**Thiết lập:**

```bash
cd /var/app/Tradexpro-AdminPortal
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0
```

**Environment Variables:**
Cấu hình file `.env` với:

- Database credentials
- Mail configuration
- Queue settings
- API keys (BitGo, CoinPayments, etc.)
- Broadcasting credentials

---

#### 2. **Tradexpro-UserPortal** (Next.js với TypeScript)

Giao diện người dùng hiện đại, responsive được xây dựng với React và Next.js.

**Tech Stack:**

- Next.js 12+ với TypeScript
- React 18
- Tailwind CSS cho styling
- i18n cho internationalization
- Modern JavaScript/ES6+

**Tính năng chính:**

- Xác thực người dùng
- Giao diện giao dịch
- Quản lý portfolio
- Hỗ trợ đa ngôn ngữ
- Thiết kế responsive

**Thiết lập:**

```bash
cd /var/app/Tradexpro-UserPortal
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

**Environment Variables:**
Cấu hình file `.env.local` với:

- API endpoints (AdminPortal)
- Payment gateway credentials
- Analytics keys

---

#### 3. **Tradexpro-NodeWallet** (Node.js/Express)

Dịch vụ ví blockchain hỗ trợ nhiều loại tiền điện tử.

**Tech Stack:**

- Node.js với Express
- Web3.js cho blockchain interactions
- TRON configuration
- Smart contract integration

**Tính năng chính:**

- Quản lý ví
- Giao dịch tiền điện tử
- Tương tác smart contract
- Theo dõi số dư
- Hỗ trợ đa chuỗi

**Thiết lập:**

```bash
cd /var/app/Tradexpro-NodeWallet
npm install
cp .env.example .env
npm start
```

**Environment Variables:**
Cấu hình file `.env` với:

- Blockchain RPC endpoints
- TRON network configuration
- Smart contract ABIs
- API keys

---

## 🚀 Hướng dẫn nhanh

### Yêu cầu hệ thống

- Node.js 14+ và npm/yarn
- PHP 8.0+
- Composer
- MySQL 5.7+ hoặc PostgreSQL 10+
- Redis (tùy chọn, cho caching/queue)
- Ubuntu Server 20.04+ (khuyến nghị)

### Các bước cài đặt

1. **Clone repository:**

```bash
git clone https://github.com/bitachaien/Tradex24-Exchange-.git /var/app
cd /var/app
```

2. **Thiết lập MySQL:**

```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# Tạo databases
sudo mysql -u root -p << EOF
CREATE DATABASE laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
```

3. **Thiết lập từng module:**

```bash
# Admin Portal
cd /var/app/Tradexpro-AdminPortal
composer install
cp .env.example .env
# Chỉnh sửa .env với thông tin database
php artisan key:generate
php artisan migrate --seed

# User Portal
cd /var/app/Tradexpro-UserPortal
npm install --legacy-peer-deps
cp .env.example .env.local
# Chỉnh sửa .env.local với API endpoints

# Node Wallet
cd /var/app/Tradexpro-NodeWallet
npm install
cp .env.example .env
```

4. **Chạy các dịch vụ:**

**Phương pháp 1: Sử dụng 3 terminal riêng biệt**

```bash
# Terminal 1: Admin Portal
cd /var/app/Tradexpro-AdminPortal
php artisan serve --host=0.0.0.0

# Terminal 2: User Portal
cd /var/app/Tradexpro-UserPortal
npm run dev

# Terminal 3: Node Wallet
cd /var/app/Tradexpro-NodeWallet
npm start
```

**Phương pháp 2: Sử dụng PM2 (Khuyến nghị)**

```bash
sudo npm install -g pm2

pm2 start "php artisan serve --host=0.0.0.0" --name admin-portal --cwd /var/app/Tradexpro-AdminPortal
pm2 start npm --name user-portal --cwd /var/app/Tradexpro-UserPortal -- run dev
pm2 start npm --name wallet-service --cwd /var/app/Tradexpro-NodeWallet -- start

pm2 status
pm2 logs
pm2 save
pm2 startup
```

Truy cập các ứng dụng tại:

- Admin Portal: `http://localhost:8000` hoặc `http://YOUR_SERVER_IP:8000`
- User Portal: `http://localhost:3000` hoặc `http://YOUR_SERVER_IP:3000`
- API: `http://localhost:8000/api`
- Wallet Service: `http://localhost:8934` hoặc `http://YOUR_SERVER_IP:8934`

---

## 📋 Cấu trúc dự án

### Cấu trúc AdminPortal

```
app/
├── Http/              # Controllers, Middleware, Requests
├── Model/             # Eloquent Models
├── Services/          # Business logic
├── Jobs/              # Queue jobs
├── Events/            # Event listeners
├── Console/           # Artisan commands
├── Validators/        # Custom validators
└── Helper/            # Helper functions

config/               # Configuration files
database/             # Migrations and seeds
routes/               # API and web routes
resources/views/      # Blade templates
tests/                # Test suites
```

### Cấu trúc UserPortal

```
pages/                # Next.js pages
components/           # React components
lib/                  # Utility functions
helpers/              # Helper functions
hooks/                # Custom React hooks
service/              # API client services
state/                # State management
locales/              # i18n translations
public/               # Static assets
```

### Cấu trúc NodeWallet

```
src/
├── controllers/      # Request handlers
├── services/         # Business logic
├── route/            # API routes
├── middleware/       # Express middleware
├── helpers/          # Utility functions
├── validator/        # Input validation
└── views/            # Response templates
```

---

## 🔧 Cấu hình

### Files môi trường

Mỗi module có file `.env.example`. Copy sang `.env` và cập nhật giá trị:

```bash
# AdminPortal
cp /var/app/Tradexpro-AdminPortal/.env.example /var/app/Tradexpro-AdminPortal/.env

# UserPortal
cp /var/app/Tradexpro-UserPortal/.env.example /var/app/Tradexpro-UserPortal/.env.local

# NodeWallet
cp /var/app/Tradexpro-NodeWallet/.env.example /var/app/Tradexpro-NodeWallet/.env
```

### Thiết lập Database

```bash
# AdminPortal (Laravel)
cd /var/app/Tradexpro-AdminPortal
php artisan migrate          # Chạy migrations
php artisan db:seed          # Seed dữ liệu mẫu
```

---

## 🧪 Testing

### AdminPortal (Laravel)

```bash
cd /var/app/Tradexpro-AdminPortal
php artisan test                    # Chạy tất cả tests
php artisan test --filter=TestName  # Chạy test cụ thể
```

### Code Quality

```bash
# PHPStan static analysis
cd /var/app/Tradexpro-AdminPortal
./vendor/bin/phpstan analyse

# Run linters
npm run lint  # trong UserPortal
```

---

## 📚 Tài liệu API

### Các Endpoints có sẵn

AdminPortal cung cấp RESTful API endpoints:

- **Authentication:** `/api/auth/*`
- **Users:** `/api/users/*`
- **Trading:** `/api/trades/*`
- **Wallet:** `/api/wallet/*`
- **Orders:** `/api/orders/*`

Xem `Tradexpro-AdminPortal/routes/api.php` để biết tài liệu endpoint đầy đủ.

---

## 🔐 Các cân nhắc về bảo mật

1. **Environment Variables:** Không bao giờ commit file `.env`. Sử dụng `.env.example` làm template.
2. **API Keys:** Lưu trữ an toàn chỉ trong environment variables.
3. **Database:** Sử dụng mật khẩu mạnh và hạn chế quyền truy cập database.
4. **CORS:** Cấu hình phù hợp cho domain của bạn.
5. **SSL/TLS:** Bật HTTPS trong production.
6. **Input Validation:** Tất cả inputs đều được validate (xem thư mục `Validators/` và `validator/`).
7. **Firewall:** Chỉ mở các ports cần thiết:

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 🌐 Triển khai Production

### Sử dụng PM2 (Khuyến nghị)

```bash
# Cài đặt PM2
sudo npm install -g pm2

# Khởi động các dịch vụ
pm2 start ecosystem.config.js

# Hoặc thủ công:
pm2 start "php artisan serve --host=0.0.0.0" --name admin-portal --cwd /var/app/Tradexpro-AdminPortal
pm2 start npm --name user-portal --cwd /var/app/Tradexpro-UserPortal -- run start
pm2 start npm --name wallet-service --cwd /var/app/Tradexpro-NodeWallet -- start

# Tự động khởi động khi reboot
pm2 startup
pm2 save
```

### Sử dụng Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/tradexpro
server {
    listen 80;
    server_name goldvninvest.online taxi379.online;

    # User Portal
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin Portal API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### SSL với Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d goldvninvest.online -d taxi379.online -d api.taxi379.online
```

---

## 🐳 Docker Deployment (Tùy chọn)

Tạo file `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: laravel
    volumes:
      - mysql_data:/var/lib/mysql

  admin-portal:
    build: ./Tradexpro-AdminPortal
    ports:
      - '8000:8000'
    depends_on:
      - mysql

  user-portal:
    build: ./Tradexpro-UserPortal
    ports:
      - '3000:3000'

  wallet-service:
    build: ./Tradexpro-NodeWallet
    ports:
      - '8934:8934'

volumes:
  mysql_data:
```

Chạy với Docker:

```bash
docker-compose up -d
```

---

## 📝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp cho dự án! Để đóng góp:

1. **Fork repository**
2. **Tạo branch mới** cho tính năng của bạn:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit thay đổi** của bạn:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push lên branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Mở Pull Request**

### Hướng dẫn đóng góp

- Tuân thủ coding standards của từng module
- Viết tests cho code mới
- Cập nhật documentation khi cần thiết
- Đảm bảo tất cả tests pass trước khi submit PR
- Sử dụng commit messages rõ ràng và mô tả

### Thiết lập Git cho các module riêng biệt

Nếu bạn muốn quản lý từng module trong repository riêng:

```bash
# AdminPortal
cd /var/app/Tradexpro-AdminPortal
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin <your-admin-portal-repo-url>
git push -u origin main

# UserPortal
cd /var/app/Tradexpro-UserPortal
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin <your-user-portal-repo-url>
git push -u origin main

# NodeWallet
cd /var/app/Tradexpro-NodeWallet
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin <your-wallet-repo-url>
git push -u origin main
```

---

## 📖 Tài liệu bổ sung

Để biết hướng dẫn chi tiết, xem:

- **SETUP_GUIDE.md** - Hướng dẫn thiết lập đầy đủ và xử lý sự cố
- **QUICK_START.md** - Tham khảo nhanh để khởi động
- **CHECKLIST.md** - Danh sách kiểm tra thiết lập chi tiết
- Các file README riêng của từng module

---

## 🆘 Xử lý sự cố

### Các vấn đề thường gặp

**MySQL không kết nối được:**

```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

**Port đã được sử dụng:**

```bash
sudo lsof -i :8000
sudo lsof -i :3000
sudo lsof -i :8934
```

**Permission errors:**

```bash
cd /var/app/Tradexpro-AdminPortal
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache
```

**Composer dependencies issues:**

```bash
cd /var/app/Tradexpro-AdminPortal
composer clear-cache
composer install --no-cache
```

**NPM installation issues:**

```bash
# UserPortal
cd /var/app/Tradexpro-UserPortal
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# NodeWallet
cd /var/app/Tradexpro-NodeWallet
rm -rf node_modules package-lock.json
npm install
```

**Kiểm tra logs:**

- Laravel: `/var/app/Tradexpro-AdminPortal/storage/logs/`
- Next.js: Terminal output hoặc `.next/` directory
- Node Wallet: Terminal output
- System: `sudo journalctl -u mysql`
- PM2: `pm2 logs`

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, câu hỏi, hoặc muốn đóng góp:

1. Kiểm tra **SETUP_GUIDE.md** để biết hướng dẫn xử lý sự cố chi tiết
2. Xem logs trong `storage/logs/` (Admin Portal)
3. Kiểm tra browser console cho lỗi frontend
4. Kiểm tra terminal output cho lỗi backend
5. Mở issue trên GitHub repository với thông tin chi tiết:
   - Mô tả vấn đề
   - Các bước tái hiện
   - Log files liên quan
   - Môi trường (OS, PHP version, Node version, etc.)

---

## 📄 License

Dự án này được cấp phép theo giấy phép MIT - xem file LICENSE để biết chi tiết.

---

## 🔗 Liên kết hữu ích

- **GitHub Repository:** [Tradex24-Exchange-](https://github.com/bitachaien/Tradex24-Exchange-.git)
- **Documentation:** Xem các file README trong từng module
- **Issues:** [GitHub Issues](https://github.com/bitachaien/Tradex24-Exchange-/issues)
- **Laravel Documentation:** https://laravel.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Express Documentation:** https://expressjs.com/

---

## 👥 Đội ngũ phát triển

Dự án được phát triển và duy trì bởi đội ngũ Tradex24.

### Core Contributors

- Backend Development (Laravel)
- Frontend Development (Next.js)
- Blockchain Integration (Node.js)
- DevOps & Infrastructure

---

## 🎯 Roadmap

### Version 3.2.0 (Q3 2026)

- [ ] Thêm hỗ trợ cho nhiều blockchain hơn (Solana, Polygon)
- [ ] Cải thiện UI/UX với Material Design 3
- [ ] Thêm tính năng trading bot với AI

### Version 3.3.0 (Q4 2026)

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard với real-time charts
- [ ] Multi-signature wallet support

### Version 4.0.0 (2027)

- [ ] Decentralized exchange (DEX) integration
- [ ] NFT marketplace
- [ ] Social trading features
- [ ] Advanced risk management tools

---

## 📊 Thống kê dự án

- **Ngôn ngữ chính:** PHP, TypeScript, JavaScript
- **Framework:** Laravel 8+, Next.js 12+, Express 4+
- **Database:** MySQL 8.0
- **Deployment:** Ubuntu Server 20.04+, PM2, Nginx
- **Testing:** PHPUnit, Jest
- **Code Quality:** PHPStan, ESLint

---

## 🌟 Features Highlights

### Trading Features

- ✅ Spot Trading
- ✅ Futures Trading
- ✅ Stop-Loss & Take-Profit Orders
- ✅ Market & Limit Orders
- ✅ Real-time Price Updates
- ✅ Advanced Charting (TradingView)

### Wallet Features

- ✅ Multi-Currency Support
- ✅ Deposit & Withdrawal
- ✅ Internal Transfers
- ✅ Transaction History
- ✅ Address Whitelisting
- ✅ Multi-Network Support (ERC20, TRC20, BEP20)

### Security Features

- ✅ Two-Factor Authentication (2FA)
- ✅ Email Verification
- ✅ KYC/AML Compliance
- ✅ IP Whitelisting
- ✅ Withdrawal Confirmation
- ✅ Anti-Phishing Code

### Admin Features

- ✅ User Management
- ✅ Transaction Monitoring
- ✅ Fee Management
- ✅ Coin/Token Management
- ✅ Trading Pair Configuration
- ✅ System Settings
- ✅ Analytics & Reports

---

## 🔄 Version History

### Version 3.1.7 (Current)

- Enhanced security features
- Improved performance
- Bug fixes and optimizations
- Updated dependencies

### Version 3.1.0

- Added futures trading
- Multi-network wallet support
- Enhanced admin dashboard
- API improvements

### Version 3.0.0

- Complete platform redesign
- Next.js migration for frontend
- Improved scalability
- Enhanced user experience

---

## 💡 Best Practices

### Development

- Follow PSR-12 coding standards for PHP
- Use TypeScript for type safety
- Write comprehensive tests
- Document your code
- Use meaningful commit messages

### Security

- Never commit `.env` files
- Use environment variables for sensitive data
- Keep dependencies updated
- Regular security audits
- Implement rate limiting

### Performance

- Use caching (Redis) for frequently accessed data
- Optimize database queries
- Implement lazy loading
- Use CDN for static assets
- Monitor application performance

---

**Cập nhật lần cuối:** Tháng 6, 2026

**Phiên bản:** 3.1.7

---

**Chúc bạn giao dịch thành công! 🚀 Happy Trading!**

---

## 📮 Contact

For business inquiries or support:

- Email: support@tradex24.com
- Website: https://tradex24.com
- Telegram: @tradex24support

---

_Made with ❤️ by Tradex24 Team_

---

**Made with [Bob](https://bob.build)** - AI-powered development assistant

> **Note:** If you encounter "Visual Studio Code is unable to watch for file changes" error (ENOSPC), see the [VS Code documentation](https://go.microsoft.com/fwlink/?linkid=867693) for solutions.
