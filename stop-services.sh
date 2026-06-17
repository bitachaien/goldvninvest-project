#!/bin/bash

# Tradex24 Exchange - Stop All Services
# This script stops all running services managed by PM2

echo "=========================================="
echo "Stopping Tradex24 Exchange Services"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
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
    echo "PM2 is not installed. No services to stop."
    exit 0
fi

print_info "Stopping all services..."

# Stop all PM2 processes
pm2 stop all

print_success "All services stopped"

echo ""
echo "Current PM2 Status:"
echo "-------------------"
pm2 status

echo ""
echo "To completely remove all services from PM2:"
echo "  pm2 delete all"
echo ""
echo "To restart services:"
echo "  ./start-services.sh"
echo ""

# Made with Bob
