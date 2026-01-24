# Setup Guide

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- pnpm installed (recommended) or npm

## Quick Start

### 1. Clone and Install

```bash
# Install dependencies
pnpm install

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
```

### 2. Start Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Wait for database to be ready (about 10 seconds)
```

### 3. Setup Database

```bash
cd backend

# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed database with demo data
pnpm seed
```

### 4. Start Development Servers

Open 4 terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
pnpm dev
# Runs on http://localhost:4000
```

**Terminal 2 - Shell:**
```bash
cd shell
pnpm dev
# Runs on http://localhost:3000
```

**Terminal 3 - Orders MFE:**
```bash
cd orders-mfe
pnpm dev
# Runs on http://localhost:3001
```

**Terminal 4 - Billing MFE:**
```bash
cd billing-mfe
pnpm dev
# Runs on http://localhost:3002
```

### 5. Access Application

Open browser: http://localhost:3000

**Demo Credentials:**
- Email: admin@example.com
- Password: password123

## Docker Setup (Alternative)

```bash
# Build and start all services
docker-compose up --build

# Access at http://localhost:3000
```

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# View logs
docker logs saas-postgres

# Restart database
docker-compose restart postgres
```

### Module Federation Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
pnpm install

# Clear Vite cache
rm -rf shell/.vite
rm -rf orders-mfe/.vite
rm -rf billing-mfe/.vite
```

## Development Workflow

### Adding New Features

1. Create feature branch
2. Develop in respective MFE or backend
3. Test independently
4. Test integration with Shell
5. Create PR

### Database Changes

```bash
cd backend

# Create migration
pnpm prisma migrate dev --name your_migration_name

# View database
pnpm prisma studio
```

### Testing MFEs Independently

Each MFE can run standalone:

```bash
# Orders MFE standalone
cd orders-mfe
pnpm dev
# Open http://localhost:3001

# Billing MFE standalone
cd billing-mfe
pnpm dev
# Open http://localhost:3002
```

## Production Build

```bash
# Build all services
pnpm build

# Or build individually
cd shell && pnpm build
cd orders-mfe && pnpm build
cd billing-mfe && pnpm build
cd backend && pnpm build
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas_dashboard
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=4000
```

### Frontend (shell/.env)
```
VITE_API_URL=http://localhost:4000
VITE_ORDERS_MFE_URL=http://localhost:3001
VITE_BILLING_MFE_URL=http://localhost:3002
```

## Next Steps

1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
2. Check [README.md](./README.md) for project overview
3. Start building features!
