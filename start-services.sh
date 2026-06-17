#!/bin/bash

# Tradex24 Exchange - Start All Services with PM2
# This script starts all three services using PM2 process manager

set -e

echo "=========================================="
echo "Starting Tradex24 Exchange Services"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed. Installing..."
    sudo npm install -g pm2
    print_success "PM2 installed"
fi

# Get the current directory
CURRENT_DIR=$(pwd)

# Check if we're in the correct directory
if [ ! -d "Tradexpro-AdminPortal" ] || [ ! -d "Tradexpro-UserPortal" ] || [ ! -d "Tradexpro-NodeWallet" ]; then
    echo "Error: Please run this script from /var/app directory"
    exit 1
fi

print_info "Stopping any existing services..."
pm2 delete admin-portal 2>/dev/null || true
pm2 delete user-portal 2>/dev/null || true
pm2 delete wallet-service 2>/dev/null || true
pm2 delete websockets 2>/dev/null || true

echo ""
print_info "Starting Admin Portal (Laravel)..."
cd "$CURRENT_DIR/Tradexpro-AdminPortal"
pm2 start "php artisan serve --host=0.0.0.0" --name admin-portal
print_success "Admin Portal started on port 8000"

echo ""
print_info "Starting User Portal (Next.js)..."
cd "$CURRENT_DIR/Tradexpro-UserPortal"
pm2 start npm --name user-portal -- run dev
print_success "User Portal started on port 3000"

echo ""
print_info "Starting Wallet Service (Node.js)..."
cd "$CURRENT_DIR/Tradexpro-NodeWallet"
pm2 start npm --name wallet-service -- start
print_success "Wallet Service started on port 8934"

# Optional: Start WebSocket server
read -p "Do you want to start Laravel WebSocket server? (y/n): " START_WS
if [ "$START_WS" = "y" ] || [ "$START_WS" = "Y" ]; then
    cd "$CURRENT_DIR/Tradexpro-AdminPortal"
    pm2 start "php artisan websockets:serve" --name websockets
    print_success "WebSocket server started on port 6001"
fi

echo ""
print_info "Saving PM2 process list..."
pm2 save

echo ""
print_success "All services started successfully!"
echo ""
echo "=========================================="
echo "Service Status"
echo "=========================================="
pm2 status

echo ""
echo "Useful PM2 Commands:"
echo "--------------------"
echo "  pm2 status              - View all services status"
echo "  pm2 logs                - View all logs"
echo "  pm2 logs admin-portal   - View specific service logs"
echo "  pm2 restart all         - Restart all services"
echo "  pm2 stop all            - Stop all services"
echo "  pm2 delete all          - Remove all services"
echo "  pm2 monit               - Monitor services in real-time"
echo ""
echo "Access URLs:"
echo "------------"
echo "  Admin Portal:  http://localhost:8000"
echo "  User Portal:   http://localhost:3000"
echo "  Wallet API:    http://localhost:8934"
echo ""
echo "To enable auto-start on system reboot:"
echo "  pm2 startup"
echo "  pm2 save"
echo ""
print_success "Happy trading! 🚀"

# Made with Bob
