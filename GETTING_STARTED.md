# Getting Started Guide

Welcome to the SaaS Marketplace Dashboard! This guide will help you get up and running quickly.

## 🎯 What You'll Build

By following this guide, you'll have:
- A fully functional SaaS dashboard with authentication
- Two independent micro-frontends (Orders and Billing)
- A RESTful backend API with PostgreSQL
- Everything running in Docker containers

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Docker Desktop** installed and running ([Download](https://www.docker.com/products/docker-desktop))
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] **pnpm** installed (optional but recommended)
  ```bash
  npm install -g pnpm
  ```
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Setup (Easiest)

**Windows Users:**
```bash
# Run the setup script
start-dev.bat
```

**Mac/Linux Users:**
```bash
# Make script executable
chmod +x start-dev.sh

# Run the setup script
./start-dev.sh
```

The script will:
1. ✅ Check Docker is running
2. ✅ Create environment files
3. ✅ Start PostgreSQL
4. ✅ Install all dependencies
5. ✅ Setup database with demo data

### Option 2: Manual Setup (Step by Step)

#### Step 1: Clone and Install

```bash
# Install root dependencies
npm install

# Or with pnpm
pnpm install
```

#### Step 2: Environment Setup

```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Edit if needed (optional for local dev)
```

#### Step 3: Start Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Verify it's running
docker ps
```

You should see:
```
CONTAINER ID   IMAGE              STATUS         PORTS
xxxxx          postgres:15-alpine Up 10 seconds  0.0.0.0:5432->5432/tcp
```

#### Step 4: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed demo data
npm run seed
```

You should see:
```
✅ Created user: admin@example.com
✅ Created orders: ORD-001, ORD-002
✅ Created invoices: INV-001, INV-002
🎉 Seeding completed!
```

#### Step 5: Install Frontend Dependencies

```bash
# Shell
cd ../shell
npm install

# Orders MFE
cd ../orders-mfe
npm install

# Billing MFE
cd ../billing-mfe
npm install
```

#### Step 6: Start All Services

Open **4 separate terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Wait for: `🚀 Server running on port 4000`

**Terminal 2 - Shell:**
```bash
cd shell
npm run dev
```
Wait for: `Local: http://localhost:3000/`

**Terminal 3 - Orders MFE:**
```bash
cd orders-mfe
npm run dev
```
Wait for: `Local: http://localhost:3001/`

**Terminal 4 - Billing MFE:**
```bash
cd billing-mfe
npm run dev
```
Wait for: `Local: http://localhost:3002/`

## 🎉 Access the Application

1. Open your browser
2. Navigate to: **http://localhost:3000**
3. You should see the login page

### Demo Credentials

```
Email: admin@example.com
Password: password123
```

## 🧪 Testing the Application

### 1. Login
- Use the demo credentials above
- Click "Sign in"
- You should be redirected to the dashboard

### 2. Explore Dashboard
- View summary metrics
- Check quick actions

### 3. Test Orders Module
- Click "Orders" in the sidebar
- View the order list
- Click "View" on an order to see details
- Click "Create Order" to add a new order

### 4. Test Billing Module
- Click "Billing" in the sidebar
- View invoices in the "Invoices" tab
- Check payment history in "Payment History" tab
- Explore settings in "Settings" tab

### 5. Test Authentication
- Click "Logout" in the header
- You should be redirected to login
- Login again to verify refresh token works

## 🔍 Verify Everything Works

### Check Backend API

```bash
# Health check
curl http://localhost:4000/health

# Should return:
# {"status":"ok","timestamp":"2024-01-24T..."}
```

### Check Database

```bash
cd backend
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all tables
- See seeded data
- Run queries

### Check Module Federation

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for `remoteEntry.js` files being loaded from:
   - http://localhost:3001/assets/remoteEntry.js (Orders)
   - http://localhost:3002/assets/remoteEntry.js (Billing)

## 🐛 Troubleshooting

### Issue: "Port already in use"

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux - Find and kill process
lsof -ti:3000 | xargs kill -9
```

### Issue: "Docker is not running"

**Solution:**
1. Open Docker Desktop
2. Wait for it to start (green icon)
3. Run `docker ps` to verify

### Issue: "Database connection failed"

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps

# View logs
docker logs saas-postgres

# Restart database
docker-compose restart postgres

# Wait 10 seconds and try again
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
cd backend
npx prisma generate
```

### Issue: "Cannot load remote module"

**Solution:**
1. Ensure all 4 services are running
2. Check console for errors
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh (Ctrl+Shift+R)

### Issue: "Login fails with 401"

**Solution:**
```bash
# Re-seed the database
cd backend
npm run seed
```

## 📚 Next Steps

Now that everything is running:

### 1. Explore the Code

**Start with:**
- `shell/src/App.tsx` - Main application entry
- `backend/src/app.ts` - API routes
- `orders-mfe/src/App.tsx` - Orders module
- `billing-mfe/src/App.tsx` - Billing module

### 2. Read Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the system design
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview
- [PHASE2_UPGRADE.md](./PHASE2_UPGRADE.md) - Multi-tenancy roadmap

### 3. Make Your First Change

**Easy starter tasks:**

1. **Change the app title:**
   - Edit `shell/src/components/Layout/Header.tsx`
   - Change "SaaS Marketplace" to your name

2. **Add a new metric to dashboard:**
   - Edit `shell/src/pages/Dashboard.tsx`
   - Add a new card in the grid

3. **Customize the theme:**
   - Edit CSS files in `shell/src/components/Layout/`
   - Change colors, fonts, spacing

### 4. Build New Features

**Intermediate tasks:**

1. **Add a new order status:**
   - Update `orders-mfe/src/types/order.types.ts`
   - Add status badge color in `OrderList.tsx`

2. **Create a new API endpoint:**
   - Add route in `backend/src/app.ts`
   - Create controller and service

3. **Add form validation:**
   - Install Zod in frontend
   - Add validation to CreateOrder form

### 5. Deploy to Production

When ready:
- Read [DEPLOYMENT.md](./DEPLOYMENT.md)
- Setup AWS account
- Configure CI/CD pipeline
- Deploy!

## 🎓 Learning Resources

### Module Federation
- [Official Docs](https://webpack.js.org/concepts/module-federation/)
- [Vite Plugin](https://github.com/originjs/vite-plugin-federation)

### Prisma
- [Official Docs](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### React + TypeScript
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Tips for Success

1. **Keep services running** - Don't close the terminal windows
2. **Check logs** - Errors appear in the terminal
3. **Use Prisma Studio** - Great for debugging database issues
4. **Hot reload works** - Changes appear automatically
5. **Read error messages** - They usually tell you what's wrong

## 🤝 Getting Help

If you're stuck:

1. **Check the logs** in your terminal windows
2. **Review the troubleshooting section** above
3. **Search the documentation** in this repo
4. **Check browser console** for frontend errors
5. **Use Prisma Studio** to inspect database

## ✅ Success Checklist

You're ready to develop when:

- [ ] All 4 services are running without errors
- [ ] You can login at http://localhost:3000
- [ ] Dashboard loads with metrics
- [ ] Orders page shows order list
- [ ] Billing page shows invoices
- [ ] You can create a new order
- [ ] Logout and login works
- [ ] Prisma Studio opens successfully

## 🎊 Congratulations!

You now have a fully functional micro-frontend SaaS application running locally!

**What you've accomplished:**
- ✅ Setup a complex multi-service architecture
- ✅ Configured Module Federation
- ✅ Connected frontend to backend API
- ✅ Setup PostgreSQL with Prisma
- ✅ Implemented JWT authentication
- ✅ Got Docker containers running

**You're ready to:**
- 🚀 Build new features
- 📚 Learn advanced patterns
- 🎨 Customize the design
- 🌐 Deploy to production

Happy coding! 🎉
