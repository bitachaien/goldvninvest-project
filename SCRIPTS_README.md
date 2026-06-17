# 🚀 Tradex24 Exchange - Setup Scripts Guide

This directory contains automated scripts to simplify the setup and management of Tradex24 Exchange on Ubuntu Server.

## 📋 Available Scripts

### 1. `quick-setup.sh` - Automated Installation Script

**Purpose:** Automates the complete setup process for all three modules.

**What it does:**
- ✅ Checks system requirements (PHP, Composer, Node.js, npm)
- ✅ Installs MySQL, Redis, and PM2 if not present
- ✅ Creates required databases
- ✅ Installs dependencies for all modules
- ✅ Configures .env files
- ✅ Runs migrations and seeds
- ✅ Sets proper permissions

**Usage:**
```bash
cd /var/app
chmod +x quick-setup.sh
./quick-setup.sh
```

**Interactive prompts:**
- MySQL root password
- Whether to seed sample data
- Configuration confirmations

**Time required:** 10-15 minutes (depending on internet speed)

---

### 2. `start-services.sh` - Service Startup Script

**Purpose:** Starts all three services using PM2 process manager.

**What it does:**
- ✅ Stops any existing services
- ✅ Starts Admin Portal on port 8000
- ✅ Starts User Portal on port 3000
- ✅ Starts Wallet Service on port 8934
- ✅ Optionally starts WebSocket server
- ✅ Saves PM2 configuration

**Usage:**
```bash
cd /var/app
chmod +x start-services.sh
./start-services.sh
```

**Interactive prompts:**
- Whether to start WebSocket server

**After running:**
- All services will be running in the background
- Use `pm2 status` to check service status
- Use `pm2 logs` to view logs

---

### 3. `stop-services.sh` - Service Shutdown Script

**Purpose:** Stops all running services managed by PM2.

**What it does:**
- ✅ Stops all PM2 processes
- ✅ Shows current status

**Usage:**
```bash
cd /var/app
chmod +x stop-services.sh
./stop-services.sh
```

**Note:** This only stops services, doesn't delete them from PM2. Use `pm2 delete all` to completely remove.

---

## 🔄 Typical Workflow

### First-time Setup

```bash
# 1. Clone the repository
git clone https://github.com/bitachaien/Tradex24-Exchange-.git /var/app
cd /var/app

# 2. Run automated setup
chmod +x quick-setup.sh
./quick-setup.sh

# 3. Review and update .env files if needed
nano Tradexpro-AdminPortal/.env
nano Tradexpro-UserPortal/.env.local
nano Tradexpro-NodeWallet/.env

# 4. Start all services
chmod +x start-services.sh
./start-services.sh

# 5. Access the applications
# Admin Portal: http://localhost:8000
# User Portal: http://localhost:3000
# Wallet API: http://localhost:8934
```

### Daily Development

```bash
# Start services
./start-services.sh

# Check status
pm2 status

# View logs
pm2 logs

# Stop services when done
./stop-services.sh
```

### After System Reboot

If you configured PM2 startup (recommended):
```bash
# Services will start automatically
pm2 status
```

If not configured:
```bash
cd /var/app
./start-services.sh
```

---

## 🛠️ PM2 Commands Reference

After starting services with `start-services.sh`, you can use these PM2 commands:

### Status and Monitoring
```bash
pm2 status              # View all services status
pm2 list                # Same as status
pm2 monit               # Real-time monitoring dashboard
pm2 show admin-portal   # Detailed info about specific service
```

### Logs
```bash
pm2 logs                    # View all logs (live)
pm2 logs admin-portal       # View specific service logs
pm2 logs --lines 100        # View last 100 lines
pm2 flush                   # Clear all logs
```

### Control Services
```bash
pm2 restart all             # Restart all services
pm2 restart admin-portal    # Restart specific service
pm2 reload all              # Reload with zero-downtime
pm2 stop all                # Stop all services
pm2 delete all              # Remove all services from PM2
```

### Auto-start on Boot
```bash
pm2 startup                 # Generate startup script
pm2 save                    # Save current process list
pm2 unstartup               # Disable auto-start
```

