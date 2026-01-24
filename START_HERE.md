# 🚀 START HERE - Quick Setup

## The Problem You're Facing

You're seeing: `Failed to fetch remoteEntry.js` error

**Why?** The Micro-Frontends (Orders and Billing) need to be **built and running** before the Shell can load them.

## ✅ Solution: Follow These Steps

### Step 1: Build the MFEs (One Time)

Open a terminal and run:

```bash
# Build Orders MFE
cd orders-mfe
npm run build

# Build Billing MFE
cd ../billing-mfe
npm run build
```

Wait for both to complete (you'll see "✓ built in...").

### Step 2: Start All Services (4 Terminals)

**Terminal 1 - Orders MFE:**
```bash
cd orders-mfe
npm run preview
```
Wait for: `http://localhost:3001`

**Terminal 2 - Billing MFE:**
```bash
cd billing-mfe
npm run preview
```
Wait for: `http://localhost:3002`

**Terminal 3 - Backend:**
```bash
cd backend
npm run dev
```
Wait for: `🚀 Server running on port 4000`

**Terminal 4 - Shell:**
```bash
cd shell
npm run dev
```
Wait for: `Local: http://localhost:3000/`

### Step 3: Access the Application

Open browser: **http://localhost:3000**

Login with:
- Email: `admin@example.com`
- Password: `password123`

## ✅ Verify It's Working

1. **Check MFEs are accessible:**
   - Open: http://localhost:3001/assets/remoteEntry.js
   - Open: http://localhost:3002/assets/remoteEntry.js
   - Both should download a JavaScript file (not show 404)

2. **Login to the app**
   - Should redirect to dashboard
   - Click "Orders" - should load Orders page
   - Click "Billing" - should load Billing page

## 🔄 When You Make Changes

### Changes to Shell (Frontend Host)
- **No rebuild needed** - hot reloads automatically

### Changes to Backend
- **No rebuild needed** - hot reloads automatically

### Changes to Orders or Billing MFE
1. Stop the preview server (Ctrl+C)
2. Rebuild: `npm run build`
3. Restart: `npm run preview`
4. Refresh browser

## 🚨 Common Issues

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### "remoteEntry.js 404"
MFEs are not running. Go back to Step 2.

### "Login failed"
Backend is not running or database is not seeded.
```bash
cd backend
npm run seed
npm run dev
```

## 📚 More Help

- **Detailed MFE Guide:** [MFE_SETUP.md](./MFE_SETUP.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Getting Started:** [GETTING_STARTED.md](./GETTING_STARTED.md)

## 🎯 Quick Commands Reference

```bash
# Build MFEs (do this first!)
cd orders-mfe && npm run build
cd ../billing-mfe && npm run build

# Start everything (4 terminals)
cd orders-mfe && npm run preview      # Terminal 1
cd billing-mfe && npm run preview     # Terminal 2
cd backend && npm run dev             # Terminal 3
cd shell && npm run dev               # Terminal 4
```

## ✨ Success!

When everything is running, you should see:
- ✅ Orders MFE at http://localhost:3001
- ✅ Billing MFE at http://localhost:3002
- ✅ Backend at http://localhost:4000
- ✅ Shell at http://localhost:3000
- ✅ No errors in browser console
- ✅ Can navigate between Orders and Billing pages

---

**Need help?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or [MFE_SETUP.md](./MFE_SETUP.md)
