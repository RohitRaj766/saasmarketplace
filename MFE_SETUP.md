# Micro-Frontend Setup Guide

## Understanding Module Federation

Module Federation requires the **remote** modules (Orders and Billing MFEs) to be **built and served** before the **host** (Shell) can load them.

## Quick Start (Recommended)

### Option 1: Automated Script

**Windows:**
```bash
# Build and start MFEs
start-mfe-dev.bat

# Then in separate terminals:
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd shell
npm run dev
```

**Mac/Linux:**
```bash
# Make executable
chmod +x start-mfe-dev.sh

# Build and start MFEs
./start-mfe-dev.sh

# Then in separate terminals:
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd shell
npm run dev
```

### Option 2: Manual Setup (Step by Step)

#### Step 1: Build the MFEs

```bash
# Build Orders MFE
cd orders-mfe
npm run build

# Build Billing MFE
cd ../billing-mfe
npm run build
```

This creates the `dist/` folder with `remoteEntry.js` file.

#### Step 2: Start MFE Preview Servers

**Terminal 1 - Orders MFE:**
```bash
cd orders-mfe
npm run preview
```
Should show: `http://localhost:3001`

**Terminal 2 - Billing MFE:**
```bash
cd billing-mfe
npm run preview
```
Should show: `http://localhost:3002`

#### Step 3: Verify MFEs are Accessible

Open browser and check:
- http://localhost:3001/assets/remoteEntry.js (should download a file)
- http://localhost:3002/assets/remoteEntry.js (should download a file)

If you see 404, the MFEs are not built or not running.

#### Step 4: Start Backend

**Terminal 3:**
```bash
cd backend
npm run dev
```

#### Step 5: Start Shell

**Terminal 4:**
```bash
cd shell
npm run dev
```

#### Step 6: Access Application

Open: http://localhost:3000

## Development Workflow

### Making Changes to MFEs

When you change code in Orders or Billing MFE:

1. **Stop the preview server** (Ctrl+C)
2. **Rebuild:**
   ```bash
   npm run build
   ```
3. **Restart preview:**
   ```bash
   npm run preview
   ```
4. **Refresh browser** (the Shell will reload the updated MFE)

### Making Changes to Shell

Changes to Shell hot-reload automatically - no rebuild needed.

### Making Changes to Backend

Changes to Backend hot-reload automatically with `tsx watch`.

## Troubleshooting

### Error: "Failed to fetch remoteEntry.js"

**Cause:** MFEs are not running or not built.

**Solution:**
```bash
# Check if MFEs are running
# Open these URLs in browser:
http://localhost:3001/assets/remoteEntry.js
http://localhost:3002/assets/remoteEntry.js

# If 404, rebuild and restart:
cd orders-mfe
npm run build
npm run preview

cd ../billing-mfe
npm run build
npm run preview
```

### Error: "Port already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Error: "Module not found" in MFE

**Solution:**
```bash
cd orders-mfe
npm install
npm run build
npm run preview
```

### MFE shows blank page

**Solution:**
1. Check browser console for errors
2. Verify MFE runs standalone: http://localhost:3001
3. Check if all dependencies are installed
4. Rebuild the MFE

## Architecture Explanation

```
┌─────────────────────────────────────────────────────┐
│  Shell (Host) - Port 3000                           │
│  - Loads remote modules dynamically                 │
│  - Provides shared dependencies                     │
└─────────────┬───────────────────────────────────────┘
              │
              │ Fetches remoteEntry.js
              │
    ┌─────────▼──────────┐    ┌──────────────────┐
    │  Orders MFE        │    │  Billing MFE     │
    │  Port 3001         │    │  Port 3002       │
    │  (Built + Preview) │    │  (Built + Preview)│
    └────────────────────┘    └──────────────────┘
```

### Why Build + Preview?

1. **Build:** Generates the `remoteEntry.js` file that exposes the module
2. **Preview:** Serves the built files so Shell can fetch them

### Why Not Just `npm run dev`?

Vite's dev mode doesn't generate the `remoteEntry.js` file in the same way. The preview mode serves the production build which includes proper Module Federation setup.

## Alternative: Development Mode (Experimental)

If you want hot-reload for MFEs, you can try:

1. **Use `npm run dev` for MFEs** (instead of build + preview)
2. **Update Shell's vite.config.ts** to point to dev servers:
   ```typescript
   remotes: {
     orders: 'http://localhost:3001/@fs/...',  // Complex path
     billing: 'http://localhost:3002/@fs/...'
   }
   ```

However, this is more complex and less reliable. **Build + Preview is recommended.**

## Production Build

For production, all services are built:

```bash
# Build all
npm run build

# Or individually
cd shell && npm run build
cd orders-mfe && npm run build
cd billing-mfe && npm run build
cd backend && npm run build
```

Then deploy:
- Shell → S3 + CloudFront
- Orders MFE → S3 + CloudFront
- Billing MFE → S3 + CloudFront
- Backend → ECS Fargate

## Quick Reference

### Check if MFEs are Running

```bash
# Should return JavaScript file (not 404)
curl http://localhost:3001/assets/remoteEntry.js
curl http://localhost:3002/assets/remoteEntry.js
```

### Restart Everything

```bash
# Stop all terminals (Ctrl+C)

# Rebuild MFEs
cd orders-mfe && npm run build && npm run preview &
cd billing-mfe && npm run build && npm run preview &

# Start backend
cd backend && npm run dev &

# Start shell
cd shell && npm run dev &
```

### View MFE Standalone

- Orders: http://localhost:3001
- Billing: http://localhost:3002

Each MFE has a bootstrap mode that shows it working independently.

## Summary

**Key Points:**
1. ✅ MFEs must be **built** before Shell can load them
2. ✅ Use **preview mode** to serve built MFEs
3. ✅ Shell loads MFEs via `remoteEntry.js`
4. ✅ Changes to MFEs require **rebuild + restart**
5. ✅ Changes to Shell **hot-reload** automatically

**Startup Order:**
1. Build & start Orders MFE (preview)
2. Build & start Billing MFE (preview)
3. Start Backend
4. Start Shell
5. Access http://localhost:3000

Happy coding! 🚀
