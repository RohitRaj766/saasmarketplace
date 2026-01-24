# Deployment Guide

## Production Deployment Strategy

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CDN (CloudFlare)                     │
│                    Static Assets Distribution                │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Load Balancer (AWS ALB)                   │
└─────────┬───────────────────────┬───────────────────────────┘
          │                       │
┌─────────▼──────────┐  ┌────────▼──────────┐
│   Shell App        │  │   Backend API     │
│   (S3 + CloudFront)│  │   (ECS/Fargate)   │
│                    │  │   Auto-scaling    │
└─────────┬──────────┘  └────────┬──────────┘
          │                      │
┌─────────▼──────────┐  ┌────────▼──────────┐
│   Orders MFE       │  │   PostgreSQL      │
│   (S3 + CloudFront)│  │   (RDS)           │
└────────────────────┘  │   Read Replicas   │
                        └───────────────────┘
┌────────────────────┐
│   Billing MFE      │
│   (S3 + CloudFront)│
└────────────────────┘
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test

  build-shell:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd shell && npm install && npm run build
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync shell/dist s3://your-shell-bucket --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} --paths "/*"

  build-orders-mfe:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd orders-mfe && npm install && npm run build
      - uses: aws-actions/configure-aws-credentials@v2
      - run: aws s3 sync orders-mfe/dist s3://your-orders-bucket --delete

  build-billing-mfe:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd billing-mfe && npm install && npm run build
      - uses: aws-actions/configure-aws-credentials@v2
      - run: aws s3 sync billing-mfe/dist s3://your-billing-bucket --delete

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
      - run: |
          aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
          docker build -t backend ./backend
          docker tag backend:latest ${{ secrets.ECR_REGISTRY }}/backend:latest
          docker push ${{ secrets.ECR_REGISTRY }}/backend:latest
      - run: aws ecs update-service --cluster saas-cluster --service backend-service --force-new-deployment
```

## AWS Infrastructure Setup

### 1. S3 Buckets for Frontend

```bash
# Create S3 buckets
aws s3 mb s3://saas-shell-prod
aws s3 mb s3://saas-orders-mfe-prod
aws s3 mb s3://saas-billing-mfe-prod

# Enable static website hosting
aws s3 website s3://saas-shell-prod --index-document index.html --error-document index.html

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket saas-shell-prod --policy file://bucket-policy.json
```

### 2. CloudFront Distribution

```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

**cloudfront-config.json:**
```json
{
  "Origins": [
    {
      "Id": "S3-saas-shell",
      "DomainName": "saas-shell-prod.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-saas-shell",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "Enabled": true,
  "Comment": "SaaS Shell Distribution"
}
```

### 3. RDS PostgreSQL

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier saas-db-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username admin \
  --master-user-password <secure-password> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name saas-db-subnet \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted
```

### 4. ECS Cluster for Backend

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name saas-cluster

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster saas-cluster \
  --service-name backend-service \
  --task-definition backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

## Environment Configuration

### Production Environment Variables

**Backend (.env.production):**
```bash
DATABASE_URL=postgresql://admin:password@saas-db-prod.xxxxx.rds.amazonaws.com:5432/saas_dashboard
JWT_SECRET=<generate-secure-secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<generate-secure-secret>
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://app.yourdomain.com
```

**Frontend (shell/.env.production):**
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_ORDERS_MFE_URL=https://orders.yourdomain.com
VITE_BILLING_MFE_URL=https://billing.yourdomain.com
```

## Docker Production Build

### Optimized Dockerfiles

**Backend Dockerfile.prod:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 4000

CMD ["node", "dist/server.js"]
```

**Frontend Dockerfile.prod:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Database Migration Strategy

### Zero-Downtime Migrations

```bash
# 1. Create migration
cd backend
npx prisma migrate dev --name add_new_feature

# 2. Test migration on staging
DATABASE_URL=<staging-url> npx prisma migrate deploy

# 3. Deploy to production during low-traffic window
DATABASE_URL=<production-url> npx prisma migrate deploy

