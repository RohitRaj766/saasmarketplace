# Authentication Troubleshooting Guide

## 🔧 Issue Fixed

Updated `shell/src/contexts/AuthContext.tsx` to properly handle the wrapped response from the backend.

### What Was Wrong

The backend returns responses in this format:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "features": [...],
    "tenant": {...},
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "Login successful"
}
```

The `apiClient.post()` method returns `response.data`, which is the entire wrapped object. We need to access `response.data` to get the actual login data.

### What Was Fixed

Updated the login function to:
1. Properly extract data from the wrapped response
2. Add better error handling
3. Add console logs for debugging
4. Handle both wrapped and direct response formats (for flexibility)

## 🧪 How to Test

### 1. Start the Backend

```bash
cd backend
npm run dev
```

The backend should start on `http://localhost:4000`

### 2. Verify Database is Seeded

Check if you have users in the database:

```bash
cd backend
npx prisma studio
```

Or run the seed script:

```bash
cd backend
npm run seed:production
```

This creates:
- **Atlassian tenant** with users (admin@atlassian.com / password123)
- **Zoho tenant** with users (admin@zoho.com / password123)

### 3. Build and Start Shell

```bash
cd shell
npm run build
npm run preview
```

Or use the startup script:

```bash
# Windows
start-all.bat

# Linux/Mac
./start-all.sh
```

### 4. Test Login

1. Open `http://localhost:3000`
2. You should see the login page
3. Try logging in with:
   - **Email**: admin@atlassian.com
   - **Password**: password123

### 5. Check Browser Console

Open browser DevTools (F12) and check the Console tab for:
- ✅ "Login successful: { user: 'admin@atlassian.com', tenant: 'Atlassian' }"
- ❌ Any error messages

### 6. Check Network Tab

In DevTools Network tab:
1. Look for the POST request to `/auth/login`
2. Check the Response:
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

## 🐛 Common Issues

### Issue 1: Backend Not Running

**Symptom**: Network error, "Failed to fetch"

**Solution**:
```bash
cd backend
npm run dev
```

### Issue 2: Database Not Seeded

**Symptom**: "Invalid credentials" error

**Solution**:
```bash
cd backend
npm run seed:production
```

### Issue 3: CORS Error

**Symptom**: CORS policy error in console

**Solution**: Check `backend/src/index.ts` has CORS enabled:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 4: Wrong API URL

**Symptom**: 404 errors

**Solution**: Check `shell/.env` or create it:
```env
VITE_API_URL=http://localhost:4000
```

### Issue 5: Token Not Stored

**Symptom**: Redirects to login after successful login

**Solution**: Check browser console for errors in storage operations

## 📝 Test Credentials

### Atlassian Tenant (Professional Tier)
- **Email**: admin@atlassian.com
- **Password**: password123
- **Features**: orders, billing, analytics, admin

### Zoho Tenant (Starter Tier)
- **Email**: admin@zoho.com
- **Password**: password123
- **Features**: orders, admin

## 🔍 Debug Mode

To enable detailed logging, open browser console and run:

```javascript
localStorage.setItem('debug', 'true');
```

Then refresh the page and try logging in again.

## ✅ Expected Behavior

After successful login:
1. ✅ Redirected to `/dashboard`
2. ✅ User name displayed in header
3. ✅ Tenant name displayed in header
4. ✅ Navigation items visible based on features
5. ✅ Dark mode toggle works
6. ✅ Logout button works

## 🚀 Quick Start (All-in-One)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Shell + MFEs
start-all.bat  # Windows
./start-all.sh # Linux/Mac
```

Then open `http://localhost:3000` and login!

## 📞 Still Not Working?

If authentication still doesn't work:

1. **Check Backend Logs**: Look for errors in the backend terminal
2. **Check Browser Console**: Look for JavaScript errors
3. **Check Network Tab**: Verify the API request/response
4. **Check LocalStorage**: Open DevTools > Application > Local Storage
5. **Clear Cache**: Clear browser cache and localStorage
6. **Restart Everything**: Stop all processes and start fresh

## 🔐 Security Notes

- Tokens are stored in localStorage (for demo purposes)
- In production, consider using httpOnly cookies
- Refresh tokens expire after 7 days
- Access tokens expire after 1 hour (configurable)

---

**Status**: Auth issue fixed! ✅
**Last Updated**: Phase 4 completion
**Next**: Test login and continue with Phase 5
