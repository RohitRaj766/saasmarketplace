# 🚀 SaaS Marketplace Dashboard

> A production-grade SaaS dashboard platform built with **Micro-Frontend architecture** using Module Federation, designed to scale into a **Multi-Tenant system**.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed)](https://www.docker.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### Phase 1: Micro-Frontend (Current)
- ✅ **Shell Application** - Centralized auth, routing, and layout
- ✅ **Orders MFE** - Independent orders management module
- ✅ **Billing MFE** - Standalone billing and invoicing module
- ✅ **JWT Authentication** - Secure auth with refresh tokens
- ✅ **RESTful API** - Clean architecture backend
- ✅ **Docker Support** - Containerized development environment
- ✅ **TypeScript** - Full type safety across the stack

### Phase 2: Multi-Tenant (Planned)
- 📋 **Tenant Isolation** - Data segregation per tenant
- 📋 **Tenant Routing** - `/t/{tenant}/orders` URL structure
- 📋 **Feature Flags** - Enable/disable features per tenant
- 📋 **RBAC** - Role-based access control
- 📋 **Custom Theming** - Branding per tenant
- 📋 **Admin Dashboard** - Tenant management interface

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Shell App (React + Vite)                  │  │
│  │  • Authentication  • Routing  • Layout                 │  │
│  │  • Module Federation Host                              │  │
│  └───────────────┬──────────────────┬─────────────────────┘  │
│                  │                  │                         │
│     ┌────────────▼─────────┐  ┌────▼──────────────┐         │
│     │   Orders MFE         │  │   Billing MFE     │         │
│     │   Port: 3001         │  │   Port: 3002      │         │
│     └──────────────────────┘  └───────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JWT)
                              │
                    ┌─────────▼──────────┐
                    │   Backend API      │
                    │   Port: 4000       │
                    │   • Auth Service   │
                    │   • Orders API     │
                    │   • Billing API    │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   PostgreSQL       │
                    │   Port: 5432       │
                    └────────────────────┘
```

### Module Federation Flow

```
Shell (Host)
    ↓ loads
Orders MFE (Remote) ←→ Shared Dependencies (React, React-DOM)
    ↓ loads
Billing MFE (Remote) ←→ Singleton Pattern
```

## 🚀 Quick Start

### ⚠️ Important: MFE Setup Required

The Micro-Frontends (Orders and Billing) must be **built first** before running. 

**👉 [START HERE - Complete Setup Guide](./START_HERE.md)**

### Quick Commands

```bash
# 1. Build MFEs (required first time)
cd orders-mfe && npm run build
cd ../billing-mfe && npm run build

# 2. Start all services (4 terminals)
cd orders-mfe && npm run preview      # Terminal 1
cd billing-mfe && npm run preview     # Terminal 2  
cd backend && npm run dev             # Terminal 3
cd shell && npm run dev               # Terminal 4