# 4. Rollback if needed
DATABASE_URL=<production-url> npx prisma migrate resolve --rolled-back <migration-name>
```

## Monitoring & Logging

### 1. CloudWatch Setup

```bash
# Create log groups
aws logs create-log-group --log-group-name /ecs/backend
aws logs create-log-group --log-group-name /ecs/shell

# Set retention
aws logs put-retention-policy --log-group-name /ecs/backend --retention-in-days 30
```

### 2. Application Monitoring

Install monitoring tools:

```bash
npm install @sentry/node @sentry/tracing
npm install prom-client
```

**backend/src/monitoring/sentry.ts:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 3. Health Checks

```typescript
// backend/src/app.ts
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});
```

## Security Hardening

### 1. SSL/TLS Configuration

```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names *.yourdomain.com \
  --validation-method DNS
```

### 2. Security Headers

```typescript
// backend/src/app.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

### 3. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', limiter);
```

## Backup Strategy

### 1. Database Backups

```bash
# Automated RDS backups (already configured)
# Manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier saas-db-prod \
  --db-snapshot-identifier saas-db-manual-$(date +%Y%m%d)

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier saas-db-restored \
  --db-snapshot-identifier saas-db-manual-20240124
```

### 2. Application State Backup

```bash
# Backup S3 buckets
aws s3 sync s3://saas-shell-prod s3://saas-shell-backup-$(date +%Y%m%d) --storage-class GLACIER
```

## Performance Optimization

### 1. CDN Configuration

- Enable Gzip/Brotli compression
- Set appropriate cache headers
- Use HTTP/2
- Enable edge caching

### 2. Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_invoices_status_due ON invoices(status, due_date);

-- Analyze tables
ANALYZE orders;
ANALYZE invoices;
```

### 3. API Optimization

```typescript
// Implement response caching
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 });

app.get('/orders', authenticate, async (req, res) => {
  const cacheKey = `orders:${req.user.userId}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }
  
  const orders = await ordersService.getOrders(req.user.userId);
  cache.set(cacheKey, orders);
  res.json(orders);
});
```

## Rollback Procedure

### Quick Rollback Steps

1. **Frontend Rollback:**
```bash
# Revert to previous S3 version
aws s3api list-object-versions --bucket saas-shell-prod --prefix index.html
aws s3api copy-object --bucket saas-shell-prod --copy-source saas-shell-prod/index.html?versionId=<previous-version> --key index.html
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

2. **Backend Rollback:**
```bash
# Rollback ECS service to previous task definition
aws ecs update-service --cluster saas-cluster --service backend-service --task-definition backend:previous-version
```

3. **Database Rollback:**
```bash
# Restore from snapshot (last resort)
aws rds restore-db-instance-from-db-snapshot --db-instance-identifier saas-db-prod --db-snapshot-identifier <snapshot-id>
```

## Cost Optimization

### Estimated Monthly Costs (AWS)

- **RDS (db.t3.medium):** $70
- **ECS Fargate (2 tasks):** $50
- **S3 + CloudFront:** $20
- **Load Balancer:** $20
- **Data Transfer:** $30
- **Total:** ~$190/month

### Cost Reduction Tips

1. Use Reserved Instances for predictable workloads
2. Enable S3 Intelligent-Tiering
3. Use CloudFront caching aggressively
4. Implement auto-scaling for ECS
5. Use Spot Instances for non-critical tasks

## Checklist

- [ ] AWS infrastructure provisioned
- [ ] CI/CD pipeline configured
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] Database migrations tested
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Security hardening applied
- [ ] Performance optimized
- [ ] Rollback procedure documented
- [ ] Team trained on deployment
- [ ] Runbook created

## Support & Maintenance

### Daily Tasks
- Monitor error rates
- Check application logs
- Review performance metrics

### Weekly Tasks
- Review security alerts
- Analyze cost reports
- Update dependencies

### Monthly Tasks
- Database maintenance
- Backup verification
- Security audit
- Performance review
