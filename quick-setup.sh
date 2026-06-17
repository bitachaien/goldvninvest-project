#!/bin/bash

# Tradex24 Exchange - Quick Setup Script for Ubuntu Server
# This script automates the initial setup process

set -e  # Exit on error

echo "=========================================="
echo "Tradex24 Exchange - Quick Setup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Check if we're in the correct directory
if [ ! -d "Tradexpro-AdminPortal" ] || [ ! -d "Tradexpro-UserPortal" ] || [ ! -d "Tradexpro-NodeWallet" ]; then
    print_error "Please run this script from /var/app directory"
    exit 1
fi

echo "Step 1: Checking system requirements..."
echo "----------------------------------------"

# Check PHP
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
    print_success "PHP $PHP_VERSION installed"
else
    print_error "PHP is not installed"
    exit 1
fi

# Check Composer
if command -v composer &> /dev/null; then
    COMPOSER_VERSION=$(composer --version | cut -d " " -f 3)
    print_success "Composer $COMPOSER_VERSION installed"
else
    print_error "Composer is not installed"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js $NODE_VERSION installed"
else
    print_error "Node.js is not installed"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm $NPM_VERSION installed"
else
    print_error "npm is not installed"
    exit 1
fi

# Check MySQL
if command -v mysql &> /dev/null; then
    print_success "MySQL is installed"
else
    print_warning "MySQL is not installed. Installing..."
    sudo apt update
    sudo apt install mysql-server -y
    sudo systemctl start mysql
    sudo systemctl enable mysql
    print_success "MySQL installed and started"
fi

echo ""
echo "Step 2: Installing additional dependencies..."
echo "----------------------------------------------"

# Install PHP extensions
print_info "Installing PHP extensions..."
sudo apt install -y php-cli php-mbstring php-xml php-bcmath php-curl php-mysql php-zip php-gd php-intl unzip

# Install Redis (optional but recommended)
if ! command -v redis-cli &> /dev/null; then
    print_info "Installing Redis..."
    sudo apt install -y redis-server
    sudo systemctl start redis
    sudo systemctl enable redis
    print_success "Redis installed and started"
else
    print_success "Redis is already installed"
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    print_info "Installing PM2..."
    sudo npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 is already installed"
fi

echo ""
echo "Step 3: Database Setup"
echo "----------------------"

read -p "Enter MySQL root password: " -s MYSQL_ROOT_PASSWORD
echo ""

# Test MySQL connection
if mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    print_success "MySQL connection successful"
else
    print_error "Failed to connect to MySQL. Please check your password."
    exit 1
fi

# Create databases
print_info "Creating databases..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS demoTradeDBName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

print_success "Databases created successfully"

echo ""
echo "Step 4: Setting up Admin Portal (Laravel)..."
echo "----------------------------------------------"

cd Tradexpro-AdminPortal

# Install Composer dependencies
print_info "Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

# Copy .env file
if [ ! -f .env ]; then
    cp .env.example .env
    print_success ".env file created"

    # Update database credentials
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_ROOT_PASSWORD/" .env
    sed -i "s/DemoTradeDB_PASSWORD=.*/DemoTradeDB_PASSWORD=$MYSQL_ROOT_PASSWORD/" .env

    print_success "Database credentials updated in .env"
else
    print_warning ".env file already exists, skipping..."
fi

# Generate application key
print_info "Generating application key..."
php artisan key:generate --force

# Set permissions
print_info "Setting permissions..."
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache

# Run migrations
print_info "Running database migrations..."
php artisan migrate --force

# Seed database (optional)
read -p "Do you want to seed the database with sample data? (y/n): " SEED_DB
if [ "$SEED_DB" = "y" ] || [ "$SEED_DB" = "Y" ]; then
    php artisan db:seed --force
    print_success "Database seeded successfully"
fi

# Create storage link
php artisan storage:link

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

print_success "Admin Portal setup completed"

cd ..

echo ""
echo "Step 5: Setting up User Portal (Next.js)..."
echo "--------------------------------------------"

cd Tradexpro-UserPortal

# Install npm dependencies
print_info "Installing npm dependencies (this may take a while)..."
npm install --legacy-peer-deps

# Copy .env file
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    print_success ".env.local file created"
else
    print_warning ".env.local file already exists, skipping..."
fi

print_success "User Portal setup completed"

cd ..

echo ""
echo "Step 6: Setting up Node Wallet Service..."
echo "------------------------------------------"

cd Tradexpro-NodeWallet

# Install npm dependencies
print_info "Installing npm dependencies..."
npm install

# Copy .env file
if [ ! -f .env ]; then
    cp .env.example .env
    print_success ".env file created"
else
    print_warning ".env file already exists, skipping..."
fi

print_success "Node Wallet Service setup completed"

cd ..

echo ""
echo "=========================================="
echo "Setup completed successfully!"
echo "=========================================="
echo ""
print_success "All three modules have been set up."
echo ""
echo "Next steps:"
echo "1. Review and update .env files with your specific configuration:"
echo "   - Tradexpro-AdminPortal/.env"
echo "   - Tradexpro-UserPortal/.env.local"
echo "   - Tradexpro-NodeWallet/.env"
echo ""
echo "2. Start the services:"
echo ""
echo "   Option A: Using separate terminals"
echo "   -----------------------------------"
echo "   Terminal 1: cd /var/app/Tradexpro-AdminPortal && php artisan serve --host=0.0.0.0"
echo "   Terminal 2: cd /var/app/Tradexpro-UserPortal && npm run dev"
echo "   Terminal 3: cd /var/app/Tradexpro-NodeWallet && npm start"
echo ""
echo "   Option B: Using PM2 (recommended)"
echo "   ----------------------------------"
echo "   Run: ./start-services.sh"
echo ""
echo "3. Access the applications:"
echo "   - Admin Portal: http://localhost:8000"
echo "   - User Portal:  http://localhost:3000"
echo "   - Wallet API:   http://localhost:8934"
echo ""
print_warning "Don't forget to configure firewall if accessing from remote:"
echo "   sudo ufw allow 8000/tcp"
echo "   sudo ufw allow 3000/tcp"
echo "   sudo ufw allow 8934/tcp"
echo ""
print_success "Happy trading! 🚀"

# Made with Bob
