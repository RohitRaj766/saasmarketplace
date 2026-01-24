# Setup Checklist ✅

Use this checklist to ensure everything is set up correctly.

## Initial Setup (One Time)

- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] Code editor (VS Code) installed

## Database Setup

- [ ] PostgreSQL running in Docker
  ```bash
  docker-compose up -d postgres
  docker ps  # Should show postgres container
  ```

- [ ] Backend dependencies installed
  ```bash
  cd backend && npm install
  ```

- [ ] Prisma client generated
  ```bash
  cd backend && npx prisma generate
  ```

- [ ] Database migrated
  ```bash
  cd backend && npx prisma migrate dev --name init
  ```

- [ ] Database seeded with demo data
  ```bash
  cd backend && npm run seed
  # Should show: ✅ Created user: admin@example.com
  ```

## Frontend Setup

- [ ] Shell dependencies installed
  ```bash
  cd shell && npm install
  ```

- [ ] Orders MFE dependencies installed
  ```bash
  cd orders-mfe && npm install
  ```

- [ ] Billing MFE dependencies installed
  ```bash
  cd billing-mfe && npm install
  ```

## MFE Build (Required!)

- [ ] Orders MFE built
  ```bash
  cd orders-mfe && npm run build
  # Should create dist/ folder
  ```

- [ ] Billing MFE built
  ```bash
  cd billing-mfe && npm run build
  # Should create dist/ folder
  ```

- [ ] remoteEntry.js files exist
  ```bash
  # Check these files exist:
  orders-mfe/dist/assets/remoteEntry.js
  billing-mfe/dist/assets/remoteEntry.js
  ```

## Services Running

- [ ] Orders MFE preview server running (Terminal 1)
  ```bash
  cd orders-mfe && npm run preview
  # Should show: http://localhost:3001
  ```

- [ ] Billing MFE preview server running (Terminal 2)
  ```bash
  cd billing-mfe && npm run preview
  # Should show: http://localhost:3002
  ```

- [ ] Backend API running (Terminal 3)
  ```bash
  cd backend && npm run dev
  # Should show: 🚀 Server running on port 4000
  ```

- [ ] Shell application running (Terminal 4)
  ```bash
  cd shell && npm run dev
  # Should show: Local: http://localhost:3000/
  ```

## Verification

- [ ] MFE remote entries accessible
  - [ ] http://localhost:3001/assets/remoteEntry.js (downloads JS file)
  - [ ] http://localhost:3002/assets/remoteEntry.js (downloads JS file)

- [ ] Backend health check works
  ```bash
  curl http://localhost:4000/health
  # Should return: {"status":"ok","timestamp":"..."}
  ```

- [ ] Shell loads without errors
  - [ ] Open http://localhost:3000
  - [ ] No errors in browser console
  - [ ] Login page displays

## Application Testing

- [ ] Login works
  - [ ] Email: admin@example.com
  - [ ] Password: password123
  - [ ] Redirects to dashboard

- [ ] Dashboard displays
  - [ ] Shows metrics
  - [ ] No console errors

- [ ] Orders page works
  - [ ] Click "Orders" in sidebar
  - [ ] Order list displays
  - [ ] Can view order details
  - [ ] Can create new order

- [ ] Billing page works
  - [ ] Click "Billing" in sidebar
  - [ ] Invoice list displays
  - [ ] Can switch tabs (Invoices, Payment History, Settings)

- [ ] Logout works
  - [ ] Click "Logout"
  - [ ] Redirects to login page

## Troubleshooting Checklist

If something doesn't work, check:

- [ ] All 4 terminals are running without errors
- [ ] No "Port already in use" errors
- [ ] Docker container is running (`docker ps`)
- [ ] Browser console has no errors (F12)
- [ ] Network tab shows successful API calls
- [ ] MFE remoteEntry.js files are accessible
- [ ] All npm install commands completed successfully
- [ ] Database has seeded data (check with `npx prisma studio`)

## Common Issues

### ❌ "Failed to fetch remoteEntry.js"
**Fix:** MFEs not built or not running
```bash
cd orders-mfe && npm run build && npm run preview
cd billing-mfe && npm run build && npm run preview
```

### ❌ "Login failed"
**Fix:** Backend not running or database not seeded
```bash
cd backend && npm run seed && npm run dev
```

### ❌ "Port already in use"
**Fix:** Kill the process using the port
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### ❌ "Database connection failed"
**Fix:** PostgreSQL not running
```bash
docker-compose up -d postgres
# Wait 10 seconds
```

### ❌ "Cannot find module"
**Fix:** Dependencies not installed
```bash
# In the affected directory
rm -rf node_modules package-lock.json
npm install
```

## Success Criteria

✅ **You're ready when:**

1. All 4 services running without errors
2. Can login at http://localhost:3000
3. Dashboard displays with metrics
4. Orders page loads and shows orders
5. Billing page loads and shows invoices
6. Can navigate between pages
7. No errors in browser console
8. Can logout and login again

## Quick Reset

If everything is broken, run this:

```bash
# Stop all services (Ctrl+C in all terminals)

# Restart database
docker-compose down -v
docker-compose up -d postgres

# Rebuild MFEs
cd orders-mfe && npm run build
cd ../billing-mfe && npm run build

# Restart all services
cd orders-mfe && npm run preview      # Terminal 1
cd billing-mfe && npm run preview     # Terminal 2
cd backend && npm run dev             # Terminal 3
cd shell && npm run dev               # Terminal 4
```

---

**All checked?** You're ready to develop! 🎉

**Need help?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
