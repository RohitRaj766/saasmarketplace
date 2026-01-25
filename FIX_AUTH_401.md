# Fix 401 Authentication Error

## 🔍 Diagnosis

You're getting a 401 error, which means "Unauthorized". This typically happens when:
1. ❌ Backend is not running
2. ❌ Database has no users (not seeded)
3. ❌ Wrong credentials
4. ❌ CORS issue

## 🔧 Step-by-Step Fix

### Step 1: Check if Backend is Running

Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 4000
📝 Environment: development
🔗 API URL: http://localhost:4000
```

If you see errors, continue to Step 2.

### Step 2: Seed the Database

The database needs users to authenticate. Run:

```bash
cd backend
npm run seed:production
```

This will create:
- **Atlassian tenant** with 10 users
- **Zoho tenant** with 10 users

You should see output like:
```
✅ Seeded 2 tenants
✅ Seeded 20 users
✅ Seeded tenant features
✅ Production seed completed!
```

### Step 3: Verify Database

Check if users exist:

```bash
cd backend
npx prisma studio
```

This opens a GUI where you can:
1. Click on "User" table
2. Verify users exist
3. Check email addresses

### Step 4: Test Backend API Directly

Test the login endpoint with curl or Postman:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@atlassian.com","password":"password123"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "tenant": {...},
    "features": [...],
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "Login successful"
}
```

If you get 401 here, the issue is with the backend/database.

### Step 5: Check Frontend API URL

Verify the Shell is pointing to the correct backend:

Create/check `shell/.env`:
```env
VITE_API_URL=http://localhost:4000
```

Then rebuild:
```bash
cd shell
npm run build
```

### Step 6: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for errors

Common errors:
- `Failed to fetch` → Backend not running
- `401 Unauthorized` → Wrong credentials or no users
- `CORS error` → CORS not configured

### Step 7: Check Network Tab

1. Open DevTools → Network tab
2. Try logging in
3. Look for POST request to `/auth/login`
4. Check:
   - **Request URL**: Should be `http://localhost:4000/auth/login`
   - **Status**: Should be 200 (not 401)
   - **Response**: Should have user data

## 🎯 Quick Fix Script

Run this complete fix:

```bash
# 1. Stop everything
# Press Ctrl+C in all terminals

# 2. Seed database
cd backend
npm run seed:production

# 3. Start backend
npm run dev
# Keep this terminal open

# 4. In a new terminal, rebuild and start shell
cd shell
npm run build
npm run preview
# Keep this terminal open

# 5. Open browser
# Go to http://localhost:3000
# Login with: admin@atlassian.com / password123
```

## 📝 Test Credentials

After seeding, use these credentials:

### Atlassian (Professional Tier)
```
Email: admin@atlassian.com
Password: password123
```

Other Atlassian users:
- user1@atlassian.com / password123
- user2@atlassian.com / password123
- ... (up to user9@atlassian.com)

### Zoho (Starter Tier)
```
Email: admin@zoho.com
Password: password123
```

Other Zoho users:
- user1@zoho.com / password123
- user2@zoho.com / password123
- ... (up to user9@zoho.com)

## 🐛 Still Getting 401?

### Check 1: Database Connection

```bash
cd backend
npx prisma db push
```

If this fails, your database might not be set up.

### Check 2: Environment Variables

Check `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_marketplace"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="1h"
REFRESH_TOKEN_SECRET="your-super-secret-refresh-token-key"
REFRESH_TOKEN_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
```

### Check 3: Password Hash

The seed script uses bcrypt to hash passwords. Verify in Prisma Studio:
1. Open User table
2. Check `passwordHash` field
3. Should be a long encrypted string (not "password123")

### Check 4: Backend Logs

When you try to login, check backend terminal for errors:
```
POST /auth/login 401 - - ms
```

If you see this, the backend received the request but rejected it.

## ✅ Success Checklist

After fixing, you should see:

1. ✅ Backend running on port 4000
2. ✅ Database has users (check Prisma Studio)
3. ✅ Login returns 200 status
4. ✅ Browser console shows "Login successful"
5. ✅ Redirected to dashboard
6. ✅ User name in header

## 🚀 Complete Restart

If nothing works, do a complete restart:

```bash
# 1. Stop all processes (Ctrl+C everywhere)

# 2. Reset database
cd backend
npx prisma migrate reset --force
npm run seed:production

# 3. Start backend
npm run dev
# Keep open

# 4. New terminal - rebuild shell
cd shell
npm run build

# 5. Start shell
npm run preview
# Keep open

# 6. Open http://localhost:3000
# Login: admin@atlassian.com / password123
```

## 📞 Debug Mode

Add this to see detailed logs:

In `backend/src/modules/auth/auth.service.ts`, add console.logs:

```typescript
async login(email: string, password: string) {
  console.log('🔍 Login attempt:', email);
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: { include: { tenantFeatures: true } } }
  });

  console.log('👤 User found:', !!user);
  
  if (!user) {
    console.log('❌ User not found');
    throw new AppError('Invalid credentials', 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  console.log('🔐 Password valid:', isValidPassword);
  
  if (!isValidPassword) {
    console.log('❌ Invalid password');
    throw new AppError('Invalid credentials', 401);
  }

  console.log('✅ Login successful');
  // ... rest of code
}
```

Then check backend terminal when you try to login.

---

**Most Common Issue**: Database not seeded!

**Quick Fix**: 
```bash
cd backend
npm run seed:production
npm run dev
```

Then try logging in again! 🚀
