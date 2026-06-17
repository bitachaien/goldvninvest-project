# ⚡ Tradex24 Exchange - Quick Start Guide

Get up and running in 15 minutes!

## 🎯 Prerequisites

- Ubuntu Server 20.04+
- Root or sudo access
- Internet connection

## 🚀 One-Command Setup

```bash
cd /var/app
chmod +x quick-setup.sh && ./quick-setup.sh
```

That's it! The script will:
- ✅ Install all required tools (MySQL, Redis, PM2)
- ✅ Create databases
- ✅ Install dependencies
- ✅ Configure environment files
- ✅ Run migrations

## 🎮 Start Services

```bash
chmod +x start-services.sh && ./start-services.sh
```

## 🌐 Access Applications

- **Admin Portal:** http://localhost:8000
- **User Portal:** http://localhost:3000
- **Wallet API:** http://localhost:8934

## 📱 Default Credentials

After seeding, you can use:
- **Email:** admin@tradex24.com
- **Password:** password123

(Change these immediately in production!)

## 🛑 Stop Services

```bash
./stop-services.sh
```

## 📚 Need More Details?

- **Full Setup Guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Scripts Documentation:** [SCRIPTS_README.md](SCRIPTS_README.md)
- **Troubleshooting:** [SETUP_GUIDE.md#troubleshooting](SETUP_GUIDE.md#troubleshooting)
- **Checklist:** [CHECKLIST.md](CHECKLIST.md)

## 🆘 Common Issues

### MySQL Connection Failed
```bash
sudo systemctl start mysql
```

### Port Already in Use
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

### Permission Denied
```bash
cd /var/app/Tradexpro-AdminPortal
sudo chmod -R 775 storage bootstrap/cache
```

## 🔄 Daily Workflow

```bash
# Morning - Start services
./start-services.sh

# Check status
pm2 status

# View logs
pm2 logs

# Evening - Stop services
./stop-services.sh
```

## 🎓 Next Steps

1. ✅ Review `.env` files and update with your credentials
2. ✅ Configure payment gateways
3. ✅ Set up email service
4. ✅ Configure firewall for remote access
5. ✅ Enable PM2 auto-start: `pm2 startup && pm2 save`

## 📞 Support

- **Documentation:** Check all `.md` files in `/var/app`
- **Logs:** `pm2 logs` or `/var/app/Tradexpro-AdminPortal/storage/logs/`
- **GitHub:** [Tradex24-Exchange](https://github.com/bitachaien/Tradex24-Exchange-.git)

---

**Happy Trading! 🚀**

Made with [Bob](https://bob.build) - AI-powered development assistant