# 3. Access at http://localhost:3000
# Login: admin@example.com / password123
```

**Detailed guides:**
- 📖 [START_HERE.md](./START_HERE.md) - Quick setup (start here!)
- 📖 [MFE_SETUP.md](./MFE_SETUP.md) - Micro-Frontend details
- 📖 [GETTING_STARTED.md](./GETTING_STARTED.md) - Complete walkthrough
- 📖 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.2 |
| TypeScript | Type Safety | 5.3 |
| Vite | Build Tool | 5.0 |
| Module Federation | Micro-Frontend | 1.3 |
| TanStack Query | Data Fetching | 5.14 |
| Zustand | State Management | 4.4 |
| React Router | Routing | 6.20 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18+ |
| Express | Web Framework | 4.18 |
| TypeScript | Type Safety | 5.3 |
| Prisma | ORM | 5.7 |
| PostgreSQL | Database | 15 |
| JWT | Authentication | 9.0 |
| Bcrypt | Password Hashing | 2.4 |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Orchestration |
| GitHub Actions | CI/CD |
| AWS | Cloud Platform |

## 📁 Project Structure

```
saas-marketplace-dashboard/
├── 📂 shell/                    # Host application
│   ├── src/
│   │   ├── components/         # Shared components
│   │   ├── contexts/           # React contexts
│   │   ├── lib/                # Utilities
│   │   ├── pages/              # Page components
│   │   └── types/              # TypeScript types
│   ├── vite.config.ts          # Module Federation config
│   └── package.json
│
├── 📂 orders-mfe/              # Orders micro-frontend
│   ├── src/
│   │   ├── components/         # Order components
│   │   ├── types/              # Order types
│   │   └── App.tsx             # Exposed module
│   └── vite.config.ts          # Remote config
│
├── 📂 billing-mfe/             # Billing micro-frontend
│   ├── src/
│   │   ├── components/         # Billing components
│   │   ├── types/              # Billing types
│   │   └── App.tsx             # Exposed module
│   └── vite.config.ts          # Remote config
│
├── 📂 backend/                 # Backend API
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication
│   │   │   ├── orders/         # Orders API
│   │   │   └── billing/        # Billing API
│   │   ├── common/             # Shared utilities
│   │   ├── config/             # Configuration
│   │   └── prisma/             # Database schema
│   └── package.json
│
├── 📄 ARCHITECTURE.md          # System design docs
├── 📄 SETUP.md                 # Setup guide
├── 📄 DEPLOYMENT.md            # Deployment guide
├── 📄 PHASE2_UPGRADE.md        # Multi-tenant upgrade
├── 📄 PROJECT_SUMMARY.md       # Project overview
├── 📄 docker-compose.yml       # Docker orchestration
└── 📄 package.json             # Root workspace
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, patterns, and design decisions |
| [SETUP.md](./SETUP.md) | Detailed development setup instructions |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| [PHASE2_UPGRADE.md](./PHASE2_UPGRADE.md) | Multi-tenancy upgrade path |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Comprehensive project overview |

## 💻 Development

### Available Scripts

```bash
# Root directory
pnpm dev              # Start all services
pnpm build            # Build all services
pnpm docker:up        # Start with Docker
pnpm docker:down      # Stop Docker services

# Backend
cd backend
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm prisma:studio    # Open Prisma Studio
pnpm seed             # Seed database

# Frontend (shell/orders-mfe/billing-mfe)
cd shell
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
```

### Database Management

```bash
# Generate Prisma client
pnpm prisma:generate

# Create migration
pnpm prisma migrate dev --name migration_name

# View database
pnpm prisma studio

# Seed data
pnpm seed
```

### Testing MFEs Independently

Each MFE can run standalone for development:

```bash
# Orders MFE standalone
cd orders-mfe && pnpm dev
# Open http://localhost:3001

# Billing MFE standalone
cd billing-mfe && pnpm dev
# Open http://localhost:3002
```

## 🚢 Deployment

### Docker Production Build

```bash
# Build and start all services
docker-compose up --build

# Access at http://localhost:3000
```

### AWS Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed AWS deployment instructions including:
- S3 + CloudFront for frontend
- ECS Fargate for backend
- RDS PostgreSQL for database
- CI/CD with GitHub Actions

## 🎯 Roadmap

### ✅ Phase 1: Micro-Frontend (Completed)
- Shell application with routing
- Orders and Billing MFEs
- Backend API with authentication
- Docker development environment

### 🚧 Phase 2: Multi-Tenancy (In Progress)
- Tenant-based data isolation
- Tenant-aware routing
- Feature flags system
- RBAC implementation
- Custom theming engine
- Admin dashboard

### 📋 Phase 3: Advanced Features (Planned)
- Real-time notifications
- Analytics dashboard
- Payment gateway integration
- Email service integration
- Mobile app (React Native)
- Advanced reporting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by real-world SaaS architectures
- Designed for scalability and maintainability

## 📧 Contact

For questions or support:
- Create an issue in the repository
- Review documentation in `/docs`
- Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for overview

---

**⭐ Star this repo if you find it helpful!**

Built with ❤️ using React, TypeScript, and Module Federation
