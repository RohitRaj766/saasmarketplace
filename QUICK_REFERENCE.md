# OptiFlow - Quick Reference Card

## 🚀 One Command Startup

### Windows
```bash
start-all.bat
```

### Linux/Mac
```bash
chmod +x start-all.sh
./start-all.sh
```

**Wait 10-15 seconds, then open:** http://localhost:3000

---

## 🔐 Test Accounts

### Atlassian (Professional Tier)
**Email:** mike.cannon@atlassian.com  
**Password:** password123  
**Features:** Orders + Billing + Analytics

### Zoho (Starter Tier)
**Email:** sridhar.vembu@zoho.com  
**Password:** password123  
**Features:** Orders + Admin

---

## 📊 Service URLs

| Service | URL | Port |
|---------|-----|------|
| **Shell App** | http://localhost:3000 | 3000 |
| Orders MFE | http://localhost:3001 | 3001 |
| Billing MFE | http://localhost:3002 | 3002 |
| Analytics MFE | http://localhost:3003 | 3003 |
| Admin MFE | http://localhost:3004 | 3004 |
| Backend API | http://localhost:5000 | 5000 |

---

## 🛠️ Common Commands

### First Time Setup
```bash
# Install all dependencies
cd backend && npm install
cd ../shell && npm install
cd ../orders-mfe && npm install
cd ../billing-mfe && npm install
cd ../analytics-mfe && npm install
cd ../admin-mfe && npm install

# Setup database
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma migrate dev
npx tsx prisma/seed-production.ts
```

### Daily Development
```bash
# Start everything
start-all.bat  # Windows
./start-all.sh # Linux/Mac
```

### Rebuild MFEs
```bash
cd orders-mfe && npm run build
cd ../billing-mfe && npm run build
cd ../analytics-mfe && npm run build
cd ../admin-mfe && npm run build
```

### Reset Database
```bash
cd backend
npx prisma migrate reset
npx tsx prisma/seed-production.ts
```

### View Database
```bash
cd backend
npx prisma studio
# Opens http://localhost:5555
```

---

## 🐛 Quick Troubleshooting

### "Failed to resolve import"
**Fix:** Rebuild and restart MFEs
```bash
cd orders-mfe && npm run build && npm run preview
```

### "Port already in use"
**Fix:** Kill the process
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### "Invalid credentials"
**Fix:** Reseed database
```bash
cd backend
npx tsx prisma/seed-production.ts
```

### "Database connection failed"
**Fix:** Check .env file
```bash
cd backend
cat .env  # Verify DATABASE_URL
```

---

## 📁 Project Structure

```
SaasMarketplace/
├── backend/           # API (Port 5000)
├── shell/             # Main App (Port 3000)
├── orders-mfe/        # Orders Module (Port 3001)
├── billing-mfe/       # Billing Module (Port 3002)
├── analytics-mfe/     # Analytics Module (Port 3003)
├── admin-mfe/         # Admin Module (Port 3004)
├── start-all.bat      # Windows startup
└── start-all.sh       # Linux/Mac startup
```

---

## 🎯 Feature Matrix

| Feature | Atlassian | Zoho |
|---------|-----------|------|
| Orders | ✅ | ✅ |
| Billing | ✅ | ❌ |
| Analytics | ✅ | ❌ |
| Admin | ❌ | ✅ |

---

## 📚 Documentation

- **README.md** - Main documentation
- **QUICK_START_GUIDE.md** - 5-minute setup
- **STARTUP_CHECKLIST.md** - Detailed startup guide
- **TROUBLESHOOTING.md** - Common issues
- **COMPLETE_PROJECT_SUMMARY.md** - Full overview
- **NEW_MFES_GUIDE.md** - Analytics & Admin guide

---

## 💡 Tips

1. **Always build MFEs before starting** - Use `npm run build && npm run preview`
2. **Wait for services to start** - Give it 10-15 seconds
3. **Check all ports are free** - Close previous instances
4. **Use Prisma Studio** - Great for viewing/editing data
5. **Check browser console** - For frontend errors
6. **Check terminal logs** - For backend errors

---

## 🆘 Need Help?

1. Check **STARTUP_CHECKLIST.md** for step-by-step guide
2. Check **TROUBLESHOOTING.md** for common issues
3. Verify all services are running (check URLs above)
4. Check browser console for errors
5. Check terminal logs for errors

---

**Quick Start:** `start-all.bat` → Wait 15 seconds → Open http://localhost:3000 → Login with test account
