# OptiFlow - Startup Checklist

## ✅ Pre-Flight Checklist

Before starting the application, ensure all these steps are completed:

### 1. Dependencies Installed
```bash
# Check if node_modules exists in each directory
ls backend/node_modules        # Should exist
ls shell/node_modules           # Should exist
ls orders-mfe/node_modules      # Should exist
ls billing-mfe/node_modules     # Should exist
ls analytics-mfe/node_modules   # Should exist
ls admin-mfe/node_modules       # Should exist
```

If any are missing:
```bash
cd <directory> && npm install
```

### 2. Database Setup
```bash
cd backend

# Check if .env exists
ls .env  # Should exist

# Check if migrations are applied
npx prisma migrate status

# If not applied:
npx prisma migrate dev

# Check if data is seeded
npx prisma studio
# Open http://localhost:5555 and check if tenants exist
```

### 3. MFEs Built
All MFEs must be built before starting:
```bash
cd orders-mfe && npm run build
cd ../billing-mfe && npm run build
cd ../analytics-mfe && npm run build
cd ../admin-mfe && npm run build
```

## 🚀 Startup Sequence

### Option A: Automated (Recommended)

**Windows:**
```bash
# Terminal 1: Start all MFEs
start-mfe-dev.bat

# Terminal 2: Start backend
cd backend
npm run dev

# Terminal 3: Start shell
cd shell
npm run dev
```

**Linux/Mac:**
```bash
# Terminal 1: Start all MFEs
chmod +x start-mfe-dev.sh
./start-mfe-dev.sh

# Terminal 2: Start backend
cd backend
npm run dev

# Terminal 3: Start shell
cd shell
npm run dev
```

### Option B: Manual

Start in this exact order:

**Terminal 1: Orders MFE**
```bash
cd orders-mfe
npm run build
npm run preview
# Wait for: "Local: http://localhost:3001/"
```

**Terminal 2: Billing MFE**
```bash
cd billing-mfe
npm run build
npm run preview
# Wait for: "Local: http://localhost:3002/"
```

**Terminal 3: Analytics MFE**
```bash
cd analytics-mfe
npm run build
npm run preview
# Wait for: "Local: http://localhost:3003/"
```

**Terminal 4: Admin MFE**
```bash
cd admin-mfe
npm run build
npm run preview
# Wait for: "Local: http://localhost:3004/"
```

**Terminal 5: Backend**
```bash
cd backend
npm run dev
# Wait for: "Server running on port 5000"
```

**Terminal 6: Shell**
```bash
cd shell
npm run dev
# Wait for: "Local: http://localhost:3000/"
```

## ✅ Verification

### 1. Check All Services Running

Open these URLs in your browser:
- ✅ Orders MFE: http://localhost:3001
- ✅ Billing MFE: http://localhost:3002
- ✅ Analytics MFE: http://localhost:3003
- ✅ Admin MFE: http://localhost:3004
- ✅ Backend: http://localhost:5000/health
- ✅ Shell: http://localhost:3000

### 2. Check Console Logs

Each terminal should show:
- **Orders MFE:** `Local: http://localhost:3001/`
- **Billing MFE:** `Local: http://localhost:3002/`
- **Analytics MFE:** `Local: http://localhost:3003/`
- **Admin MFE:** `Local: http://localhost:3004/`
- **Backend:** `Server running on port 5000`
- **Shell:** `Local: http://localhost:3000/`

### 3. Test Login

1. Go to http://localhost:3000
2. Login with: `mike.cannon@atlassian.com` / `password123`
3. Should see: Dashboard, Orders, Billing, Analytics in sidebar
4. Click each menu item - should load without errors

## 🐛 Troubleshooting

### Error: "Failed to resolve import 'orders_mfe/OrdersApp'"
**Cause:** MFEs not running or not built  
**Solution:**
```bash
cd orders-mfe && npm run build && npm run preview
cd billing-mfe && npm run build && npm run preview
cd analytics-mfe && npm run build && npm run preview
cd admin-mfe && npm run build && npm run preview
```

### Error: "404 on remoteEntry.js"
**Cause:** MFE running in dev mode instead of preview  
**Solution:** Always use `npm run build && npm run preview`, NOT `npm run dev`

### Error: "Port already in use"
**Cause:** Previous process still running  
**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Error: "Database connection failed"
**Cause:** DATABASE_URL incorrect or database not running  
**Solution:**
```bash
cd backend
# Check .env file
cat .env

# Test connection
npx prisma db pull
```

### Error: "Invalid credentials"
**Cause:** Database not seeded  
**Solution:**
```bash
cd backend
npx tsx prisma/seed-production.ts
```

### Shell shows blank page
**Cause:** MFEs not accessible  
**Solution:**
1. Check all MFE preview servers are running
2. Check browser console for errors
3. Verify remoteEntry.js accessible:
   - http://localhost:3001/assets/remoteEntry.js
   - http://localhost:3002/assets/remoteEntry.js
   - http://localhost:3003/assets/remoteEntry.js
   - http://localhost:3004/assets/remoteEntry.js

## 📋 Quick Reference

### Ports
- **3000** - Shell (Main App)
- **3001** - Orders MFE
- **3002** - Billing MFE
- **3003** - Analytics MFE
- **3004** - Admin MFE
- **5000** - Backend API
- **5555** - Prisma Studio (optional)

### Test Accounts
**Atlassian (Orders + Billing + Analytics):**
- mike.cannon@atlassian.com / password123

**Zoho (Orders + Admin):**
- sridhar.vembu@zoho.com / password123

### Common Commands
```bash
# Rebuild all MFEs
cd orders-mfe && npm run build
cd ../billing-mfe && npm run build
cd ../analytics-mfe && npm run build
cd ../admin-mfe && npm run build

# Reset database
cd backend
npx prisma migrate reset
npx tsx prisma/seed-production.ts

# View database
cd backend
npx prisma studio

# Check TypeScript
cd shell && npx tsc --noEmit
cd backend && npm run build
```

## 🎯 Success Indicators

You know everything is working when:
1. ✅ All 6 terminals show "running" messages
2. ✅ All 6 URLs are accessible
3. ✅ Login works without errors
4. ✅ Navigation shows correct items based on tenant
5. ✅ Clicking menu items loads MFEs without 404 errors
6. ✅ Browser console has no red errors

---

**Need Help?** Check TROUBLESHOOTING.md for more detailed solutions.