### Advanced
```bash
pm2 describe admin-portal   # Detailed service information
pm2 reset admin-portal      # Reset restart counter
pm2 update                  # Update PM2 in-memory
```

---

## 🔍 Troubleshooting Scripts

### Script won't execute
```bash
# Make sure script is executable
chmod +x quick-setup.sh start-services.sh stop-services.sh

# Check if you're in the correct directory
pwd
# Should show: /var/app
```

### MySQL password issues
```bash
# If quick-setup.sh fails on MySQL connection
# Reset MySQL root password first
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
EXIT;

# Then run quick-setup.sh again
```

### PM2 not found
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Services won't start
```bash
# Check if ports are already in use
sudo lsof -i :8000
sudo lsof -i :3000
sudo lsof -i :8934

# Kill processes if needed
sudo kill -9 <PID>

# Try starting again
./start-services.sh
```

---

## 📝 Script Customization

### Modifying quick-setup.sh

To change default behavior, edit the script:
```bash
nano quick-setup.sh
```

Common modifications:
- Change database names (lines 60-62)
- Skip certain installation steps
- Add custom configuration

### Modifying start-services.sh

To change ports or add services:
```bash
nano start-services.sh
```

Example - Change Admin Portal port:
```bash
# Change this line:
pm2 start "php artisan serve --host=0.0.0.0" --name admin-portal

# To:
pm2 start "php artisan serve --host=0.0.0.0 --port=8001" --name admin-portal
```

---

## 🔐 Security Notes

1. **Never commit .env files** - They contain sensitive information
2. **Use strong MySQL passwords** - Especially in production
3. **Configure firewall** - Only open necessary ports
4. **Keep scripts updated** - Pull latest changes regularly
5. **Review logs regularly** - Check `pm2 logs` for issues

---

## 📞 Getting Help

If scripts fail or you encounter issues:

1. **Check the logs:**
   ```bash
   pm2 logs
   tail -f /var/app/Tradexpro-AdminPortal/storage/logs/laravel.log
   ```

2. **Review SETUP_GUIDE.md** - Comprehensive troubleshooting section

3. **Manual setup** - Follow step-by-step instructions in SETUP_GUIDE.md

4. **Check system resources:**
   ```bash
   free -h    # Memory
   df -h      # Disk space
   top        # CPU usage
   ```

---

## 🎯 Best Practices

1. **Always backup before updates:**
   ```bash
   # Backup databases
   mysqldump -u root -p laravel > backup_laravel.sql
   mysqldump -u root -p demoTradeDBName > backup_demo.sql
   ```

2. **Test in development first:**
   - Use `APP_ENV=local` in .env
   - Enable `APP_DEBUG=true` for detailed errors

3. **Monitor services regularly:**
   ```bash
   pm2 monit  # Real-time monitoring
   ```

4. **Keep dependencies updated:**
   ```bash
   cd /var/app/Tradexpro-AdminPortal
   composer update

   cd /var/app/Tradexpro-UserPortal
   npm update
   ```

---

## 📊 Script Execution Flow

### quick-setup.sh Flow
```
1. Check system requirements
   ├── PHP version
   ├── Composer
   ├── Node.js
   └── npm

2. Install missing tools
   ├── MySQL
   ├── Redis
   └── PM2

3. Setup databases
   ├── Create laravel DB
   └── Create demoTradeDBName DB

4. Setup Admin Portal
   ├── composer install
   ├── Configure .env
   ├── Generate key
   ├── Run migrations
   └── Seed data (optional)

5. Setup User Portal
   ├── npm install
   └── Configure .env.local

6. Setup Wallet Service
   ├── npm install
   └── Configure .env

7. Display next steps
```

### start-services.sh Flow
```
1. Check PM2 installed
2. Stop existing services
3. Start Admin Portal (port 8000)
4. Start User Portal (port 3000)
5. Start Wallet Service (port 8934)
6. Start WebSocket (optional)
7. Save PM2 configuration
8. Display status and commands
```

---

**Last Updated:** June 2026

**Version:** 1.0.0

**Maintained by:** Tradex24 Team

---

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
