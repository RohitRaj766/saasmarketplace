# Troubleshooting Guide

## Common Issues and Solutions

### ✅ FIXED: Login Returns Success but UI Shows "Login Failed"

**Symptom:**
- Backend API returns 200 OK with success response
- Network tab shows correct data
- UI displays "Login failed" error

**Root Cause:**
Backend wraps responses in `{ success, data, message }` format, but frontend was expecting unwrapped data.

**Solution Applied:**
Updated `shell/src/contexts/AuthContext.tsx` to handle wrapped responses:
```typescript
const { user, accessToken, refreshToken } = response.data || response;
```

**How to Verify Fix:**
1. Clear browser cache and localStorage
2. Refresh the page
3. Try logging in with: admin@example.com / password123
4. Should redirect to dashboard successfully

---

## Other Common Issues

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```bash
cd backend
npm install
npx prisma generate
```

### Issue: "Database connection failed"

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps

# If not running, start it
docker-compose up -d postgres

# Wait 10 seconds
timeout /t 10

# Check backend .env file has correct DATABASE_URL
```

### Issue: "Port already in use"

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: "Module Federation - Cannot load remote module"

**Solution:**
1. Ensure all services are running:
   - Backend: http://localhost:4000
   - Shell: http://localhost:3000
   - Orders MFE: http://localhost:3001
   - Billing MFE: http://localhost:3002

2. Check browser console for specific errors

3. Clear Vite cache:
```bash
rm -rf shell/.vite
rm -rf orders-mfe/.vite
rm -rf billing-mfe/.vite
```

4. Restart all frontend services

### Issue: "CORS Error"

**Solution:**
Backend already has CORS enabled. If you still see CORS errors:

1. Check backend is running on port 4000
2. Verify `VITE_API_URL` in shell/.env points to http://localhost:4000
3. Clear browser cache
4. Try in incognito mode

### Issue: "Token expired" immediately after login

**Solution:**
Check system time is correct. JWT tokens are time-sensitive.

```bash
# Windows
w32tm /resync

# Mac/Linux
sudo ntpdate -s time.nist.gov
```

### Issue: "Prisma migration failed"

**Solution:**
```bash
cd backend

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name fix_migration

# Re-seed
npm run seed
```

### Issue: "Docker container won't start"

**Solution:**
```bash
# Stop all containers
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build -d postgres

# Check logs
docker logs saas-postgres
```

### Issue: "npm install fails"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock files
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Or use pnpm
pnpm install
```

### Issue: "TypeScript errors in IDE"

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Press: Ctrl+Shift+P
# Type: "TypeScript: Restart TS Server"

# Or reload window
# Press: Ctrl+Shift+P
# Type: "Developer: Reload Window"
```

### Issue: "Environment variables not loading"

**Solution:**
1. Ensure `.env` files exist:
   - Root: `.env`
   - Backend: `backend/.env`

2. Restart services after changing .env files

3. For Vite (frontend), variables must start with `VITE_`:
```bash
# ✅ Correct
VITE_API_URL=http://localhost:4000

# ❌ Wrong
API_URL=http://localhost:4000
```

### Issue: "Database seeding fails"

**Solution:**
```bash
cd backend

# Check if database is accessible
npx prisma studio

# If accessible, try seeding again
npm run seed

# If fails, check for existing data conflicts
# Delete existing user and try again
```

### Issue: "Cannot access application at localhost:3000"

**Checklist:**
- [ ] Shell service is running (check terminal)
- [ ] No errors in shell terminal
- [ ] Port 3000 is not used by another app
- [ ] Browser cache cleared
- [ ] Try http://localhost:3000 (not https)
- [ ] Try different browser

### Issue: "Login works but dashboard is blank"

**Solution:**
1. Check browser console for errors
2. Verify Orders and Billing MFEs are running
3. Check Network tab for failed remoteEntry.js requests
4. Ensure all services use correct ports:
   - Orders: 3001
   - Billing: 3002

### Issue: "Hot reload not working"

**Solution:**
```bash
# Restart the specific service
# Press Ctrl+C in terminal
# Run npm run dev again

# Or check if file watcher limit is reached (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Debug Mode

### Enable Detailed Logging

**Backend:**
```typescript
// backend/src/config/database.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable all logs
});
```

**Frontend:**
Add console.log in AuthContext:
```typescript
console.log('Login response:', response);
console.log('User data:', user);
console.log('Tokens:', { accessToken, refreshToken });
```

### Check API Directly

```bash
# Test login endpoint
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Test health endpoint
curl http://localhost:4000/health
```

### Inspect Database

```bash
cd backend
npx prisma studio
# Opens GUI at http://localhost:5555
```

## Getting Help

If none of these solutions work:

1. **Check all services are running:**
   ```bash
   # Should see 4 processes
   # Backend, Shell, Orders MFE, Billing MFE
   ```

2. **Check browser console** for JavaScript errors

3. **Check terminal logs** for backend errors

4. **Review the error message carefully** - it usually tells you what's wrong

5. **Try the automated setup script:**
   ```bash
   # Windows
   start-dev.bat
   
   # Mac/Linux
   ./start-dev.sh
   ```

## Prevention Tips

1. **Always check services are running** before testing
2. **Clear browser cache** when making auth changes
3. **Restart services** after changing .env files
4. **Use Prisma Studio** to verify database state
5. **Check Network tab** to see actual API responses
6. **Read error messages** completely before searching for solutions

## Quick Reset (Nuclear Option)

If everything is broken:

```bash
# Stop all services (Ctrl+C in all terminals)

# Stop Docker
docker-compose down -v

# Clean everything
rm -rf node_modules package-lock.json
rm -rf shell/node_modules shell/package-lock.json
rm -rf orders-mfe/node_modules orders-mfe/package-lock.json
rm -rf billing-mfe/node_modules billing-mfe/package-lock.json
rm -rf backend/node_modules backend/package-lock.json

# Reinstall
npm install
cd shell && npm install && cd ..
cd orders-mfe && npm install && cd ..
cd billing-mfe && npm install && cd ..
cd backend && npm install && cd ..

# Restart database
docker-compose up -d postgres

# Setup backend
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run seed
cd ..

# Start all services again
```

This should fix 99% of issues! 🎉
